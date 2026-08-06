import { Request, Response } from "express";
import { boardService } from "@/services/boardService";
import { StatusCodes } from "http-status-codes";

export const createBoard = async (req: Request, res: Response) => {
  const boards = await boardService.createBoard(req.body);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Board successfully created",
    data: boards,
  });
};

export const getBoards = async (req: Request, res: Response) => {
  const boards = await boardService.getAllBoards();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Data retrieved successfully",
    data: boards,
  });
};

export const getBoardById = async (req: Request, res: Response) => {
  const boards = await boardService.getBoardById(req.params.id as string);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Data retrieved successfully",
    data: boards,
  });
};

export const updateBoard = async (req: Request, res: Response) => {
  const boards = await boardService.updateBoard(
    req.params.id as string,
    req.body,
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Data updated successfully",
    data: boards,
  });
};

export const deleteBoard = async (req: Request, res: Response) => {
  await boardService.deleteBoard(req.params.id as string);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Data deleted successfully",
  });
};
