import mongoose from "mongoose";


const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` ✅ Mongo db Connected : ${conn.connection.host}`)

    } catch (error) {
        console.log("❌ Database connection failed:", error.message)
        process.exit(1)

    }



}

export default connectDB;
// Agar MongoDB connect nahi hua aur tum server chalu rakhoge to:

// API chalegi

// Lekin database kaam nahi karega

// Har request fail hogi

// Beech me crash bhi ho sakta hai

// Isliye professional backend me rule hota hai:

// 👉 Database connect nahi hua = server start hi mat karo

// process.exit(1)
// Andar (1) kyu diya?
// Matlab:

// "Program error ke wajah se band hua"

// Exit code hota hai.
// | Code | Meaning |
// | ---- | ------- |
// | 0    | Success |
// | 1    | Error   |

