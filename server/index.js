import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import adminAuthRoutes from "./routes/admin.js"
import contentRoutes from "./routes/content.js"
import progressRoutes from "./routes/progress.js"

import userManagementRoutes from "./routes/userManagement.js"
import contentManagementRoutes from "./routes/contentManagement.js"
import lessonManagementRoutes from "./routes/lessonManagement.js"

const app = express()
dotenv.config()

const connect = () => {
    mongoose.connect(process.env.MONGO, {
        dbName: 'ensayo_sample'
    }).then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
        throw err
    })
}

app.use(cors())
app.use(cookieParser())
app.use(express.json())

// Client Routes 
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/progress", progressRoutes)

// Admin Routes
app.use("/api/admin", adminAuthRoutes)
app.use("/api/userManagement", userManagementRoutes)
app.use("/api/contentManagement", contentManagementRoutes)
app.use("/api/lessonManagement", lessonManagementRoutes)

// Error Handling
app.use((err, req,res, next) => {
    const status = err.status || 500
    const message = err.message || "Something went wrong!"
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(8800, ()=> {
    connect()
    console.log("Connected to Server")
})