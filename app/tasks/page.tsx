import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateTaskStatus } from "@/app/actions/tasks";

async function TaskItem({ task }: { task: any }) {
  async function handleToggle(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === "DONE" ? "TODO" : "DONE";
    await updateTaskStatus(taskId, newStatus);
    revalidatePath("/tasks");
  }

  return (
    <form action={handleToggle} className="w-full">
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="currentStatus" value={task.status} />
      <button
        type="submit"
        className={`w-full rounded-lg border p-4 text-left transition-colors ${
          task.status === "DONE"
            ? "border-green-200 bg-green-50 opacity-75 hover:opacity-100"
            : task.status === "IN_PROGRESS"
            ? "border-blue-200 bg-blue-50 hover:bg-blue-100"
            : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={task.status === "DONE"}
              readOnly
              className="pointer-events-none h-4 w-4"
            />
            <div>
              <div
                className={`font-medium text-gray-900 ${
                  task.status === "DONE" ? "line-through" : ""
                }`}
              >
                {task.title}
              </div>
              <div className="text-sm text-gray-600">
                {task.program.name} - {task.program.university.name}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {task.dueDate
              ? `Due: ${new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : task.status === "DONE"
              ? `Completed: ${new Date(task.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
              : "No deadline"}
          </div>
        </div>
      </button>
    </form>
  );
}

export default async function TasksPage() {
  // For v1, using mock user
  const mockUserId = "john.doe@example.com";
  
  const user = await prisma.user.findUnique({
    where: { email: mockUserId },
    include: { profile: true },
  });

  // If no profile, redirect to profile page
  if (!user || !user.profile) {
    redirect("/profile");
  }

  // Get all tasks for the user
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

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-gray-600">Manage your application tasks</p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Add Task
        </button>
      </div>

      {/* Task Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-600">To Do</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{todoTasks.length}</div>
        </div>
        <div className="rounded-lg border bg-blue-50 p-4">
          <div className="text-sm text-blue-600">In Progress</div>
          <div className="mt-1 text-2xl font-bold text-blue-700">
            {inProgressTasks.length}
          </div>
        </div>
        <div className="rounded-lg border bg-green-50 p-4">
          <div className="text-sm text-green-600">Completed</div>
          <div className="mt-1 text-2xl font-bold text-green-700">{doneTasks.length}</div>
        </div>
      </div>

      {/* No tasks message */}
      {tasks.length === 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-8 text-center">
          <h3 className="text-lg font-semibold text-blue-900">No tasks yet</h3>
          <p className="mt-2 text-sm text-blue-800">
            Visit a program page and click "Generate Tasks" to create application tasks
            automatically.
          </p>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          {/* TODO Tasks */}
          {todoTasks.length > 0 && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">To Do</h2>
              <div className="space-y-3">
                {todoTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* IN PROGRESS Tasks */}
          {inProgressTasks.length > 0 && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">In Progress</h2>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* COMPLETED Tasks */}
          {doneTasks.length > 0 && (
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Completed</h2>
              <div className="space-y-3">
                {doneTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


