import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const docRef = doc(db, 'configuracion', 'global')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        data: docSnap.data() 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'No se encontró configuración' 
      }, { status: 404 })
    }
  } catch (error) {
    console.error('Error en API configuracion:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener configuración' 
    }, { status: 500 })
  }
}