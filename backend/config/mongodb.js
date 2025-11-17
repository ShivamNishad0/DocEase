import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log(`MongoDB Database Connected Successfully and running on port ${process.env.PORT}`))
    await mongoose.connect(`${process.env.MONGODB_URI}/docease`)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.