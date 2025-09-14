import React, { useState } from 'react'
import { toast } from 'react-toastify'

const MedicineSuggestion = () => {
  const [symptoms, setSymptoms] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms')
      return
    }

    setLoading(true)
    // Mock AI response for medicine suggestion
    setTimeout(() => {
      const mockSuggestions = {
        'headache': 'Take ibuprofen 400mg every 6 hours. Rest in a quiet room.',
        'fever': 'Take acetaminophen 500mg every 4-6 hours. Stay hydrated.',
        'cough': 'Use cough syrup with dextromethorphan. Drink warm fluids.',
        'default': 'Please consult a doctor for proper diagnosis and treatment.'
      }
      const key = symptoms.toLowerCase().includes('headache') ? 'headache' :
                 symptoms.toLowerCase().includes('fever') ? 'fever' :
                 symptoms.toLowerCase().includes('cough') ? 'cough' : 'default'
      setSuggestion(mockSuggestions[key])
      setLoading(false)
    }, 2000)
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-md w-full'>
        <h2 className='text-2xl font-semibold mb-4 text-center'>Medicine Suggestion Chatbot</h2>
        <p className='text-gray-600 mb-6 text-center'>Enter your symptoms to get medicine suggestions</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder='Describe your symptoms...'
            className='w-full p-3 border border-gray-300 rounded-md resize-none'
            rows={4}
            required
          />
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary text-white py-2 rounded-md disabled:opacity-50'
          >
            {loading ? 'Getting suggestion...' : 'Get Suggestion'}
          </button>
        </form>

        {suggestion && (
          <div className='mt-6 p-4 bg-blue-50 rounded-md'>
            <h3 className='font-semibold mb-2'>Suggestion:</h3>
            <p className='text-gray-700'>{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MedicineSuggestion
