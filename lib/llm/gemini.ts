import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Model configuration
const MODEL_NAME = "gemini-2.5-flash";

// Get model instance with safety settings
function getModel() {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
}

// Types for function parameters
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

type University = {
  name: string;
  country: string;
  city: string;
};

type Program = {
  name: string;
  degreeLevel: string;
  fieldOfStudy: string;
  tuitionPerYear: number;
  minGpa: number | null;
  gpaScale: string | null;
  minEnglishScore: number | null;
  englishTestType: string | null;
  deadline: Date | null;
  university: University;
};

type Match = {
  fitScore: number;
  tier: string;
};

/**
 * 1. Explain why a program matches the student's profile
 */
export async function generateProgramExplanation(params: {
  profile: StudentProfile;
  program: Program & { university: University };
  match: Match;
}): Promise<string> {
  const { profile, program, match } = params;

  const prompt = `You are an expert university admissions counselor. A student is considering applying to a program, and you need to explain why this program is a good fit for them.

Student Profile:
- Citizenship: ${profile.citizenshipCountry}
- Target Countries: ${profile.targetCountries.join(", ")}
- Degree Level: ${profile.degreeLevel}
- Major Interests: ${profile.majorInterests.join(", ")}
- GPA: ${profile.gpa || "Not provided"} / ${profile.gpaScale || "N/A"}
- English Test: ${profile.englishTestType || "Not provided"} - ${profile.englishScore || "N/A"}
- Budget Range: $${profile.budgetMin || "0"} - $${profile.budgetMax || "unlimited"} per year
- Target Intake: ${profile.intakeTerm || "Not specified"} ${profile.intakeYear || ""}

Program Details:
- Program: ${program.name}
- University: ${program.university.name}
- Location: ${program.university.city}, ${program.university.country}
- Degree Level: ${program.degreeLevel}
- Field: ${program.fieldOfStudy}
- Tuition: $${program.tuitionPerYear} per year
- Min GPA Required: ${program.minGpa || "Not specified"} / ${program.gpaScale || "N/A"}
- English Requirement: ${program.englishTestType || "Not specified"} - ${program.minEnglishScore || "N/A"}
- Application Deadline: ${program.deadline ? program.deadline.toLocaleDateString() : "Not specified"}

Match Information:
- Fit Score: ${match.fitScore}%
- Tier: ${match.tier}

Please provide a 2-3 paragraph explanation covering:
1. Why this program is a ${match.tier} match for the student
2. How the student's profile aligns with requirements (GPA, test scores, budget)
3. Any strengths or concerns the student should be aware of

Be encouraging but honest. Keep it conversational and helpful.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating program explanation:", error);
    return "Unable to generate explanation at this time. Please try again later.";
  }
}

/**
 * 2. Generate document checklist for a program
 */
export async function generateChecklist(params: {
  profile: StudentProfile;
  program: Program & { university: University };
}): Promise<string[]> {
  const { profile, program } = params;

  const prompt = `You are an expert university admissions counselor. Generate a comprehensive checklist of required documents for a university application.

Student Profile:
- Degree Level: ${profile.degreeLevel}
- Target Program: ${program.name}
- University: ${program.university.name}
- Country: ${program.university.country}

Based on typical requirements for ${profile.degreeLevel} programs in ${program.fieldOfStudy} at universities in ${program.university.country}, list ALL required documents.

Return ONLY a bulleted list of documents, one per line, starting with a dash (-). No additional text or explanations.

Example format:
- Statement of Purpose
- Official Transcripts
- Letters of Recommendation (2-3)

Include standard documents like transcripts, test scores, recommendation letters, statements, financial documents, etc.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the response into an array
    const documents = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.startsWith("-") || line.match(/^\d+\./))
      .map(line => line.replace(/^-\s*/, "").replace(/^\d+\.\s*/, "").trim())
      .filter(line => line.length > 0);

    return documents.length > 0 ? documents : [
      "Statement of Purpose",
      "Official Transcripts",
      "Letters of Recommendation (2-3)",
      "English Test Scores",
      "Resume/CV",
      "Financial Documents"
    ];
  } catch (error) {
    console.error("Error generating checklist:", error);
    // Return default checklist on error
    return [
      "Statement of Purpose",
      "Official Transcripts",
      "Letters of Recommendation (2-3)",
      "English Test Scores",
      "Resume/CV",
      "Financial Documents"
    ];
  }
}

/**
 * 3. Generate email templates
 */
export async function generateEmailTemplate(params: {
  profile: StudentProfile;
  program: Program & { university: University };
  templateType: "scholarship" | "fee_waiver" | "question";
  customContext?: string;
}): Promise<{ subject: string; body: string }> {
  const { profile, program, templateType, customContext } = params;

  let promptContext = "";
  switch (templateType) {
    case "scholarship":
      promptContext = "requesting information about scholarship opportunities";
      break;
    case "fee_waiver":
      promptContext = "requesting an application fee waiver";
      break;
    case "question":
      promptContext = customContext || "asking a general question about the program";
      break;
  }

  const prompt = `You are helping a student draft a professional email to a university admissions office.

Student Background:
- Name: [Student will fill in]
- From: ${profile.citizenshipCountry}
- Interested in: ${program.degreeLevel} in ${program.fieldOfStudy}
- GPA: ${profile.gpa || "Strong academic record"}

Target:
- University: ${program.university.name}
- Program: ${program.name}
- Location: ${program.university.city}, ${program.university.country}

Email Purpose: ${promptContext}

Generate a professional email with:
1. An appropriate subject line
2. A polite, well-structured body that:
   - Introduces the student briefly
   - States the purpose clearly
   - Demonstrates genuine interest in the program
   - Requests the appropriate information or waiver
   - Thanks them and provides contact information placeholder

Format your response EXACTLY as:
SUBJECT: [subject line here]

BODY:
[email body here]

Keep it concise (200-300 words), professional, and respectful.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse subject and body
    const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
    const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);

    const subject = subjectMatch ? subjectMatch[1].trim() : `Inquiry about ${program.name}`;
    const body = bodyMatch ? bodyMatch[1].trim() : text;

    return { subject, body };
  } catch (error) {
    console.error("Error generating email template:", error);
    return {
      subject: `Inquiry about ${program.name} - ${templateType}`,
      body: "Unable to generate email template at this time. Please try again later."
    };
  }
}

/**
 * 4. Answer general queries about programs
 */
export async function answerQuery(params: {
  profile: StudentProfile;
  matches: Array<Match & { program: Program & { university: University } }>;
  query: string;
}): Promise<string> {
  const { profile, matches, query } = params;

  // Build context about matches
  const matchesContext = matches
    .slice(0, 10) // Limit to top 10 to avoid token limits
    .map((m, i) => 
      `${i + 1}. ${m.program.name} at ${m.program.university.name} (${m.program.university.country}) - ${m.tier} tier, ${m.fitScore}% fit, $${m.program.tuitionPerYear}/year`
    )
    .join("\n");

  const prompt = `You are an expert university admissions counselor helping a student with their application journey.

Student Profile:
- Citizenship: ${profile.citizenshipCountry}
- Target Countries: ${profile.targetCountries.join(", ")}
- Degree Level: ${profile.degreeLevel}
- Major Interests: ${profile.majorInterests.join(", ")}
- GPA: ${profile.gpa || "Not provided"}
- Budget: $${profile.budgetMin || "0"} - $${profile.budgetMax || "unlimited"} per year

Current Matches (${matches.length} programs):
${matchesContext}

Student Question: "${query}"

Provide a helpful, accurate, and conversational response. If the question is about:
- Specific programs: Reference their matches
- Filtering/refining: Suggest how to narrow down options
- Requirements: Explain what's typically needed
- Strategy: Offer application advice

Keep your response concise (2-3 paragraphs) and actionable.`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error answering query:", error);
    return "I'm having trouble processing your question right now. Please try rephrasing or try again later.";
  }
}

