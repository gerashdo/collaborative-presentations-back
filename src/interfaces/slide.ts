import { Document } from "mongoose"


export interface ISlide extends Document {
  content: string,
  elements: any[],
}
