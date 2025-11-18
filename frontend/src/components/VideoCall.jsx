import React, { useRef, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const VideoCall = ({ appointmentId, userType }) => {
    const [socket, setSocket] = useState(null)
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [isCallActive, setIsCallActive] = useState(false)
    const [isInitiator, setIsInitiator] = useState(false)
    const [incomingCall, setIncomingCall] = useState(false)
    const [incomingOffer, setIncomingOffer] = useState(null)
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const peerConnectionRef = useRef(null)

    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    }

    useEffect(() => {
        const newSocket = io('http://localhost:4000')
        setSocket(newSocket)

        newSocket.on('connect', () => {
            console.log('Connected to server')
            newSocket.emit('join-room', appointmentId)
        })

        newSocket.on('offer', handleOffer)
        newSocket.on('answer', handleAnswer)
        newSocket.on('ice-candidate', handleIceCandidate)

        return () => {
            newSocket.disconnect()
        }
    }, [appointmentId])

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream
        }
    }, [remoteStream])

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            setLocalStream(stream)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            const peerConnection = new RTCPeerConnection(configuration)
            peerConnectionRef.current = peerConnection

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })

            peerConnection.ontrack = (event) => {
                setRemoteStream(event.streams[0])
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0]
                }
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        appointmentId
                    })
                }
            }

            setIsInitiator(true)
            setIsCallActive(true)

            const offer = await peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)

            socket.emit('offer', {
                offer,
                appointmentId
            })

        } catch (error) {
            console.error('Error starting call:', error)
            let errorMessage = 'Failed to start video call.'

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera and microphone access denied. Please allow permissions and try again.'
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera or microphone found. Please connect a camera and microphone.'
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera or microphone is already in use by another application.'
            } else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Camera or microphone does not meet the required constraints.'
            } else if (error.name === 'SecurityError') {
                errorMessage = 'Camera and microphone access blocked due to security restrictions. Please ensure you are using HTTPS or localhost.'
            }

            alert(errorMessage)
        }
    }

    const handleOffer = async (data) => {
        setIncomingCall(true)
        setIncomingOffer(data)
    }

    const acceptCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            setLocalStream(stream)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            const peerConnection = new RTCPeerConnection(configuration)
            peerConnectionRef.current = peerConnection

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })

            peerConnection.ontrack = (event) => {
                setRemoteStream(event.streams[0])
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0]
                }
            }

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        appointmentId
                    })
                }
            }

            await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer))
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)

            socket.emit('answer', {
                answer,
                appointmentId
            })

            setIsCallActive(true)
            setIncomingCall(false)
            setIncomingOffer(null)

        } catch (error) {
            console.error('Error accepting call:', error)
            let errorMessage = 'Failed to accept video call.'

            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera and microphone access denied. Please allow permissions and try again.'
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera or microphone found. Please connect a camera and microphone.'
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera or microphone is already in use by another application.'
            } else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Camera or microphone does not meet the required constraints.'
            } else if (error.name === 'SecurityError') {
                errorMessage = 'Camera and microphone access blocked due to security restrictions. Please ensure you are using HTTPS or localhost.'
            }

            alert(errorMessage)
        }
    }

    const rejectCall = () => {
        setIncomingCall(false)
        setIncomingOffer(null)
    }

    const handleAnswer = async (data) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer))
        } catch (error) {
            console.error('Error handling answer:', error)
        }
    }

    const handleIceCandidate = async (data) => {
        try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
        } catch (error) {
            console.error('Error handling ICE candidate:', error)
        }
    }

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
        }
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop())
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
        }
        setLocalStream(null)
        setRemoteStream(null)
        setIsCallActive(false)
        setIsInitiator(false)
        setIncomingCall(false)
        setIncomingOffer(null)
    }

    return (
        <div className="video-call-container">
            {incomingCall && (
                <div className="incoming-call-notification bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p>Incoming video call...</p>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={acceptCall}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Accept
                        </button>
                        <button
                            onClick={rejectCall}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
            {!isCallActive && !incomingCall ? (
                <button
                    onClick={startCall}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                    Start Video Call
                </button>
            ) : isCallActive ? (
                <div className="video-call-active">
                    <div className="video-streams flex gap-4 mb-4">
                        <div className="local-video">
                            <h3>Your Video</h3>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-48 h-36 bg-black rounded-lg"
                            />
                        </div>
                        <div className="remote-video">
                            <h3>{userType === 'user' ? "Doctor's Video" : "Patient's Video"}</h3>
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-48 h-36 bg-black rounded-lg"
                            />
                        </div>
                    </div>
                    <button
                        onClick={endCall}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        End Call
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default VideoCall
