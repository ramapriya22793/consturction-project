import PDFDocument from "pdfkit";
import { Response } from "express";

export interface SiteReportData {
  projectName: string;
  projectCode: string;
  location: string;
  reportDate: string;
  authorName: string;
  weather: string;
  workforceCount: number;
  equipmentOnSite: string;
  workSummary: string;
  issuesDelays: string;
}

export class PDFReportService {
  /**
   * Generates a Civil Site Daily Progress Report as a PDF stream
   */
  static generateDailyReportPDF(data: SiteReportData, stream: Response): void {
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    doc.pipe(stream);

    // Header styling
    doc
      .rect(40, 40, 515, 60)
      .fill("#1e293b"); // Slate 800

    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("CIVIL PROJECT - DAILY PROGRESS REPORT", 55, 52);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#94a3b8")
      .text(`Generated on: ${new Date().toLocaleDateString()}`, 55, 78);

    doc.moveDown(3);

    // Project Information Section
    doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold").text("Project Details");
    doc.moveDown(0.5);

    const startY = doc.y;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#334155")
      .text("Project Name:", 40, startY)
      .font("Helvetica")
      .text(data.projectName, 140, startY)
      .font("Helvetica-Bold")
      .text("Project Code:", 320, startY)
      .font("Helvetica")
      .text(data.projectCode, 410, startY);

    const row2Y = startY + 20;
    doc
      .font("Helvetica-Bold")
      .text("Site Location:", 40, row2Y)
      .font("Helvetica")
      .text(data.location, 140, row2Y)
      .font("Helvetica-Bold")
      .text("Report Date:", 320, row2Y)
      .font("Helvetica")
      .text(data.reportDate, 410, row2Y);

    const row3Y = row2Y + 20;
    doc
      .font("Helvetica-Bold")
      .text("Prepared By:", 40, row3Y)
      .font("Helvetica")
      .text(data.authorName, 140, row3Y)
      .font("Helvetica-Bold")
      .text("Weather:", 320, row3Y)
      .font("Helvetica")
      .text(data.weather || "Sunny / Clear", 410, row3Y);

    doc.moveDown(3);

    // Site Resource Metrics
    doc.fillColor("#0f172a").fontSize(14).font("Helvetica-Bold").text("Site Resources & Activity");
    doc.moveDown(0.5);

    const resourceY = doc.y;
    doc
      .rect(40, resourceY, 250, 40)
      .fillAndStroke("#f1f5f9", "#cbd5e1");
    doc
      .fillColor("#0f172a")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Active Workforce / Laborers", 50, resourceY + 8)
      .fontSize(14)
      .text(`${data.workforceCount} Persons`, 50, resourceY + 22);

    doc
      .rect(305, resourceY, 250, 40)
      .fillAndStroke("#f1f5f9", "#cbd5e1");
    doc
      .fillColor("#0f172a")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Equipment On-Site", 315, resourceY + 8)
      .fontSize(10)
      .font("Helvetica")
      .text(data.equipmentOnSite || "Standard excavators & concrete mixers", 315, resourceY + 24, { width: 230 });

    doc.y = resourceY + 60;

    // Work Summary Section
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("Work Executed Today");
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#334155")
      .text(data.workSummary || "No work details reported.", { lineGap: 4 });

    doc.moveDown(1.5);

    // Issues & Delays Section
    doc.fillColor("#0f172a").fontSize(13).font("Helvetica-Bold").text("Issues, Safety & Delays");
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(data.issuesDelays ? "#b91c1c" : "#334155")
      .text(data.issuesDelays || "Nil / No critical impediments reported.", { lineGap: 4 });

    doc.moveDown(2);

    // Signatures
    const sigY = 700;
    doc
      .strokeColor("#94a3b8")
      .moveTo(40, sigY)
      .lineTo(200, sigY)
      .stroke();
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#334155")
      .text("Site Engineer Signature", 40, sigY + 5);

    doc
      .moveTo(350, sigY)
      .lineTo(515, sigY)
      .stroke();
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Project Manager Signature", 350, sigY + 5);

    doc.end();
  }
}
