import express from "express";
import {
  getRootFolders,
  getFolderContents,
  createFolder,
  renameFolder,
  deleteFolder,
  generateFolderShareLink,
  revokeShareLink,
} from "../controllers/folderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/root", getRootFolders);
router.get("/:id", getFolderContents);
router.post("/", createFolder);
router.patch("/:id", renameFolder);
router.delete("/:id", deleteFolder);
router.post("/:id/share", generateFolderShareLink);
router.patch("/share/:shareId/revoke", revokeShareLink);

export default router;
