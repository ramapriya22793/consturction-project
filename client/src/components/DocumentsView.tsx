import React, { useState } from "react";
import {
  FolderLock,
  UploadCloud,
  FileText,
  FileCode,
  Download,
  CheckCircle2,
  Lock,
  Shield,
  Clock,
  Eye,
} from "lucide-react";
import { useProjectStore, DocumentItem } from "../store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface DocumentsViewProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  isUploadModalOpen,
  setIsUploadModalOpen,
}) => {
  const { documents, activeProjectId, addDocument } = useProjectStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Form state for mock direct presigned upload
  const [docTitle, setDocTitle] = useState("");
  const [category, setCategory] = useState("CAD_DRAWING");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSimulatedPresignedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    setIsUploading(true);
    setUploadProgress(20);

    // Step 1: Request presigned URL from Backend (AWS S3 SDK)
    setTimeout(() => {
      setUploadProgress(65);
      // Step 2: Directly upload binary to Cloudflare R2 bucket
      setTimeout(() => {
        setUploadProgress(100);
        const newDoc: DocumentItem = {
          id: `doc-${Date.now()}`,
          projectId: activeProjectId || "prj-1",
          title: docTitle,
          category,
          fileType: selectedFile?.type || "application/pdf",
          r2Key: `projects/${activeProjectId}/documents/${docTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          r2Url: `https://civil-project-documents.r2.cloudflarestorage.com/projects/${activeProjectId}/documents/${docTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`,
          fileSize: selectedFile ? selectedFile.size : 8420000,
          version: 1,
          createdAt: new Date().toISOString(),
        };

        addDocument(newDoc);
        setIsUploading(false);
        setUploadProgress(null);
        setIsUploadModalOpen(false);
        setDocTitle("");
        setSelectedFile(null);
      }, 700);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Cloudflare R2 Object Storage (S3 Protocol)
          </h2>
          <p className="text-sm text-slate-500">
            Private bucket storage for CAD drawings, structural specifications, and contracts with AWS S3 SDK presigned URLs.
          </p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2">
          <UploadCloud className="h-4 w-4" />
          Upload Document to R2
        </Button>
      </div>

      {/* Security Info Card */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 flex items-start gap-3">
        <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-950">Zero-Egress Fees & Private Storage Protocol</p>
          <p className="text-amber-800 leading-relaxed">
            All engineering assets are stored in private Cloudflare R2 buckets. Download links are time-limited presigned URLs (60-minute expiry) signed using the backend's AWS S3 credentials. No unauthorized direct public bucket access is permitted.
          </p>
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Active Repository Files ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-3">Document Title & File</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Version</th>
                  <th className="px-6 py-3">File Size</th>
                  <th className="px-6 py-3">Storage Key (R2)</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {doc.category === "CAD_DRAWING" ? (
                          <FileCode className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{doc.title}</p>
                        <p className="text-xs text-slate-400 font-mono">{doc.fileType}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-xs">
                        {doc.category.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-medium text-slate-700">
                      v{doc.version}.0
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-mono">
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500 truncate max-w-[200px]">
                      {doc.r2Key}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={doc.r2Url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        Presigned Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload to Cloudflare R2</h3>
                <p className="text-xs text-slate-500">AWS S3 Presigned URL Flow</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulatedPresignedUpload} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Document Title</label>
                <input
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Structural Pier Cap Layout Rev 2"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="CAD_DRAWING">CAD Drawing (DWG/PDF)</option>
                  <option value="CONTRACT">Contract & Agreement</option>
                  <option value="INVOICE">Invoice & Procurement</option>
                  <option value="SPECIFICATION">Structural Specification</option>
                  <option value="INSPECTION_REPORT">Inspection & Quality Report</option>
                  <option value="OTHER">Other Project Document</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Select File</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Direct Presigned S3 Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload Securely"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
