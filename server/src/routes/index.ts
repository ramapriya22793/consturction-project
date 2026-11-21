import { Router } from "express";
import { projectController, createProjectSchema } from "../controllers/projectController";
import { reportController, createReportSchema } from "../controllers/reportController";
import { documentController } from "../controllers/documentController";
import { taskController } from "../controllers/taskController";
import { materialController } from "../controllers/materialController";
import { analyticsController } from "../controllers/analyticsController";
import { authenticate } from "../middleware/auth";
import { requireRoles } from "../middleware/rbac";
import { validateRequest } from "../middleware/validate";
import { Role } from "@prisma/client";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Civil Engineering Project API",
    timestamp: new Date().toISOString(),
  });
});

// Analytics (Dashboard)
router.get("/analytics/stats", authenticate, analyticsController.getProjectStats);

// Projects
router.get("/projects", authenticate, projectController.getAll);
router.get("/projects/:id", authenticate, projectController.getById);
router.post(
  "/projects",
  authenticate,
  requireRoles([Role.ADMIN, Role.PROJECT_MANAGER]),
  validateRequest({ body: createProjectSchema }),
  projectController.create
);
router.put(
  "/projects/:id",
  authenticate,
  requireRoles([Role.ADMIN, Role.PROJECT_MANAGER]),
  projectController.update
);

// Daily Site Reports & Exports
router.post(
  "/reports/daily",
  authenticate,
  requireRoles([Role.ADMIN, Role.PROJECT_MANAGER, Role.SITE_ENGINEER]),
  validateRequest({ body: createReportSchema }),
  reportController.createDailyReport
);
router.get("/reports/daily/:reportId/pdf", authenticate, reportController.downloadDailyReportPDF);
router.get("/reports/materials/:projectId/excel", authenticate, reportController.exportMaterialsExcel);

// Cloudflare R2 Documents
router.post("/documents/presigned-upload", authenticate, documentController.getUploadUrl);
router.post("/documents/confirm", authenticate, documentController.confirmUpload);
router.get("/documents/:id/download", authenticate, documentController.getDownloadUrl);

// Tasks
router.post(
  "/tasks",
  authenticate,
  requireRoles([Role.ADMIN, Role.PROJECT_MANAGER, Role.SITE_ENGINEER]),
  taskController.create
);
router.patch("/tasks/:id/status", authenticate, taskController.updateStatus);

// Materials & Inventory
router.post(
  "/materials",
  authenticate,
  requireRoles([Role.ADMIN, Role.PROJECT_MANAGER, Role.SITE_ENGINEER]),
  materialController.create
);
router.get("/materials/project/:projectId", authenticate, materialController.getAllByProject);

export default router;
