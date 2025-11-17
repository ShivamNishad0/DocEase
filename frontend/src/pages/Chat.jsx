import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Chat = () => {

    const { backendUrl, token, userData } = useContext(AppContext)
    const navigate = useNavigate()
    const { appointmentId } = useParams()

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [appointment, setAppointment] = useState(null)
    const [loading, setLoading] = useState(true)
    const intervalRef = useRef(null)

    const getAppointmentDetails = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            const apt = data.appointments.find(item => item._id === appointmentId)
            if (apt) {
                setAppointment(apt)
            } else {
                toast.error('Appointment not found')
                navigate('/my-appointments')
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getMessages = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/get-messages', { userId: userData._id, appointmentId }, { headers: { token } })
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return

        try {
            const { data } = await axios.post(backendUrl + '/api/user/send-message', {
                userId: userData._id,
                docId: appointment.docId,
                message: newMessage,
                appointmentId
            }, { headers: { token } })

            if (data.success) {
                setNewMessage('')
                getMessages()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token && userData && appointmentId) {
            getAppointmentDetails()
        }
    }, [token, userData, appointmentId])

    useEffect(() => {
        if (appointment) {
            getMessages()

            if (intervalRef.current) clearInterval(intervalRef.current)

            intervalRef.current = setInterval(() => {
                getMessages()
            }, 3000)
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [appointment])

    if (loading) {
        return <div className='flex justify-center items-center min-h-screen'>Loading...</div>
    }

    if (!appointment) {
        return <div className='flex justify-center items-center min-h-screen'>Appointment not found</div>
    }

    return (
        <div className='max-w-4xl mx-auto p-4'>
            {/* Header */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4'>
                <div className='flex items-center gap-4'>
                    <img className='w-16 h-16 rounded-full object-cover' src={appointment.docData.image} alt="" />
                    <div>
                        <h2 className='text-xl font-semibold'>{appointment.docData.name}</h2>
                        <p className='text-gray-600'>{appointment.docData.speciality}</p>
                        <p className='text-sm text-gray-500'>Appointment: {appointment.slotDate} | {appointment.slotTime}</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className='bg-white shadow-md rounded-lg p-4 mb-4 h-96 overflow-y-auto'>
                {messages.length === 0 ? (
                    <p className='text-center text-gray-500'>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-4 ${msg.senderType === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                                msg.senderType === 'user'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}>
                                <p>{msg.message}</p>
                                <p className='text-xs mt-1 opacity-75'>
                                    {new Date(msg.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Message Input */}
            <div className='bg-white shadow-md rounded-lg p-4'>
                <div className='flex gap-2'>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500'
                    />
                    <button
                        onClick={sendMessage}
                        className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors'
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat
