import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  name: String,
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  url: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

export default mongoose.model("File", fileSchema);
