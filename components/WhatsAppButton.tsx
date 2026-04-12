'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('34634492023')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loadWhatsapp = async () => {
      try {
        const docRef = doc(db, 'configuracion', 'vUJ7J8q0KfoLrph2QAgt')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.whatsapp) {
            const cleanNumber = data.whatsapp.replace(/[^0-9]/g, '')
            setWhatsappNumber(cleanNumber)
          }
        }
      } catch (error) {
        console.error('Error cargando WhatsApp:', error)
      }
    }
    loadWhatsapp()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </button>
  )
}