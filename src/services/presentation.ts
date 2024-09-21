import { UserRole } from "../interfaces/presentation"
import Presentation from "../models/presentation"
import { createSlide } from "./slide"


export const createPresentation = async (title: string, creatorId: string) => {
  const initialSlide = await createSlide('', [])
  const role: UserRole = UserRole.CREATOR
  const presentation = new Presentation({
    title,
    slides: [initialSlide._id],
    users: [
      {
        user: creatorId,
        role,
      }
    ],
    creator: creatorId,
  })

  await presentation.save()
  return presentation
}
