import { db } from './firebase'
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc
} from 'firebase/firestore'

export interface HorarioEspecial {
  id: string
  fecha: string
  titulo: string
  horarioApertura: string
  horarioCierre: string
  cerrado: boolean
  activo: boolean
}

export interface HorarioDia {
  apertura: string
  cierre: string
}

export interface ConfiguracionGlobal {
  restaurante: {
    nombre: string
    direccion: string
    telefono: string
    email: string
    whatsapp: string
    logo: string
  }
  horarioNormal: {
    lunes: HorarioDia
    martes: HorarioDia
    miercoles: HorarioDia
    jueves: HorarioDia
    viernes: HorarioDia
    sabado: HorarioDia
    domingo: HorarioDia
  }
  redesSociales: {
    instagram: string
    facebook: string
    tiktok: string
  }
}

const CONFIG_COLLECTION = 'configuracion'
const HORARIOS_ESPECIALES_COLLECTION = 'horarios_especiales'

// Obtener configuración global
export async function getConfiguracionGlobal(): Promise<ConfiguracionGlobal | null> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, 'global')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as ConfiguracionGlobal
    }
    return null
  } catch (error) {
    console.error('Error getting config:', error)
    return null
  }
}

// Guardar configuración global
export async function saveConfiguracionGlobal(config: ConfiguracionGlobal): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, 'global')
    await setDoc(docRef, config, { merge: true })
  } catch (error) {
    console.error('Error saving config:', error)
    throw error
  }
}

// Actualizar campo específico de configuración
export async function updateConfiguracionGlobal(data: Partial<ConfiguracionGlobal>): Promise<void> {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, 'global')
    await updateDoc(docRef, data)
  } catch (error) {
    console.error('Error updating config:', error)
    throw error
  }
}

// Obtener todos los horarios especiales
export async function getHorariosEspeciales(): Promise<HorarioEspecial[]> {
  try {
    const q = query(
      collection(db, HORARIOS_ESPECIALES_COLLECTION),
      orderBy('fecha', 'asc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HorarioEspecial))
  } catch (error) {
    console.error('Error getting horarios especiales:', error)
    return []
  }
}

// Guardar horario especial
export async function saveHorarioEspecial(horario: Omit<HorarioEspecial, 'id'>): Promise<string> {
  try {
    const docRef = doc(collection(db, HORARIOS_ESPECIALES_COLLECTION))
    await setDoc(docRef, horario)
    return docRef.id
  } catch (error) {
    console.error('Error saving horario especial:', error)
    throw error
  }
}

// Actualizar horario especial
export async function updateHorarioEspecial(id: string, data: Partial<HorarioEspecial>): Promise<void> {
  try {
    const docRef = doc(db, HORARIOS_ESPECIALES_COLLECTION, id)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error('Error updating horario especial:', error)
    throw error
  }
}

// Eliminar horario especial
export async function deleteHorarioEspecial(id: string): Promise<void> {
  try {
    const docRef = doc(db, HORARIOS_ESPECIALES_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting horario especial:', error)
    throw error
  }
}