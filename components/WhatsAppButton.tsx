'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('')
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
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}`, '_blank')
    }
  }

  // No mostrar el botón hasta que tengamos el número
  if (!whatsappNumber) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      }`}
      aria-label="WhatsApp"
    >
      <span className="absolute inset-0 rounded-full animate-ping-slow bg-green-400 opacity-75"></span>
      <span className="absolute inset-0 rounded-full animate-ping-slower bg-green-300 opacity-50"></span>
      <span className="absolute inset-0 rounded-full animate-ping-slowest bg-green-200 opacity-25"></span>
      <MessageCircle className="h-7 w-7 relative z-10" />
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          75%, 100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
        @keyframes ping-slowest {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          75%, 100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slower {
          animation: ping-slower 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slowest {
          animation: ping-slowest 2.1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </button>
  )
}