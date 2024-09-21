import { Request, Response } from "express"
import { createPresentation, getPresentation, getPresentations } from "../services/presentation"
import { handleControllerError } from "../helpers/handleControllerError"
import { AllowedPresentationOrderByFields } from '../interfaces/presentation'
import { OrderDirection } from "../interfaces/utils"


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

export const getPresentationsController = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    orderBy = AllowedPresentationOrderByFields.createdAt,
    orderDirection = OrderDirection.ASC
  } = req.query;
  try {
    const result = await getPresentations(
      Number(page),
      Number(limit),
      orderBy as AllowedPresentationOrderByFields,
      orderDirection as OrderDirection
    )
    res.status(200).json(result)
  } catch (error) {
    handleControllerError(res, error)
  }
}

export const getPresentationController = async (req: Request, res: Response) => {
  const presentationId = req.params.id
  try {
    const presentation = await getPresentation(presentationId)
    res.status(200).json({
      data: presentation
    })
  } catch (error) {
    handleControllerError(res, error)
  }
}
