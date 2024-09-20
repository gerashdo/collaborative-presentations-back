import { Response } from "express"


export const handleControllerError = (res: Response, error: unknown) => {
  console.log(getErrorMessage(error))
  res.status(500).json({
    ok: false,
    errors: {server: {msg: 'Internal server error'}}
  })
}

function getErrorMessage(error: unknown) {
	if (error instanceof Error) return error.message
	return String(error)
}
