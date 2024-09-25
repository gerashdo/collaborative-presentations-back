import { Document, Types } from "mongoose"


export interface ISlide extends Document {
  content: string,
  elements: Types.Array<ISlideElement>,
}

enum SlideElementTypes {
  TEXT = 'text',
  RECT = 'rect',
  CIRCLE = 'circle',
  ARROW = 'arrow',
}

export interface ISlideElement extends Document{
  type: SlideElementTypes,
  content?: string,
  originalText?: string,
  x: number,
  y: number,
  draggable: boolean,
  color?: string,
}

export interface AddElementToSlidePayload {
  presentationId: string,
  slideId: string,
  element: ISlideElement,
}
