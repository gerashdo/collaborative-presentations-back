import { model, Schema } from "mongoose";
import { ISlide } from "../interfaces/slide";


const slideSchema = new Schema<ISlide>(
  {
    content: {type: String, default: ''},
    elements: [{type: Schema.Types.ObjectId, ref: 'SlideElement'}],
  },
  {timestamps: true, versionKey: false}
)

export default model<ISlide>('Slide', slideSchema)
