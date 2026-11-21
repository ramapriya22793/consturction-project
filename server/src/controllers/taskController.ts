import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { TaskStatus, TaskPriority } from "@prisma/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
});

export const taskController = {
  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await prisma.task.create({
        data: {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        },
      });
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create task" });
    }
  },

  updateStatus: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const task = await prisma.task.update({
        where: { id },
        data: { status },
      });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  },
};
