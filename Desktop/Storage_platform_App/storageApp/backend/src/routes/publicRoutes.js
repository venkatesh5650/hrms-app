import express from "express";
import { getPublicResource } from "../controllers/publicController.js";
const router = express.Router();
router.get("/:shareId", getPublicResource);
export default router;
