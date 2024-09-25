import Slide from "../models/slide"
import { ISlideElement } from "../interfaces/slide"
import { createNewSlideElement, removeSlideElement } from "./slideElement"


export const createSlide = async (content: string, elements: string[]) => {
  const slide = new Slide({
    content,
    elements,
  })
  await slide.save()
  return slide
}

export const removeSlide = async (slideId: string) => {
  const slide = await Slide.findByIdAndDelete(slideId)
  if (!slide) {
    throw new Error('Slide not found')
  }
  return slide
}

export const addElementToSlide = async (slideId: string, element: ISlideElement) => {
  const newElement = await createNewSlideElement(element)
  const slide = await Slide.findOneAndUpdate(
    { _id: slideId },
    { $push: { elements: newElement._id } },
    { new: true }
  ).populate('elements')
  if (!slide) {
    throw new Error('Slide not found')
  }
  return slide
}

export const removeElementFromSlide = async (slideId: string, elementId: string) => {
  const slide = await Slide.findOneAndUpdate(
    { _id: slideId },
    { $pull: { elements: elementId } },
    { new: true }
  ).populate('elements')
  if (!slide) {
    throw new Error('Slide not found')
  }
  await removeSlideElement(elementId)
  return slide
}
