// lib/navigation-history.ts
// Lógica para manejar el botón de atrás del móvil y 3 clics para salir

type Listener = () => void

let historyStack: string[] = []
let pressCount = 0
let lastPressTime = 0
let listeners: Listener[] = []

// Guardar la ruta actual en el historial
export function pushToHistory(path: string) {
  // Evitar duplicados consecutivos
  if (historyStack[historyStack.length - 1] !== path) {
    historyStack.push(path)
  }
  // Limitar tamaño del historial
  if (historyStack.length > 50) {
    historyStack = historyStack.slice(-30)
  }
  notifyListeners()
}

// Obtener la ruta anterior
export function getPreviousPath(): string | null {
  if (historyStack.length >= 2) {
    return historyStack[historyStack.length - 2]
  }
  return null
}

// Volver atrás en el historial
export function goBack(): boolean {
  if (historyStack.length >= 2) {
    historyStack.pop()
    const previousPath = historyStack[historyStack.length - 1]
    notifyListeners()
    return true
  }
  return false
}

// Resetear el historial (usar cuando se llega a home)
export function resetHistoryToHome() {
  const currentPath = historyStack[historyStack.length - 1]
  historyStack = [currentPath || '/']
  pressCount = 0
  lastPressTime = 0
  notifyListeners()
}

// Manejar el clic de atrás en home (3 clics para salir)
export function handleBackOnHome(): { shouldExit: boolean; remainingClicks: number } {
  const now = Date.now()
  const TIME_WINDOW = 2000 // 2 segundos para contar los 3 clics
  
  if (now - lastPressTime > TIME_WINDOW) {
    // Reiniciar contador si pasó mucho tiempo
    pressCount = 1
    lastPressTime = now
    return { shouldExit: false, remainingClicks: 2 }
  } else {
    pressCount++
    lastPressTime = now
    
    if (pressCount >= 3) {
      // Reiniciar contador para la próxima vez
      pressCount = 0
      lastPressTime = 0
      return { shouldExit: true, remainingClicks: 0 }
    }
    
    return { shouldExit: false, remainingClicks: 3 - pressCount }
  }
}

// Resetear contador de clics (útil cuando se navega desde home)
export function resetPressCounter() {
  pressCount = 0
  lastPressTime = 0
  notifyListeners()
}

// Obtener estado actual del contador
export function getPressState() {
  return { pressCount, lastPressTime }
}

// Sistema de suscripción para actualizar UI (opcional)
export function subscribe(listener: Listener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

function notifyListeners() {
  listeners.forEach(listener => listener())
}

// Inicializar el historial con la ruta actual
export function initHistory(currentPath: string) {
  if (historyStack.length === 0) {
    historyStack = [currentPath]
  }
}