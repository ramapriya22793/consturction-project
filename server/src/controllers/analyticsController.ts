import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";

export const analyticsController = {
  getProjectStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const [totalProjects, activeProjects, totalTasks, completedTasks, recentReports] =
        await Promise.all([
          prisma.project.count(),
          prisma.project.count({ where: { status: "IN_PROGRESS" } }),
          prisma.task.count(),
          prisma.task.count({ where: { status: "COMPLETED" } }),
          prisma.dailyReport.findMany({
            take: 7,
            orderBy: { reportDate: "desc" },
            select: {
              reportDate: true,
              workforceCount: true,
            },
          }),
        ]);

      const projects = await prisma.project.findMany({
        select: {
          name: true,
          budget: true,
          spent: true,
        },
      });

      const budgetOverview = projects.map((p) => ({
        name: p.name,
        budget: Number(p.budget),
        spent: Number(p.spent),
      }));

      const workforceTrend = recentReports
        .reverse()
        .map((r) => ({
          date: r.reportDate.toISOString().split("T")[0],
          workforce: r.workforceCount,
        }));

      res.json({
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        budgetOverview,
        workforceTrend,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate analytics" });
    }
  },
};
