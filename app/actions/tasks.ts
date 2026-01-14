"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createTask(data: {
  programId: string;
  title: string;
  description?: string;
  dueDate?: Date;
}) {
  try {
    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await prisma.task.create({
      data: {
        userId: user.id,
        programId: data.programId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        status: "TODO",
      },
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function getTasks() {
  try {
    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
    });

    if (!user) {
      return [];
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      include: {
        program: {
          include: {
            university: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function autoGenerateTasksForProgram(programId: string) {
  try {
    console.log("🔄 Generating tasks for program:", programId);
    
    // For v1, using mock user
    const mockUserId = "john.doe@example.com";
    
    const user = await prisma.user.findUnique({
      where: { email: mockUserId },
    });

    if (!user) {
      console.error("❌ User not found");
      return { success: false, error: "User not found" };
    }

    console.log("✅ User found:", user.id);

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: { university: true },
    });

    if (!program) {
      console.error("❌ Program not found");
      return { success: false, error: "Program not found" };
    }

    console.log("✅ Program found:", program.name);

    // Check if tasks already exist for this program
    const existingTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        programId: programId,
      },
    });

    if (existingTasks.length > 0) {
      console.log("ℹ️ Tasks already exist for this program");
      revalidatePath("/tasks");
      return { success: true, message: "Tasks already exist" };
    }

    // Standard tasks for any program
    const standardTasks = [
      {
        title: "Write Statement of Purpose",
        description: `Craft a compelling SOP for ${program.name} at ${program.university.name}`,
        dueDate: program.deadline
          ? new Date(program.deadline.getTime() - 30 * 24 * 60 * 60 * 1000)
          : null, // 30 days before deadline
      },
      {
        title: "Request Recommendation Letters (2-3)",
        description: "Contact professors and supervisors for recommendation letters",
        dueDate: program.deadline
          ? new Date(program.deadline.getTime() - 45 * 24 * 60 * 60 * 1000)
          : null, // 45 days before deadline
      },
      {
        title: "Prepare Financial Documents",
        description: "Gather bank statements and financial support documents",
        dueDate: program.deadline
          ? new Date(program.deadline.getTime() - 20 * 24 * 60 * 60 * 1000)
          : null,
      },
      {
        title: "Complete Application Form",
        description: `Fill out the online application for ${program.university.name}`,
        dueDate: program.deadline
          ? new Date(program.deadline.getTime() - 7 * 24 * 60 * 60 * 1000)
          : null, // 7 days before deadline
      },
      {
        title: "Submit Official Transcripts",
        description: "Request and submit official transcripts from previous institutions",
        dueDate: program.deadline
          ? new Date(program.deadline.getTime() - 14 * 24 * 60 * 60 * 1000)
          : null,
      },
    ];

    console.log("📝 Creating", standardTasks.length, "tasks...");

    // Create all tasks
    const result = await prisma.task.createMany({
      data: standardTasks.map((task) => ({
        userId: user.id,
        programId: programId,
        ...task,
        status: "TODO",
      })),
    });

    console.log("✅ Created", result.count, "tasks successfully");

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("❌ Error generating tasks:", error);
    return { success: false, error: "Failed to generate tasks" };
  }
}

