import { Document, Types } from "mongoose"
import { ISlide } from "./slide"
import { IUser } from "./user"


export enum UserRole {
  VIEWER = 'viewer',
  EDITOR = 'editor',
  CREATOR = 'creator',
}

export interface IUserRole {
  user: IUser
  role: UserRole
}

export interface IPresentation extends Document {
  title: string
  slides: Types.Array<ISlide['_id']>
  users: Types.Array<IUserRole>
  creator: IUser
  createdAt: Date
}

export enum AllowedPresentationOrderByFields {
  title = 'title',
  creator = 'creator',
  createdAt = 'createdAt'
}

export interface UserJoinPresentationPayload {
  presentationId: string
  userId: string
}

export interface UserLeavePresentationPayload {
  presentationId: string
  userId: string
}
