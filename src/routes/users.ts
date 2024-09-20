import { Router } from "express"

const router = Router()

router.post("/", (req, res) => {
  res.json({ message: "User created" })
})

export default router