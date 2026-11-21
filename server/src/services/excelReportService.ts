import ExcelJS from "exceljs";
import { Response } from "express";

export interface MaterialRow {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  status: string;
}

export class ExcelReportService {
  /**
   * Generates a Material & Procurement Excel Workbook for civil projects
   */
  static async generateMaterialReport(
    projectName: string,
    materials: MaterialRow[],
    res: Response
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Civil Project System";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Material Procurement");

    // Title Row
    sheet.mergeCells("A1:H1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = `MATERIAL & PROCUREMENT REPORT - ${projectName.toUpperCase()}`;
    titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" },
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 35;

    // Headers
    const headerRow = sheet.addRow([
      "Item Name",
      "Category",
      "Quantity",
      "Unit",
      "Unit Price ($)",
      "Total Cost ($)",
      "Supplier",
      "Status",
    ]);

    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF334155" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCBD5E1" } },
        bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      };
    });

    // Populate Data
    let grandTotal = 0;
    materials.forEach((m) => {
      grandTotal += m.totalCost;
      const row = sheet.addRow([
        m.name,
        m.category,
        m.quantity,
        m.unit,
        m.unitPrice,
        m.totalCost,
        m.supplier,
        m.status,
      ]);

      row.getCell(3).alignment = { horizontal: "right" };
      row.getCell(5).numFmt = "$#,##0.00";
      row.getCell(6).numFmt = "$#,##0.00";
    });

    // Total Row
    const totalRow = sheet.addRow(["Grand Total", "", "", "", "", grandTotal, "", ""]);
    totalRow.font = { bold: true };
    totalRow.getCell(6).numFmt = "$#,##0.00";

    // Auto-fit Column Widths
    sheet.columns.forEach((column) => {
      let maxLen = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const valStr = cell.value ? cell.value.toString() : "";
        if (valStr.length > maxLen) {
          maxLen = valStr.length + 2;
        }
      });
      column.width = maxLen;
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="materials-${Date.now()}.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
