import { Router } from "express"
import { body } from "express-validator"
import { checkValidations } from "../middlewares/validations"
import { createUserController } from "../controllers/user"

const router = Router()

router.post("/",
  body("nickname").trim().isLength({min: 4}),
  checkValidations,
  createUserController
)

export default router