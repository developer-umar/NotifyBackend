import mongoose from "mongoose";



const connectDB = async()=>{

    try{
      const  connectionInstance =   await mongoose.connect(`${process.env.MONODB_URI}/Notify`);
      // console.log(`\n MONGO B CONNECTED SUCCESSFULLY  db host ${connectionInstance.connection.host}`);

    }catch(error){
        console.log("mongo db connection error",error);
        process.exit(1)
    }
}




export default connectDB;