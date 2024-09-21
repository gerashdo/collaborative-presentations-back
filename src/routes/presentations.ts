import { Router } from "express"
import { body } from "express-validator"
import { checkValidations, creatorUserExists } from "../middlewares/validations"
import { createPresentationController } from "../controllers/presentation"


const router = Router()

router.post("/",
  body("title").trim().isLength({min: 5}),
  body("creatorId").exists().isMongoId(),
  checkValidations,
  creatorUserExists,
  createPresentationController
)

export default router
