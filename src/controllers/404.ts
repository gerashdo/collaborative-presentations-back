import { Request, Response } from "express"


export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ok: false, errors: {path: {msg: 'Path not found'}}})
}