import { IUserRole, UserRole } from "../interfaces/presentation"


export const isUserEditor = (user: IUserRole) => {
  return user.role === UserRole.EDITOR
}
