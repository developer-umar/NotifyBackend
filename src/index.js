
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config();


const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`express appp is running on port ${PORT}`)
        })

    })
    .catch((error) => {
        console.log("mongo db connection failed !!!!!!", error)
    })

