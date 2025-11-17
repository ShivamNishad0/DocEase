import React, { useContext, useEffect, useState, useRef } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorMessages = () => {

    const { dToken, appointments } = useContext(DoctorContext)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const intervalRef = useRef(null)

    // Get messages for selected appointment
    const getMessages = async (appointmentId) => {
        try {
            const { data } = await axios.post('http://localhost:4000/api/doctor/get-messages', {
                docId: appointments.find(apt => apt._id === appointmentId)?.docId,
                appointmentId
            }, { headers: { dToken } })

            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedAppointment) return

        try {
            const appointment = appointments.find(apt => apt._id === selectedAppointment)
            const { data } = await axios.post('http://localhost:4000/api/doctor/send-message', {
                docId: appointment.docId,
                userId: appointment.userId,
                message: newMessage,
                appointmentId: selectedAppointment
            }, { headers: { dToken } })

            if (data.success) {
                setNewMessage('')
                getMessages(selectedAppointment) // Refresh messages
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const handleAppointmentSelect = (appointmentId) => {
        setSelectedAppointment(appointmentId)
        getMessages(appointmentId)
        // Clear existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
        // Poll for new messages every 3 seconds
        intervalRef.current = setInterval(() => {
            getMessages(appointmentId)
        }, 3000)
    }

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return (
        <div className='w-full'>
            <p className='mb-3 text-lg font-medium'>Messages</p>

            <div className='flex gap-4'>
                {/* Appointments List */}
                <div className='w-1/3 bg-white rounded-lg shadow-md p-4'>
                    <h3 className='text-md font-medium mb-4'>Appointments</h3>
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {appointments.map((appointment, index) => (
                            <div
                                key={index}
                                onClick={() => handleAppointmentSelect(appointment._id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedAppointment === appointment._id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <p className='font-medium'>{appointment.userData.name}</p>
                                <p className='text-sm opacity-75'>{appointment.slotDate} | {appointment.slotTime}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className='w-2/3 bg-white rounded-lg shadow-md p-4'>
                    {selectedAppointment ? (
                        <>
                            <div className='mb-4'>
                                <h3 className='text-md font-medium'>
                                    Chat with {appointments.find(apt => apt._id === selectedAppointment)?.userData.name}
                                </h3>
                            </div>

                            {/* Messages */}
                            <div className='h-80 overflow-y-auto mb-4 p-2 border rounded-lg'>
                                {messages.length === 0 ? (
                                    <p className='text-center text-gray-500'>No messages yet</p>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`mb-3 ${msg.senderType === 'doctor' ? 'text-right' : 'text-left'}`}>
                                            <div className={`inline-block p-2 rounded-lg max-w-xs ${
                                                msg.senderType === 'doctor'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-gray-200 text-gray-800'
                                            }`}>
                                                <p className='text-sm'>{msg.message}</p>
                                                <p className='text-xs mt-1 opacity-75'>
                                                    {new Date(msg.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input */}
                            <div className='flex gap-2'>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message..."
                                    className='flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                                <button
                                    onClick={sendMessage}
                                    className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors'
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='h-full flex items-center justify-center'>
                            <p className='text-gray-500'>Select an appointment to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorMessages;
