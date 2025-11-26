import mongoose from "mongoose";

const shareLinkSchema = new mongoose.Schema({
  shareId: String,
  type: String,
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model("ShareLink", shareLinkSchema);
