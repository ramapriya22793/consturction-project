import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { R2StorageService } from "../services/r2StorageService";
import { z } from "zod";
import { DocumentCategory } from "@prisma/client";

export const presignedUrlRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  category: z.nativeEnum(DocumentCategory).default(DocumentCategory.OTHER),
  projectId: z.string(),
  fileSize: z.number().positive(),
});

export const documentController = {
  getUploadUrl: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data = presignedUrlRequestSchema.parse(req.body);
      const presignedData = await R2StorageService.getPresignedUploadUrl(
        data.fileName,
        data.contentType,
        `projects/${data.projectId}/documents`
      );

      res.json(presignedData);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to generate upload URL" });
    }
  },

  confirmUpload: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const schema = z.object({
        projectId: z.string(),
        title: z.string(),
        category: z.nativeEnum(DocumentCategory),
        fileType: z.string(),
        r2Key: z.string(),
        r2Url: z.string().optional(),
        fileSize: z.number().int().positive(),
      });

      const data = schema.parse(req.body);

      const document = await prisma.document.create({
        data: {
          ...data,
          uploadedById: req.user?.id || "demo-user-id",
        },
      });

      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to record document" });
    }
  },

  getDownloadUrl: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const document = await prisma.document.findUnique({ where: { id } });

      if (!document) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      const downloadUrl = await R2StorageService.getPresignedDownloadUrl(document.r2Key);
      res.json({ downloadUrl, title: document.title, fileType: document.fileType });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate download URL" });
    }
  },
};
