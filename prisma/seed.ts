import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.match.deleteMany();
  await prisma.program.deleteMany();
  await prisma.university.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Cleared existing data");

  // Create mock user
  const user = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      name: "John Doe",
    },
  });

  console.log("✅ Created mock user");

  // Create universities
  const universities = await Promise.all([
    // USA Universities
    prisma.university.create({
      data: { name: "Massachusetts Institute of Technology", country: "USA", city: "Cambridge" },
    }),
    prisma.university.create({
      data: { name: "Stanford University", country: "USA", city: "Stanford" },
    }),
    prisma.university.create({
      data: { name: "Carnegie Mellon University", country: "USA", city: "Pittsburgh" },
    }),
    prisma.university.create({
      data: { name: "University of California, Berkeley", country: "USA", city: "Berkeley" },
    }),
    prisma.university.create({
      data: { name: "Georgia Institute of Technology", country: "USA", city: "Atlanta" },
    }),
    
    // Canada Universities
    prisma.university.create({
      data: { name: "University of Toronto", country: "Canada", city: "Toronto" },
    }),
    prisma.university.create({
      data: { name: "University of British Columbia", country: "Canada", city: "Vancouver" },
    }),
    prisma.university.create({
      data: { name: "McGill University", country: "Canada", city: "Montreal" },
    }),
    prisma.university.create({
      data: { name: "University of Waterloo", country: "Canada", city: "Waterloo" },
    }),
    
    // UK Universities
    prisma.university.create({
      data: { name: "University of Oxford", country: "UK", city: "Oxford" },
    }),
    prisma.university.create({
      data: { name: "University of Cambridge", country: "UK", city: "Cambridge" },
    }),
    prisma.university.create({
      data: { name: "Imperial College London", country: "UK", city: "London" },
    }),
    
    // Germany Universities
    prisma.university.create({
      data: { name: "Technical University of Munich", country: "Germany", city: "Munich" },
    }),
    prisma.university.create({
      data: { name: "RWTH Aachen University", country: "Germany", city: "Aachen" },
    }),
    
    // Australia Universities
    prisma.university.create({
      data: { name: "University of Melbourne", country: "Australia", city: "Melbourne" },
    }),
    prisma.university.create({
      data: { name: "Australian National University", country: "Australia", city: "Canberra" },
    }),
  ]);

  console.log("✅ Created universities");

  // Create programs
  const programs = [];

  // Computer Science Programs
  programs.push(
    // USA - Top tier
    {
      universityId: universities[0].id, // MIT
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 55000,
      minGpa: 3.5,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-15"),
      tags: ["AI", "Machine Learning", "Top Ranked"],
    },
    {
      universityId: universities[1].id, // Stanford
      name: "MS in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 57000,
      minGpa: 3.6,
      gpaScale: "4.0",
      minEnglishScore: 100,
      englishTestType: "TOEFL",
      deadline: new Date("2025-12-01"),
      tags: ["AI", "Systems", "Top Ranked"],
    },
    {
      universityId: universities[2].id, // CMU
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 50000,
      minGpa: 3.4,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-10"),
      tags: ["Robotics", "AI", "Top Ranked"],
    },
    {
      universityId: universities[3].id, // Berkeley
      name: "Master of Engineering in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 48000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 90,
      englishTestType: "TOEFL",
      deadline: new Date("2026-01-15"),
      tags: ["Data Science", "AI"],
    },
    {
      universityId: universities[4].id, // Georgia Tech
      name: "MS in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 35000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-01"),
      tags: ["Computing Systems", "Affordable"],
    },

    // Canada Programs
    {
      universityId: universities[5].id, // UofT
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 28000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["AI", "Machine Learning"],
    },
    {
      universityId: universities[6].id, // UBC
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 25000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-31"),
      tags: ["Software Engineering", "Affordable"],
    },
    {
      universityId: universities[7].id, // McGill
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 22000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-15"),
      tags: ["Theory", "Affordable"],
    },
    {
      universityId: universities[8].id, // Waterloo
      name: "Master of Mathematics in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 26000,
      minGpa: 3.2,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-10"),
      tags: ["Co-op", "Software Engineering"],
    }
  );

  // Data Science Programs
  programs.push(
    {
      universityId: universities[2].id, // CMU
      name: "Master of Science in Data Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Data Science",
      tuitionPerYear: 52000,
      minGpa: 3.4,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-15"),
      tags: ["Machine Learning", "Statistics"],
    },
    {
      universityId: universities[5].id, // UofT
      name: "Master of Science in Data Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Data Science",
      tuitionPerYear: 30000,
      minGpa: 3.2,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-20"),
      tags: ["Big Data", "Analytics"],
    }
  );

  // Software Engineering Programs
  programs.push(
    {
      universityId: universities[6].id, // UBC
      name: "Master of Software Systems",
      degreeLevel: "Masters",
      fieldOfStudy: "Software Engineering",
      tuitionPerYear: 27000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-01"),
      tags: ["Full Stack", "Cloud Computing"],
    },
    {
      universityId: universities[8].id, // Waterloo
      name: "Master of Engineering in Software Engineering",
      degreeLevel: "Masters",
      fieldOfStudy: "Software Engineering",
      tuitionPerYear: 28000,
      minGpa: 3.1,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["Industry Co-op", "Agile"],
    }
  );

  // UK Programs
  programs.push(
    {
      universityId: universities[9].id, // Oxford
      name: "MSc in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 38000,
      minGpa: 3.5,
      gpaScale: "4.0",
      minEnglishScore: 7.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-05"),
      tags: ["Research", "Theory"],
    },
    {
      universityId: universities[10].id, // Cambridge
      name: "MPhil in Advanced Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 40000,
      minGpa: 3.6,
      gpaScale: "4.0",
      minEnglishScore: 7.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-01"),
      tags: ["Research Intensive", "Top Ranked"],
    },
    {
      universityId: universities[11].id, // Imperial
      name: "MSc in Computing",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 37000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-31"),
      tags: ["AI", "Machine Learning"],
    }
  );

  // Germany Programs (More affordable)
  programs.push(
    {
      universityId: universities[12].id, // TUM
      name: "Master of Science in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 3000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-03-15"),
      tags: ["Affordable", "Research"],
    },
    {
      universityId: universities[13].id, // RWTH Aachen
      name: "MSc in Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 2500,
      minGpa: 2.9,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-04-30"),
      tags: ["Very Affordable", "Engineering Focus"],
    }
  );

  // Australia Programs
  programs.push(
    {
      universityId: universities[14].id, // Melbourne
      name: "Master of Computer Science",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 42000,
      minGpa: 3.2,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-10-31"),
      tags: ["AI", "Data Science"],
    },
    {
      universityId: universities[15].id, // ANU
      name: "Master of Computing",
      degreeLevel: "Masters",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 45000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-15"),
      tags: ["Research", "Machine Learning"],
    }
  );

  // Add Bachelor's Programs
  programs.push(
    // USA Bachelor's Programs
    {
      universityId: universities[3].id, // Berkeley
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 45000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2025-11-30"),
      tags: ["Top Ranked", "Research"],
    },
    {
      universityId: universities[4].id, // Georgia Tech
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 32000,
      minGpa: 2.8,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["Affordable", "Co-op"],
    },
    
    // Canada Bachelor's Programs
    {
      universityId: universities[5].id, // UofT
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 48000,
      minGpa: 3.2,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["Top Ranked", "Research Intensive"],
    },
    {
      universityId: universities[6].id, // UBC
      name: "Bachelor of Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 40000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-31"),
      tags: ["Beautiful Campus", "Co-op Available"],
    },
    {
      universityId: universities[7].id, // McGill
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 20000,
      minGpa: 2.9,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-01"),
      tags: ["Very Affordable", "Montreal"],
    },
    {
      universityId: universities[8].id, // Waterloo
      name: "Bachelor of Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 45000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-01"),
      tags: ["Co-op Program", "Silicon Valley North"],
    },
    
    // UK Bachelor's Programs
    {
      universityId: universities[11].id, // Imperial
      name: "BEng Computing",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 35000,
      minGpa: 3.5,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["3-Year Program", "London"],
    },
    
    // Germany Bachelor's Programs (Very Affordable)
    {
      universityId: universities[12].id, // TUM
      name: "Bachelor of Science in Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 500,
      minGpa: 2.8,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2026-07-15"),
      tags: ["Very Affordable", "English Taught"],
    },
    {
      universityId: universities[13].id, // RWTH Aachen
      name: "BSc Computer Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 500,
      minGpa: 2.7,
      gpaScale: "4.0",
      minEnglishScore: 6.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-07-15"),
      tags: ["Almost Free", "Engineering Focus"],
    },
    
    // Australia Bachelor's Programs
    {
      universityId: universities[14].id, // Melbourne
      name: "Bachelor of Science in Computing and Software Systems",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 38000,
      minGpa: 3.0,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-31"),
      tags: ["Melbourne", "Research"],
    },
    {
      universityId: universities[15].id, // ANU
      name: "Bachelor of Advanced Computing",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Computer Science",
      tuitionPerYear: 40000,
      minGpa: 3.2,
      gpaScale: "4.0",
      minEnglishScore: 6.5,
      englishTestType: "IELTS",
      deadline: new Date("2025-12-15"),
      tags: ["Capital City", "Flexible Program"],
    },
    
    // Data Science Bachelor's
    {
      universityId: universities[5].id, // UofT
      name: "Bachelor of Science in Data Science",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Data Science",
      tuitionPerYear: 50000,
      minGpa: 3.3,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-01-15"),
      tags: ["Emerging Field", "High Demand"],
    },
    
    // Software Engineering Bachelor's
    {
      universityId: universities[8].id, // Waterloo
      name: "Bachelor of Software Engineering",
      degreeLevel: "Bachelors",
      fieldOfStudy: "Software Engineering",
      tuitionPerYear: 47000,
      minGpa: 3.5,
      gpaScale: "4.0",
      minEnglishScore: 7.0,
      englishTestType: "IELTS",
      deadline: new Date("2026-02-01"),
      tags: ["Top Co-op", "Competitive"],
    }
  );

  await prisma.program.createMany({ data: programs });

  console.log(`✅ Created ${programs.length} programs (Masters + Bachelors)`);
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

