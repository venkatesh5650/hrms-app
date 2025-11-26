import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("Folder", folderSchema);
