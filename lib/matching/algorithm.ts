import { prisma } from "@/lib/db";

type StudentProfile = {
  citizenshipCountry: string;
  residenceCountry: string;
  targetCountries: string[];
  degreeLevel: string;
  majorInterests: string[];
  gpa: number | null;
  gpaScale: string | null;
  englishTestType: string | null;
  englishScore: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  intakeTerm: string | null;
  intakeYear: number | null;
};

type Program = {
  id: string;
  name: string;
  degreeLevel: string;
  fieldOfStudy: string;
  tuitionPerYear: number;
  minGpa: number | null;
  gpaScale: string | null;
  minEnglishScore: number | null;
  englishTestType: string | null;
  deadline: Date | null;
  university: {
    country: string;
  };
};

/**
 * Normalize GPA to 4.0 scale for comparison
 */
function normalizeGPA(gpa: number, scale: string): number {
  switch (scale) {
    case "5.0":
      return (gpa / 5.0) * 4.0;
    case "100":
      return (gpa / 100) * 4.0;
    case "4.0":
    default:
      return gpa;
  }
}

/**
 * Check if student meets program's eligibility requirements
 */
function isEligible(profile: StudentProfile, program: Program): boolean {
  // 1. Check degree level match
  if (profile.degreeLevel !== program.degreeLevel) {
    return false;
  }

  // 2. Check GPA requirement
  if (program.minGpa && profile.gpa && profile.gpaScale && program.gpaScale) {
    const studentGPA = normalizeGPA(profile.gpa, profile.gpaScale);
    const requiredGPA = normalizeGPA(program.minGpa, program.gpaScale);
    if (studentGPA < requiredGPA) {
      return false;
    }
  }

  // 3. Check English score requirement
  if (
    program.minEnglishScore &&
    profile.englishScore &&
    profile.englishTestType === program.englishTestType
  ) {
    if (profile.englishScore < program.minEnglishScore) {
      return false;
    }
  }

  // 4. Check if deadline has passed
  if (program.deadline && program.deadline < new Date()) {
    return false;
  }

  return true;
}

/**
 * Calculate fit score (0-100) based on various factors
 */
function calculateFitScore(profile: StudentProfile, program: Program): number {
  let score = 0;
  const weights = {
    budget: 30,
    country: 25,
    major: 25,
    academic: 20,
  };

  // 1. Budget compatibility (30%)
  const tuition = program.tuitionPerYear;
  const minBudget = profile.budgetMin || 0;
  const maxBudget = profile.budgetMax || Infinity;

  if (tuition >= minBudget && tuition <= maxBudget) {
    // Perfect fit
    score += weights.budget;
  } else if (tuition < minBudget) {
    // Below budget - still good but might have concerns
    score += weights.budget * 0.8;
  } else if (tuition > maxBudget) {
    // Over budget - calculate penalty based on how much over
    const overagePercent = ((tuition - maxBudget) / maxBudget) * 100;
    if (overagePercent <= 20) {
      score += weights.budget * 0.6;
    } else if (overagePercent <= 50) {
      score += weights.budget * 0.3;
    }
    // Else 0 points for budget
  }

  // 2. Country/region match (25%)
  if (profile.targetCountries.includes(program.university.country)) {
    score += weights.country;
  } else {
    // Not in target countries
    score += weights.country * 0.3;
  }

  // 3. Major alignment (25%)
  const fieldMatch = profile.majorInterests.some((interest) =>
    program.fieldOfStudy.toLowerCase().includes(interest.toLowerCase()) ||
    interest.toLowerCase().includes(program.fieldOfStudy.toLowerCase())
  );
  if (fieldMatch) {
    score += weights.major;
  } else {
    // Partial match if in same broad category
    score += weights.major * 0.5;
  }

  // 4. Academic profile fit (20%)
  if (profile.gpa && profile.gpaScale && program.minGpa && program.gpaScale) {
    const studentGPA = normalizeGPA(profile.gpa, profile.gpaScale);
    const requiredGPA = normalizeGPA(program.minGpa, program.gpaScale);
    const gpaMargin = studentGPA - requiredGPA;

    if (gpaMargin >= 0.5) {
      // Significantly exceeds requirement
      score += weights.academic;
    } else if (gpaMargin >= 0.2) {
      // Comfortably meets requirement
      score += weights.academic * 0.8;
    } else if (gpaMargin >= 0) {
      // Just meets requirement
      score += weights.academic * 0.6;
    }
  } else {
    // No GPA data - give neutral score
    score += weights.academic * 0.5;
  }

  return Math.round(score);
}

/**
 * Categorize match into tier based on fit score and requirements
 */
function determineTier(fitScore: number, profile: StudentProfile, program: Program): string {
  // Check how much student exceeds requirements
  let exceedsRequirements = false;
  if (profile.gpa && profile.gpaScale && program.minGpa && program.gpaScale) {
    const studentGPA = normalizeGPA(profile.gpa, profile.gpaScale);
    const requiredGPA = normalizeGPA(program.minGpa, program.gpaScale);
    exceedsRequirements = studentGPA >= requiredGPA + 0.5;
  }

  if (fitScore >= 70 && exceedsRequirements) {
    return "SAFE";
  } else if (fitScore >= 50 && fitScore < 70) {
    return "MATCH";
  } else {
    return "REACH";
  }
}

/**
 * Main matching function - finds and scores programs for a student
 */
export async function matchProgramsForStudent(
  userId: string,
  profile: StudentProfile
): Promise<void> {
  // Fetch all programs from database
  const programs = await prisma.program.findMany({
    include: {
      university: true,
    },
  });

  console.log(`\n🔍 Matching for user ${userId}`);
  console.log(`📚 Total programs in database: ${programs.length}`);
  console.log(`🎓 Looking for degree level: "${profile.degreeLevel}"`);
  console.log(`🌍 Target countries: ${profile.targetCountries.join(", ")}`);

  // Clear existing matches for this user
  await prisma.match.deleteMany({
    where: { userId },
  });

  // Process each program
  const matches = [];
  const eligibilityReasons: Record<string, number> = {};

  for (const program of programs) {
    // Check eligibility
    const eligible = isEligible(profile, program);
    
    if (!eligible) {
      // Track why programs are being filtered out
      if (profile.degreeLevel !== program.degreeLevel) {
        eligibilityReasons["degree mismatch"] = (eligibilityReasons["degree mismatch"] || 0) + 1;
      } else if (program.minGpa && profile.gpa && profile.gpaScale && program.gpaScale) {
        const studentGPA = normalizeGPA(profile.gpa, profile.gpaScale);
        const requiredGPA = normalizeGPA(program.minGpa, program.gpaScale);
        if (studentGPA < requiredGPA) {
          eligibilityReasons["GPA too low"] = (eligibilityReasons["GPA too low"] || 0) + 1;
        }
      } else if (program.deadline && program.deadline < new Date()) {
        eligibilityReasons["deadline passed"] = (eligibilityReasons["deadline passed"] || 0) + 1;
      }
      continue;
    }

    // Calculate fit score
    const fitScore = calculateFitScore(profile, program);

    // Determine tier
    const tier = determineTier(fitScore, profile, program);

    // Create match record
    matches.push({
      userId,
      programId: program.id,
      fitScore,
      tier,
    });
  }

  console.log(`✅ Eligible programs: ${matches.length}`);
  console.log(`❌ Filtered out reasons:`, eligibilityReasons);

  // Save matches to database
  if (matches.length > 0) {
    await prisma.match.createMany({
      data: matches,
    });
  }
}

/**
 * Get matches for a user with full program details
 */
export async function getMatchesForUser(userId: string) {
  return await prisma.match.findMany({
    where: { userId },
    include: {
      program: {
        include: {
          university: true,
        },
      },
    },
    orderBy: {
      fitScore: "desc",
    },
  });
}

/**
 * Get match statistics for a user
 */
export async function getMatchStats(userId: string) {
  const matches = await prisma.match.findMany({
    where: { userId },
  });

  return {
    total: matches.length,
    safe: matches.filter((m) => m.tier === "SAFE").length,
    match: matches.filter((m) => m.tier === "MATCH").length,
    reach: matches.filter((m) => m.tier === "REACH").length,
  };
}

