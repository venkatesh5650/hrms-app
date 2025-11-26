import ShareLink from "../models/ShareLink.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";

export const getPublicResource = async (req, res) => {
  const { shareId } = req.params;
  const link = await ShareLink.findOne({ shareId, isActive: true });
  if (!link) return res.status(404).json({ message: "Invalid link" });

  if (link.type === "file") {
    const file = await File.findById(link.file);
    return res.json(file);
  }
  if (link.type === "folder") {
    const folder = await Folder.findById(link.folder);
    return res.json(folder);
  }
};
