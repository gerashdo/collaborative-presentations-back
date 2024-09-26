import Presentation from "../models/presentation"
import { createSlide, removeSlide } from "./slide"
import { getUserById } from "./user"
import { AllowedPresentationOrderByFields, UserRole } from "../interfaces/presentation"
import { OrderDirection } from "../interfaces/utils"
import { isUserEditor } from "../helpers/presentationChecks"


export const createPresentation = async (title: string, creatorId: string) => {
  const initialSlide = await createSlide('', [])
  const presentation = new Presentation({
    title,
    slides: [initialSlide._id],
    users: [],
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
      options: { sort: { _id: 1 } },
      populate: { path: 'elements' },
    })
    .populate({
      path: 'users',
      populate: { path: 'user' }
    })
    .populate('creator')

  return presentation
}

export const addUserToPresentation = async (presentationId: string, userId: string) => {
  const user = await getUserById(userId)
  if (!user) throw new Error('User not found')

  let presentation = await getPresentation(presentationId)
  if (!presentation)  throw new Error('Presentation not found')

  const userInPresentation = presentation.users.find((u) => u.user.id === userId)

  if (userInPresentation) {
    if (userInPresentation.isConnected) throw new Error('User alredy in presentation')
    userInPresentation.isConnected = true
  } else {
    presentation.users.push({
      user: userId,
      role: user.id === presentation.creator.id ? UserRole.EDITOR : UserRole.VIEWER,
    })
  }

  presentation = await presentation.save()
  return await presentation.populate({
    path: 'users',
    populate: { path: 'user' }
  })
}

export const removeUserFromPresentation = async (presentationId: string, userId: string) => {
  let presentation = await getPresentation(presentationId)
  if (!presentation) throw new Error('Presentation not found')

  const userInPresentation = presentation.users.find((u) => u.user.id === userId)
  if (!userInPresentation) throw new Error('User not found in presentation')

  if (isUserEditor(userInPresentation)) {
    userInPresentation.isConnected = false
  } else {
    presentation.users.pull(userInPresentation)
  }

  presentation = await presentation.save()
  return await presentation.populate({
    path: 'users',
    populate: { path: 'user' }
  })
}

export const updateUserRole = async (presentationId: string, userId: string, role: UserRole) => {
  const updatedPresentation  = await Presentation.findOneAndUpdate(
    {_id: presentationId, 'users.user': userId},
    { $set: { 'users.$.role': role } },
    { new: true }
  ).populate({
    path: 'slides',
    options: { sort: { _id: 1 } }
  })
  .populate({
    path: 'users',
    populate: { path: 'user' }
  })
  .populate('creator')

  if (!updatedPresentation) {
    throw new Error('User not found in presentation')
  }
  return updatedPresentation
}

export const createNewSlideInPresentation = async (presentationId: string) => {
  const slide = await createSlide('', [])
  const presentation = await Presentation.findByIdAndUpdate(
    presentationId,
    { $push: { slides: slide._id } },
    { new: true }
  ).populate({
    path: 'slides',
    options: { sort: { _id: 1 } },
    populate: { path: 'elements' },
  })
  .populate({
    path: 'users',
    populate: { path: 'user' }
  })
  .populate('creator')

  if (!presentation) {
    throw new Error('Presentation not found')
  }

  return presentation
}

export const removeSlideFromPresentation = async (presentationId: string, slideId: string) => {
  const presentation = await Presentation.findByIdAndUpdate(
    presentationId,
    { $pull: { slides: slideId } },
    { new: true }
  ).populate({
    path: 'slides',
    options: { sort: { _id: 1 } },
    populate: { path: 'elements' },
  })
  .populate({
    path: 'users',
    populate: { path: 'user' }
  })
  .populate('creator')

  if (!presentation) {
    throw new Error('Presentation not found')
  }
  await removeSlide(slideId)
  return presentation
}
