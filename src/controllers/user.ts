import { Request, Response } from "express"
import { createUser } from "../services/user"
import { handleControllerError } from "../helpers/handleControllerError"

export const createUserController = async (req: Request, res: Response) => {
  const { nickname } = req.body
  try {
    const newUser = await createUser(nickname)
    res.status(201).json({
      data: newUser,
    })
  } catch (error) {
    handleControllerError(res, error)
  }
}
