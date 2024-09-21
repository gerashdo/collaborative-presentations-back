import Slide from "../models/slide";


export const createSlide = async (content: string, elements: string[]) => {
  const slide = new Slide({
    content,
    elements,
  })
  await slide.save()
  return slide
}
