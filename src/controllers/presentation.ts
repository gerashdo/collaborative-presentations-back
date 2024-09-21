import { Request, Response } from "express";
import { createPresentation } from "../services/presentation";
import { handleControllerError } from "../helpers/handleControllerError";


export const createPresentationController = async (req: Request, res: Response) => {
  const { title, creatorId } = req.body;

  try {
    const newPresentation = await createPresentation(title, creatorId);

    res.status(201).json({
      data: newPresentation,
    });
  } catch (error) {
    handleControllerError(res, error)
  }
}
