"use server";

import { prisma } from "@/lib/db";
import { matchProgramsForStudent } from "@/lib/matching/algorithm";
import { revalidatePath } from "next/cache";

export async function createOrUpdateProfile(formData: FormData) {
  try {
    // For v1, we're using a mock user - in production, get from session
    const mockUserId = "john.doe@example.com";
    
    // Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { email: mockUserId },
    });

    const userName = formData.get("name") as string || "Student";

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: mockUserId,
          name: userName,
        },
      });
    } else {
      // Update user name if provided
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name: userName },
      });
    }

    // Parse form data
    const majorInterestsRaw = formData.get("majorInterests");
    const majorInterests = majorInterestsRaw
      ? (majorInterestsRaw as string)
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m.length > 0)
      : [];

    // Parse standardized tests JSON
    const standardizedTestsRaw = formData.get("standardizedTests");
    let standardizedTests = null;
    if (standardizedTestsRaw) {
      try {
        const parsed = JSON.parse(standardizedTestsRaw as string);
        standardizedTests = Object.keys(parsed).length > 0 ? parsed : null;
      } catch (e) {
        console.error("Failed to parse standardized tests:", e);
      }
    }

    const profileData = {
      citizenshipCountry: formData.get("citizenshipCountry") as string,
      residenceCountry: formData.get("residenceCountry") as string,
      targetCountries: formData.getAll("targetCountries") as string[],
      degreeLevel: formData.get("degreeLevel") as string,
      majorInterests: majorInterests,
      gpa: parseFloat(formData.get("gpa") as string) || null,
      gpaScale: (formData.get("gpaScale") as string) || null,
      englishTestType: (formData.get("englishTestType") as string) || null,
      englishScore: parseFloat(formData.get("englishScore") as string) || null,
      standardizedTests: standardizedTests,
      budgetMin: parseInt(formData.get("budgetMin") as string) || null,
      budgetMax: parseInt(formData.get("budgetMax") as string) || null,
      intakeTerm: (formData.get("intakeTerm") as string) || null,
      intakeYear: parseInt(formData.get("intakeYear") as string) || null,
    };

    // Create or update profile
    const profile = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        ...profileData,
      },
    });

    // Debug: Log profile data
    console.log("Profile data being saved:", JSON.stringify(profileData, null, 2));

    // Run matching algorithm
    await matchProgramsForStudent(user.id, profileData);

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/programs");

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to save profile";
    return { success: false, error: errorMessage };
  }
}

export async function getProfile() {
  try {
    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
      include: {
        profile: true,
      },
    });

    return user?.profile || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
      include: {
        profile: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

