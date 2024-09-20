import mongoose from "mongoose";


const dbConnection = async() => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL || ''
    );
    console.log('db online')
  } catch (error) {
      console.log(error)
      throw new Error('Can not connect to db')
  }
}

export default dbConnection