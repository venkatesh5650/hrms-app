import File from "../models/File.js";
import ShareLink from "../models/ShareLink.js";
import crypto from "crypto";

export const createFile = async (req, res) => {
  const { name, folderId, url } = req.body;

  const file = await File.create({
    name,
    folder: folderId,
    url,
    createdBy: req.user._id,
  });

  res.status(201).json(file);
};

export const renameFile = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const file = await File.findByIdAndUpdate(id, { name }, { new: true });
  if (!file) return res.status(404).json({ message: "File not found" });

  res.json(file);
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;
  await ShareLink.deleteMany({ file: id });
  await File.findByIdAndDelete(id);
  res.json({ message: "File deleted" });
};

// Generate file share link
export const generateFileShareLink = async (req, res) => {
  const { id } = req.params;

  const file = await File.findById(id);
  if (!file) return res.status(404).json({ message: "File not found" });

  const shareId = crypto.randomBytes(10).toString("hex");

  const share = await ShareLink.create({
    shareId,
    type: "file",
    file: file._id,
  });

  res.json({
    shareId: share.shareId,
    url: `/public/${share.shareId}`,
  });
};
