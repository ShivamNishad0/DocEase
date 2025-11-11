import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [originalData, setOriginalData] = useState(null)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Validation function
    const validateForm = () => {
        if (!userData.name.trim()) {
            toast.error('Name is required')
            return false
        }
        if (!userData.phone.trim() || !/^\d{10}$/.test(userData.phone) || userData.phone === '000000000') {
            toast.error('Phone number must be 10 digits and not the default value')
            return false
        }
        if (!userData.address.line1.trim() || !userData.address.line2.trim()) {
            toast.error('Both address lines are required')
            return false
        }
        if (!userData.gender || userData.gender === 'Not Selected') {
            toast.error('Please select a gender')
            return false
        }
        if (!userData.dob) {
            toast.error('Date of birth is required')
            return false
        }
        return true
    }

    // Function to handle edit mode start
    const startEdit = () => {
        setOriginalData({ ...userData })
        setIsEdit(true)
    }

    // Function to cancel edit and revert changes
    const cancelEdit = () => {
        setUserData(originalData)
        setImage(false)
        setIsEdit(false)
    }

    // Function to update user profile data using API
    const updateUserProfileData = async () => {
        if (!validateForm()) return

        // Confirmation dialog
        const confirmSave = window.confirm('Are you sure you want to save the changes?')
        if (!confirmSave) return

        setLoading(true)

        try {
            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
                setOriginalData(null)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error('An error occurred while updating profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {isEdit
                ? <label htmlFor='image' aria-label="Upload profile image">
                    <div className='inline-block relative cursor-pointer group'>
                        <img className='w-36 rounded opacity-75 transition-opacity group-hover:opacity-50' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile preview" />
                        <img className='w-10 absolute bottom-12 right-12 opacity-80 group-hover:opacity-100' src={image ? '' : assets.upload_icon} alt="Upload icon" />
                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                            <span className='bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs'>Click to upload</span>
                        </div>
                    </div>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                </label>
                : <img className='w-36 rounded shadow-md' src={userData.image} alt="Profile image" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} placeholder="Enter your name" />
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
            }

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{userData.email}</p>
                    <p className='font-medium'>Phone:</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' type="tel" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} placeholder="Enter 10-digit phone number" />
                        : <p className='text-blue-500'>{userData.phone}</p>
                    }

                    <p className='font-medium'>Address:</p>

                    {isEdit
                        ? <p className='flex flex-col gap-2'>
                            <input className='bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} placeholder="Address Line 1" />
                            <input className='bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} placeholder="Address Line 2" /></p>
                        : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
                    }

                </div>
            </div>
            <div>
                <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gender:</p>

                    {isEdit
                        ? <select className='max-w-20 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        : <p className='text-gray-500'>{userData.gender}</p>
                    }

                    <p className='font-medium'>Birthday:</p>

                    {isEdit
                        ? <input className='max-w-28 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                        : <p className='text-gray-500'>{userData.dob}</p>
                    }

                    <p className='font-medium'>Plan:</p>
                    <p className='text-gray-500 capitalize'>{userData.plan}</p>

                </div>
            </div>
            <div className='mt-10 flex gap-4'>

                {isEdit ? (
                    <>
                        <button onClick={updateUserProfileData} disabled={loading} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed'>
                            {loading ? 'Saving...' : 'Save information'}
                        </button>
                        <button onClick={cancelEdit} className='border border-gray-300 px-8 py-2 rounded-full hover:bg-gray-100 transition-all'>Cancel</button>
                    </>
                ) : (
                    <button onClick={startEdit} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit</button>
                )}

            </div>
        </div>
    ) : null
}

export default MyProfile