import Folder from "../models/Folder.js";
import File from "../models/File.js";
import ShareLink from "../models/ShareLink.js";
import crypto from "crypto";

// Get all root folders (for dashboard / "Find all folders")
export const getRootFolders = async (req, res) => {
  const folders = await Folder.find({ parent: null, createdBy: req.user._id })
    .sort({ createdAt: -1 });
  res.json(folders);
};

// Get child folders + files of a folder (nested view)
export const getFolderContents = async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id);
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  const subFolders = await Folder.find({ parent: id });
  const files = await File.find({ folder: id });

  res.json({ folder, subFolders, files });
};

// Create folder (root or inside parent)
export const createFolder = async (req, res) => {
  const { name, parentId } = req.body;

  const folder = await Folder.create({
    name,
    parent: parentId || null,
    createdBy: req.user._id
  });

  res.status(201).json(folder);
};

// Rename folder
export const renameFolder = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const folder = await Folder.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );

  if (!folder) return res.status(404).json({ message: "Folder not found" });
  res.json(folder);
};

// Delete folder (and files inside, simple cascading)
export const deleteFolder = async (req, res) => {
  const { id } = req.params;

  // delete files
  await File.deleteMany({ folder: id });
  // delete share links related
  await ShareLink.deleteMany({ folder: id });
  // delete folder itself (and optionally children if you want recursive)
  await Folder.findByIdAndDelete(id);

  res.json({ message: "Folder deleted" });
};

// Generate share link (folder)
export const generateFolderShareLink = async (req, res) => {
  const { id } = req.params;

  const folder = await Folder.findById(id);
  if (!folder) return res.status(404).json({ message: "Folder not found" });

  const shareId = crypto.randomBytes(10).toString("hex");

  const share = await ShareLink.create({
    shareId,
    type: "folder",
    folder: folder._id
  });

  res.json({
    shareId: share.shareId,
    url: `/public/${share.shareId}`
  });
};

// Revoke share link
export const revokeShareLink = async (req, res) => {
  const { shareId } = req.params;

  const share = await ShareLink.findOneAndUpdate(
    { shareId },
    { isActive: false },
    { new: true }
  );

  if (!share) return res.status(404).json({ message: "Share link not found" });
  res.json({ message: "Share link revoked" });
};
