import User from "../models/user"

export const createUser = async (nickname: string) => {
  const newUser = await User.create({ nickname })
  return newUser
}
