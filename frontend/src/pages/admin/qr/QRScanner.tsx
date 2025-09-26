import api from '@/lib/api'
import React, { useState, useEffect } from 'react'
import QrReader from 'react-qr-scanner'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Wrapper without facingMode
const QRScanner = ({ delay = 300, onScan, onError, style = {} }) => {
  return <QrReader delay={delay} onScan={onScan} onError={onError} style={style} />
}

const QRScannerPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useAuth()
  const [status, setStatus] = useState('')
  const [userScannedInfo, setUserScannedInfo] = useState(null)
  const [scanning, setScanning] = useState(true)
  const [event, setEvent] = useState(null)
  const [showAddScanners, setShowAddScanners] = useState(false)
  const [scannerEmail, setScannerEmail] = useState('')

  // Fetch event details
  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${slug}`)
      setEvent(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [slug])


const canScan = () => {
    if (!event || !userInfo) return false
    const userId = userInfo.user._id
  
    const isCreator = event.createdBy._id === userId
  
    // Handle scanners as ObjectIds
    const isScanner = event.scanners.some(
      (s) => s.toString() === userId.toString()
    )
  
    return isCreator || isScanner
  }

  useEffect(() => {
    if (event && !canScan()) {
      navigate(`/events/${event.slug}`) // redirect unauthorized users
    }
  }, [event, userInfo])

  const handleScan = async (data) => {
    if (!scanning || !data?.text) return
    setScanning(false)
    setStatus('⏳ Verifying...')

    try {
      const res = await api.post(`/qr/verify/${data.text}`)
      setUserScannedInfo(res.data.user || null)
      setStatus(res.data.message || '⚠️ Unknown response')
    } catch (err) {
      console.error(err)
      if (err.response?.data?.message) {
        setUserScannedInfo(null)
        setStatus(`❌ ${err.response.data.message}`)
      } else {
        setUserScannedInfo(null)
        setStatus('⚠️ Server error, try again')
      }
    }
  }

  const handleError = (err) => {
    console.error('QR Scan Error:', err)
    setStatus('⚠️ Unable to access camera')
  }

  // Reset to scan next QR
  const handleDone = () => {
    setStatus('')
    setUserScannedInfo(null)
    setScanning(true)
  }

  // Add scanner by email
  const addScanner = async () => {
    if (!scannerEmail) return
    try {
      await api.post(`/qr/add-scanner/${event.slug}`, { email: scannerEmail })
      setScannerEmail('')
      setShowAddScanners(false)
      fetchEvent() // refresh event data
      alert('Scanner added successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to add scanner. Make sure the email is registered.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-white p-6 pt-[10rem]">
      
      {/* Event Info & Scanner Access */}
      {event?.createdBy._id === userInfo?.user._id && (
        <div className="w-full max-w-md bg-gray-900 p-4 rounded-xl shadow-lg mb-8 text-center">
          <p className="mb-3">You can allow more people to scan using their email.</p>
          <button
            className="bg-space-accent px-4 py-2 rounded hover:bg-space-accent/80 mb-2"
            onClick={() => setShowAddScanners(true)}
          >
            Add More Scanners
          </button>

          {showAddScanners && (
            <div className="mt-4 bg-gray-800 p-4 rounded shadow space-y-2">
              <input
                type="email"
                placeholder="Scanner's Email"
                className="p-2 rounded w-full text-black"
                value={scannerEmail}
                onChange={(e) => setScannerEmail(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={addScanner}
                  className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddScanners(false)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Event QR Scanner</h1>
      <p className='mb-5'>LoggedIn as: {userInfo.user.email}</p>

      {/* QR Scanner */}
      <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-700 mb-6 w-full max-w-xs mx-auto">
        <QRScanner
          onScan={handleScan}
          onError={handleError}
          style={{ width: '100%', height: 300 }}
        />
      </div>

      {/* Scan Status */}
      <div className="w-full max-w-md text-center">
        {status && <p className="text-lg font-medium mb-4">{status}</p>}
        {userScannedInfo && (
          <div className="mt-3 bg-gray-800 px-4 py-3 rounded-xl shadow">
            <p className="font-semibold">{userScannedInfo.name}</p>
            <p className="text-gray-400 text-sm">{userScannedInfo.email}</p>
          </div>
        )}

        {(userScannedInfo || status) && (
          <button
            onClick={handleDone}
            className="mt-4 bg-space-accent px-6 py-2 rounded hover:bg-space-accent/80"
          >
            Done
          </button>
        )}
      </div>
    </div>
  )
}

export default QRScannerPage