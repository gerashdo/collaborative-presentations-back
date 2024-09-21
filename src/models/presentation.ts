import { model, Schema } from "mongoose";
import { IPresentation, UserRole } from "../interfaces/presentation";


const presentationSchema = new Schema<IPresentation>(
  {
    title: {type: String, required: true},
    slides: [{type: Schema.Types.ObjectId, ref: 'Slide'}],
    users: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      role: { type: String, enum: Object.values(UserRole), required: true },
    }],
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  },
  {timestamps: true, versionKey: false}
)

export default model<IPresentation>('Presentation', presentationSchema)
