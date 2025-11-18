import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import { Server } from 'socket.io'
import http from 'http'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"], // Allow frontend and admin ports
    methods: ["GET", "POST"]
  }
})

// Socket.IO signaling for WebRTC
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join appointment room
  socket.on('join-room', (appointmentId) => {
    socket.join(appointmentId)
    console.log(`User ${socket.id} joined room ${appointmentId}`)
  })

  // WebRTC signaling
  socket.on('offer', (data) => {
    socket.to(data.appointmentId).emit('offer', data)
  })

  socket.on('answer', (data) => {
    socket.to(data.appointmentId).emit('answer', data)
  })

  socket.on('ice-candidate', (data) => {
    socket.to(data.appointmentId).emit('ice-candidate', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

server.listen(port, () => console.log(`Server started on PORT:${port}`))

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please kill the process using this port or change the PORT in your .env file.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});
