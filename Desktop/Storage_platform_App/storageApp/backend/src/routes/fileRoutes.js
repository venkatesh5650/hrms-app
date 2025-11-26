import express from "express";
import {
  createFile,
  renameFile,
  deleteFile,
  generateFileShareLink
} from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createFile);
router.patch("/:id", renameFile);
router.delete("/:id", deleteFile);
router.post("/:id/share", generateFileShareLink);

export default router;
