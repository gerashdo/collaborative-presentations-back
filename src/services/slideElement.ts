import { ISlideElement } from "../interfaces/slide"
import SlideElement from "../models/SlideElement"


export const createNewSlideElement = async (element: ISlideElement) => {
  const newElement = new SlideElement(element)
  await newElement.save()
  return newElement
}

export const removeSlideElement = async (elementId: string) => {
  const element = await SlideElement.findByIdAndDelete(elementId)
  if (!element) {
    throw new Error('Element not found')
  }
  return element
}

export const updateSlideElement = async (elementId: string, element: ISlideElement) => {
  const updatedElement = await SlideElement.findByIdAndUpdate(
    elementId,
    element,
    { new: true }
  )
  if (!updatedElement) {
    throw new Error('Element not found')
  }
  return updatedElement
}
