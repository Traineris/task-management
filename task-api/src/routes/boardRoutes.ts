import { Router } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  createBoard,
  getBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "@/controllers/boardController";

const router = Router();

router.post("/", asyncHandler(createBoard));
router.get("/", asyncHandler(getBoards));
router.get("/:id", asyncHandler(getBoardById));
router.put("/:id", asyncHandler(updateBoard));
router.delete("/:id", asyncHandler(deleteBoard));

export default router;
