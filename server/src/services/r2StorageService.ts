import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET } from "../config/r2";
import crypto from "crypto";

export interface PresignedUploadResponse {
  uploadUrl: string;
  r2Key: string;
  fileUrl: string;
  expiresIn: number;
}

export class R2StorageService {
  /**
   * Generates a presigned URL for secure direct browser-to-R2 upload
   */
  static async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    folder: string = "documents"
  ): Promise<PresignedUploadResponse> {
    const fileExtension = fileName.split(".").pop();
    const uniqueId = crypto.randomUUID();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const r2Key = `${folder}/${uniqueId}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      ContentType: contentType,
    });

    const expiresIn = 3600; // 1 hour
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn });

    return {
      uploadUrl,
      r2Key,
      fileUrl: `https://${R2_BUCKET}.r2.cloudflarestorage.com/${r2Key}`,
      expiresIn,
    };
  }

  /**
   * Generates a presigned download URL for private files
   */
  static async getPresignedDownloadUrl(r2Key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  }

  /**
   * Deletes a file from Cloudflare R2
   */
  static async deleteFile(r2Key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
    });

    await r2Client.send(command);
  }
}
