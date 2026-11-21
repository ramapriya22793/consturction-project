import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { z } from "zod";

export const createProjectSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(2),
  budget: z.number().positive(),
  clientName: z.string().min(2),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export const projectController = {
  getAll: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const projects = await prisma.project.findMany({
        include: {
          _count: {
            select: {
              tasks: true,
              dailyReports: true,
              documents: true,
              materials: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  },

  getById: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          tasks: {
            include: { assignedTo: { select: { id: true, name: true, role: true } } },
          },
          dailyReports: {
            take: 5,
            orderBy: { reportDate: "desc" },
            include: { author: { select: { name: true } } },
          },
          documents: {
            take: 10,
            orderBy: { createdAt: "desc" },
          },
          materials: true,
        },
      });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  },

  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = createProjectSchema.parse(req.body);
      const project = await prisma.project.create({
        data: {
          ...data,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
        },
      });
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create project" });
    }
  },

  update: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const project = await prisma.project.update({
        where: { id },
        data: req.body,
      });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  },
};
