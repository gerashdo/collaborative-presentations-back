import User from "../models/user"

export const createUser = async (nickname: string) => {
  const newUser = await User.create({ nickname })
  return newUser
}

export const getUser = async (nickname: string) => {
  const user = await User.findOne({nickname})
  return user
}

export const getUserById = async (id: string) => {
  const user = await User.findById(id)
  return user
}
