import { model, Schema } from "mongoose";
import { ISlide } from "../interfaces/slide";


const slideSchema = new Schema<ISlide>(
  {
    content: {type: String, default: ''},
    elements: {type: Array<any>(), default: []},
  },
  {timestamps: true, versionKey: false}
)

export default model<ISlide>('Slide', slideSchema)
