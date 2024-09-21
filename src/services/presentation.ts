import Presentation from "../models/presentation"
import { createSlide } from "./slide"
import { AllowedPresentationOrderByFields, UserRole } from "../interfaces/presentation"
import { OrderDirection } from "../interfaces/utils"


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

export const getPresentations = async (
  page: number,
  limit: number,
  orderBy: AllowedPresentationOrderByFields,
  orderDirection: OrderDirection
) => {
  const skip = (page - 1) * limit

  const presentations = await Presentation.find()
    .sort({ [orderBy]: orderDirection })
    .skip(skip)
    .limit(limit)
    .populate('creator')

  const totalPresentations = await Presentation.countDocuments()
  const totalPages = Math.ceil(totalPresentations / limit)

  return {
    data: presentations,
    meta: {
      currentPage: page,
      totalPages,
      totalPresentations,
      pageSize: limit
    }
  }
}

export const getPresentation = async (id: string) => {
  const presentation = await Presentation.findById(id)
    .populate({
      path: 'slides',
      options: { sort: { _id: 1 } }
    })
    .populate({
      path: 'users',
      populate: { path: 'user' }
    })
    .populate('creator')

  return presentation
}
