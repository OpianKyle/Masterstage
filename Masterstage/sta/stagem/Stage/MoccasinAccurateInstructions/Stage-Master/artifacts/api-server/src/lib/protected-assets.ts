import path from "node:path";
import { fileURLToPath } from "node:url";

export type ProtectedAsset = {
  relativePath: string;
  contentType: string;
  downloadName: string;
  disposition: "inline" | "attachment";
  requiredTier: "personal" | "reseller";
};

const assetRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "protected-content",
);

export const protectedAssets: Record<string, ProtectedAsset> = {
  "video-01": {
    relativePath: "videos/Lesson-1.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-1.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-02": {
    relativePath: "videos/Lesson-2.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-2.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-03": {
    relativePath: "videos/Lesson-3.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-3.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-04": {
    relativePath: "videos/Lesson-4.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-4.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-05": {
    relativePath: "videos/Lesson-5.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-5.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-06": {
    relativePath: "videos/Lesson-6.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-6.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "video-07": {
    relativePath: "videos/Lesson-7.mp4",
    contentType: "video/mp4",
    downloadName: "StageMaster-Lesson-7.mp4",
    disposition: "inline",
    requiredTier: "personal",
  },
  "course-pdf": {
    relativePath: "pdfs/StageMaster-Course.pdf",
    contentType: "application/pdf",
    downloadName: "StageMaster-Course.pdf",
    disposition: "attachment",
    requiredTier: "personal",
  },
  "workbook-pdf": {
    relativePath: "pdfs/StageMaster-Workbook.pdf",
    contentType: "application/pdf",
    downloadName: "StageMaster-Workbook.pdf",
    disposition: "attachment",
    requiredTier: "personal",
  },
  "cheatsheets-pdf": {
    relativePath: "pdfs/StageMaster-CheatSheets.pdf",
    contentType: "application/pdf",
    downloadName: "StageMaster-CheatSheets.pdf",
    disposition: "attachment",
    requiredTier: "personal",
  },
  "deck-pptx": {
    relativePath: "deck/StageMaster-Deck.pptx",
    contentType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    downloadName: "StageMaster-Deck.pptx",
    disposition: "attachment",
    requiredTier: "personal",
  },
  "video-scripts": {
    relativePath: "swipe-files/video-scripts.md",
    contentType: "text/markdown; charset=utf-8",
    downloadName: "StageMaster-Video-Scripts.md",
    disposition: "attachment",
    requiredTier: "personal",
  },
  "sales-page-copy": {
    relativePath: "swipe-files/sales-page-copy.md",
    contentType: "text/markdown; charset=utf-8",
    downloadName: "StageMaster-Sales-Page-Copy.md",
    disposition: "attachment",
    requiredTier: "reseller",
  },
  emails: {
    relativePath: "swipe-files/emails.md",
    contentType: "text/markdown; charset=utf-8",
    downloadName: "StageMaster-Emails.md",
    disposition: "attachment",
    requiredTier: "reseller",
  },
  "whop-listing": {
    relativePath: "swipe-files/whop-listing.md",
    contentType: "text/markdown; charset=utf-8",
    downloadName: "StageMaster-Whop-Listing.md",
    disposition: "attachment",
    requiredTier: "reseller",
  },
};

export function getProtectedAssetPath(assetId: string): {
  asset: ProtectedAsset;
  filePath: string;
} | null {
  const asset = protectedAssets[assetId];
  if (!asset) return null;
  return { asset, filePath: path.join(assetRoot, asset.relativePath) };
}