import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"




const app =  express()

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
})
)
// middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

// cors configuartion 



import  userRoute from "./routes/authRoutes.js"
import  notesRoute  from  "./routes/notesRoute.js"


app.use("/api/v1/user",userRoute);
app.use("/api/v1/notes",notesRoute);




export default app;