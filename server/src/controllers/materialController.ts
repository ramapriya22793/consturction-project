import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { z } from "zod";

export const createMaterialSchema = z.object({
  projectId: z.string(),
  name: z.string().min(2),
  category: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  unitPrice: z.number().positive(),
  supplier: z.string().optional(),
  status: z.string().default("ORDERED"),
});

export const materialController = {
  create: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = createMaterialSchema.parse(req.body);
      const totalCost = data.quantity * data.unitPrice;

      const material = await prisma.material.create({
        data: {
          ...data,
          totalCost,
        },
      });

      // Update project spent
      await prisma.project.update({
        where: { id: data.projectId },
        data: { spent: { increment: totalCost } },
      });

      res.status(201).json(material);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create material entry" });
    }
  },

  getAllByProject: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const projectId = String(req.params.projectId);
      const materials = await prisma.material.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  },
};
