import { model, Schema } from "mongoose";
import { ISlideElement } from "../interfaces/slide";


const SlideElementSchema = new Schema<ISlideElement>({
  type: { type: String, required: true },
  content: { type: String },
  originalText: { type: String },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  draggable: { type: Boolean, required: true, default: true },
  color: { type: String },
}, { versionKey: false, timestamps: true })

export default model<ISlideElement>('SlideElement', SlideElementSchema)
