import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { PDFReportService } from "../services/pdfReportService";
import { ExcelReportService } from "../services/excelReportService";
import { z } from "zod";

export const createReportSchema = z.object({
  projectId: z.string(),
  weather: z.string().optional(),
  workforceCount: z.number().int().nonnegative(),
  equipmentOnSite: z.string().optional(),
  workSummary: z.string().min(5),
  issuesDelays: z.string().optional(),
});

export const reportController = {
  createDailyReport: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = createReportSchema.parse(req.body);
      const report = await prisma.dailyReport.create({
        data: {
          ...data,
          authorId: req.user?.id || "demo-author-id",
        },
      });
      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to create daily report" });
    }
  },

  downloadDailyReportPDF: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const reportId = String(req.params.reportId);
      const report = await (prisma.dailyReport.findUnique as any)({
        where: { id: reportId },
        include: {
          project: true,
          author: true,
        },
      });

      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="daily-report-${report.project.code}-${report.id.substring(0, 8)}.pdf"`
      );

      PDFReportService.generateDailyReportPDF(
        {
          projectName: report.project.name,
          projectCode: report.project.code,
          location: report.project.location,
          reportDate: report.reportDate.toISOString().split("T")[0],
          authorName: report.author?.name || "Site Engineer",
          weather: report.weather || "Clear / Normal",
          workforceCount: report.workforceCount,
          equipmentOnSite: report.equipmentOnSite || "Standard machinery",
          workSummary: report.workSummary,
          issuesDelays: report.issuesDelays || "None",
        },
        res
      );
    } catch (error) {
      res.status(500).json({ error: "Failed to generate PDF report" });
    }
  },

  exportMaterialsExcel: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const projectId = String(req.params.projectId);
      const project = await (prisma.project.findUnique as any)({
        where: { id: projectId },
        include: { materials: true },
      });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      const rows = ((project as any).materials || []).map((m: any) => ({
        name: m.name,
        category: m.category || "General",
        quantity: Number(m.quantity),
        unit: m.unit,
        unitPrice: Number(m.unitPrice),
        totalCost: Number(m.totalCost),
        supplier: m.supplier || "N/A",
        status: m.status,
      }));

      await ExcelReportService.generateMaterialReport(project.name, rows, res);
    } catch (error) {
      res.status(500).json({ error: "Failed to export Excel report" });
    }
  },
};
