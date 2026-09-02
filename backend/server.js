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
import { Groq } from 'groq-sdk'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Groq client setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "https://admindocease.netlify.app/"], // Allow frontend and admin ports
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

app.post("/api/chatbot", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
        You are a medical AI chatbot for DocEase.
        User says symptoms. You must:

        1. Detect disease + severity.
        2. Classify as SAFE / HARMFUL / VERY HARMFUL.
        3. If harmful → Recommend doctor consult.
        4. Suggest doctor specialty (like Cardiologist, ENT, etc.)
        5. Output friendly message (chat style).
        
        User message: ${message}
    `;

    const response = await groq.chat.completions.create({
      model: "llama3-70b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const aiMessage = response.choices[0].message.content;

    res.json({ reply: aiMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

