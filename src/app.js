import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: "https://notify-frontend-hazel.vercel.app/",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// routes 


import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";





app.use("/api/v1/user", userRoutes);
app.use("/api/v1/notes", noteRoutes);





export { app }