import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    appointmentId: { type: String, required: true },
    senderType: { type: String, enum: ['user', 'doctor'], required: true }
});

const messageModel = mongoose.models.message || mongoose.model("message", messageSchema);
export default messageModel;
