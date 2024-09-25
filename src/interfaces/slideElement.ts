import { ISlideElement } from "./slide"

export interface RemoveSlideElementPayload {
  presentationId: string
  slideId: string
  elementId: string
}

export interface UpdateSlideElementPayload {
  presentationId: string
  slideId: string
  elementId: string
  element: ISlideElement
}
