import BoardModel from "@/models/boardModel";
import {
  createBoardSchema,
  updateBoardSchema,
} from "@/validations/boardValidation";
import { CustomError } from "@/utils/customError";

export class BoardService {
  async createBoard(data: any) {
    const parsedData = createBoardSchema.safeParse(data);
    if (!parsedData.success) {
      throw new CustomError(
        parsedData.error.issues[0]?.message || "Validation Error",
        400,
      );
    }

    // Pengecekan Unik Manual (Langsung di Service)
    const existing = await BoardModel.findOne({ code: parsedData.data.code });
    if (existing) {
      throw new CustomError("Board code already exists", 409);
    }

    return await BoardModel.create(parsedData.data);
  }

  async getAllBoards() {
    return await BoardModel.find()
      .select("-__v -updatedAt")
      .sort({ createdAt: -1 });
  }

  async getBoardById(id: string) {
    const board = await BoardModel.findById(id);
    if (!board) {
      throw new CustomError("Board not found", 404);
    }
    return board;
  }

  async updateBoard(id: string, data: any) {
    await this.getBoardById(id);

    const parsedData = updateBoardSchema.safeParse(data);
    if (!parsedData.success) {
      throw new CustomError(
        parsedData.error.issues[0]?.message || "Validation Error",
        400,
      );
    }

    return await BoardModel.findByIdAndUpdate(id, parsedData.data, {
      new: true,
    });
  }

  async deleteBoard(id: string) {
    await this.getBoardById(id);
    return await BoardModel.findByIdAndDelete(id);
  }
}

export const boardService = new BoardService();
