import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
import User from "../models/user"
import Presentation from "../models/presentation"


export const isUserUnique = async (req: Request, res: Response, next: NextFunction) => {
  const {nickname} = req.body
  const user = await User.findOne({nickname})
  if (user) {
    return res.status(409).json({
      ok: false,
      errors: {nickname: {msg: 'Nickname already in use'}},
    })
  }
  next()
}

export const creatorUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const {creatorId} = req.body
  const user = await User.findById(creatorId)
  if (!user) {
    return res.status(404).json({
      ok: false,
      errors: {creatorId: {msg: 'Creator user not found'}},
    })
  }
  next()
}

export const checkValidations = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if( !errors.isEmpty() ){
      return res.status(400).json({
          ok: false,
          errors: errors.mapped()
      })
  }
  next()
}

export const presentationExists = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params
  const presentation = await Presentation.findById(id)
  if (!presentation) {
    return res.status(404).json({
      ok: false,
      errors: {id: {msg: 'Presentation not found'}}
    })
  }
  next()
}
