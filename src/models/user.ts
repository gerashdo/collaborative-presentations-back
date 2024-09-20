import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user";

const userSchema = new Schema<IUser>(
  {
    nickname: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model<IUser>("User", userSchema)
