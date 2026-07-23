import mongoose from "mongoose"
import { ENV } from "./env.js";
export const connectDB = async() => {
    try{
        const conn = await mongoose.connect(ENV.MONGO_URI)
        console.log("mongodb connected: ", conn.connection.host)
    } catch(error){
        console.log("Error connection to Mongodb",error)
        process.exit(1); // 1 status code means fail , 0 means success
    }
}