import { Document, Types } from "mongoose"
import { ISlide } from "./slide"
import { IUser } from "./user"


export enum UserRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  CREATOR = 'creator',
}

export interface IUserRole {
  user: IUser['_id']
  role: UserRole
}

export interface IPresentation extends Document {
  title: string
  slides: Types.Array<ISlide['_id']>
  users: Types.Array<IUserRole>
  creator: IUser['_id']
  createdAt: Date
}

export enum AllowedPresentationOrderByFields {
  title = 'title',
  creator = 'creator',
  createdAt = 'createdAt'
}
