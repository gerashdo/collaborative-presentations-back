import { Router } from "express"
import { body, param, query } from "express-validator"
import { checkValidations, creatorUserExists, presentationExists } from "../middlewares/validations"
import { createPresentationController, getPresentationController, getPresentationsController } from "../controllers/presentation"
import { isAllowedOrderBy, isAllowedOrderDirection, isGraterThanZero } from "../helpers/presentationValidator"


const router = Router()

router.post("/",
  body("title").trim().isLength({min: 5}),
  body("creatorId").exists().isMongoId(),
  checkValidations,
  creatorUserExists,
  createPresentationController
)

router.get("/",
  query("page").isNumeric().custom(isGraterThanZero).optional(),
  query("limit").isNumeric().custom(isGraterThanZero).optional(),
  query("orderBy").isString().custom(isAllowedOrderBy).optional(),
  query("orderDirection").isString().custom(isAllowedOrderDirection).optional(),
  checkValidations,
  getPresentationsController
)

router.get("/:id",
  param("id").isMongoId(),
  checkValidations,
  presentationExists,
  getPresentationController
)

export default router
