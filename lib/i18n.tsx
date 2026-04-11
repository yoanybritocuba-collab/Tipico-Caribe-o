'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Language = 'es' | 'en'

interface Translations {
  [key: string]: {
    es: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.menu': { es: 'La Carta', en: 'Menu' },
  'nav.reservations': { es: 'Reservas', en: 'Reservations' },
  'nav.suggestions': { es: 'Sugerencias', en: 'Suggestions' },
  'nav.about': { es: 'Sobre Nosotros', en: 'About Us' },
  'nav.location': { es: 'Ubicación', en: 'Location' },
  'nav.admin': { es: 'Admin', en: 'Admin' },
  'nav.added': { es: 'agregado al pedido', en: 'added to cart' },
  
  // Hero
  'hero.title': { es: 'Sabores del Caribe', en: 'Caribbean Flavors' },
  'hero.subtitle': { es: 'Auténtica cocina dominicana en el corazón de Barcelona', en: 'Authentic Dominican cuisine in the heart of Barcelona' },
  'hero.cta.menu': { es: 'Ver Carta', en: 'View Menu' },
  'hero.cta.reserve': { es: 'Reservar Mesa', en: 'Book a Table' },
  
  // Menu
  'menu.title': { es: 'Nuestra Carta', en: 'Our Menu' },
  'menu.subtitle': { es: 'Platos tradicionales dominicanos preparados con amor', en: 'Traditional Dominican dishes prepared with love' },
  'menu.suggestions': { es: 'Sugerencias de la Casa', en: 'Chef\'s Suggestions' },
  'menu.allergens': { es: 'Alérgenos', en: 'Allergens' },
  'menu.categories': { es: 'Categorías', en: 'Categories' },
  'menu.suggestionsCategory': { es: 'Sugerencias del Chef', en: "Chef's Suggestions" },
  'menu.suggestions.description': { es: 'Nuestras recomendaciones especiales para ti', en: 'Our special recommendations for you' },
  'menu.all.description': { es: 'Todos nuestros platos disponibles', en: 'All our available dishes' },
  
  // Reservations
  'reservations.title': { es: 'Reservar Mesa', en: 'Book a Table' },
  'reservations.subtitle': { es: 'Reserva tu experiencia caribeña', en: 'Reserve your Caribbean experience' },
  'reservations.form.name': { es: 'Nombre completo', en: 'Full name' },
  'reservations.form.email': { es: 'Correo electrónico', en: 'Email' },
  'reservations.form.phone': { es: 'Teléfono', en: 'Phone' },
  'reservations.form.date': { es: 'Fecha', en: 'Date' },
  'reservations.form.time': { es: 'Hora', en: 'Time' },
  'reservations.form.guests': { es: 'Número de personas', en: 'Number of guests' },
  'reservations.form.notes': { es: 'Notas especiales', en: 'Special notes' },
  'reservations.form.submit': { es: 'Confirmar Reserva', en: 'Confirm Reservation' },
  'reservations.success': { es: 'Reserva enviada con éxito. Te contactaremos pronto.', en: 'Reservation submitted successfully. We will contact you soon.' },
  
  // About
  'about.title': { es: 'Sobre Nosotros', en: 'About Us' },
  'about.story.title': { es: 'Nuestra Historia', en: 'Our Story' },
  'about.story.p1': { es: 'Típico Caribeño nació del sueño de traer los auténticos sabores de la República Dominicana a Barcelona.', en: 'Típico Caribeño was born from the dream of bringing authentic Dominican flavors to Barcelona.' },
  'about.story.p2': { es: 'Cada plato es preparado con recetas familiares transmitidas por generaciones, usando ingredientes frescos y las especias tradicionales que dan a nuestra cocina su sabor único.', en: 'Each dish is prepared with family recipes passed down through generations, using fresh ingredients and traditional spices that give our cuisine its unique flavor.' },
  'about.cuisine.title': { es: 'Nuestra Cocina', en: 'Our Cuisine' },
  'about.cuisine.p1': { es: 'La cocina dominicana es una fusión de influencias taínas, españolas y africanas que resulta en sabores únicos y reconfortantes.', en: 'Dominican cuisine is a fusion of Taíno, Spanish and African influences that results in unique and comforting flavors.' },
  
  // Location
  'location.title': { es: 'Encuéntranos', en: 'Find Us' },
  'location.address': { es: 'Dirección', en: 'Address' },
  'location.hours': { es: 'Horario', en: 'Opening Hours' },
  'location.contact': { es: 'Contacto', en: 'Contact' },
  'location.directions': { es: 'Cómo llegar', en: 'Get Directions' },
  
  // Days of week
  'day.monday': { es: 'Lunes', en: 'Monday' },
  'day.tuesday': { es: 'Martes', en: 'Tuesday' },
  'day.wednesday': { es: 'Miércoles', en: 'Wednesday' },
  'day.thursday': { es: 'Jueves', en: 'Thursday' },
  'day.friday': { es: 'Viernes', en: 'Friday' },
  'day.saturday': { es: 'Sábado', en: 'Saturday' },
  'day.sunday': { es: 'Domingo', en: 'Sunday' },
  'day.closed': { es: 'Cerrado', en: 'Closed' },
  
  // Footer
  'footer.rights': { es: 'Todos los derechos reservados', en: 'All rights reserved' },
  'footer.followUs': { es: 'Síguenos', en: 'Follow Us' },
  
  // Common
  'common.loading': { es: 'Cargando...', en: 'Loading...' },
  'common.error': { es: 'Ha ocurrido un error', en: 'An error occurred' },
  'common.save': { es: 'Guardar', en: 'Save' },
  'common.cancel': { es: 'Cancelar', en: 'Cancel' },
  'common.edit': { es: 'Editar', en: 'Edit' },
  'common.delete': { es: 'Eliminar', en: 'Delete' },
  'common.add': { es: 'Añadir', en: 'Add' },
  'common.search': { es: 'Buscar', en: 'Search' },
  'common.price': { es: 'Precio', en: 'Price' },
  'common.description': { es: 'Descripción', en: 'Description' },
  'common.status': { es: 'Estado', en: 'Status' },
  'common.added': { es: 'agregado al pedido', en: 'added to cart' },
  'common.quantity': { es: 'Cantidad', en: 'Quantity' },
  'common.total': { es: 'Total', en: 'Total' },
  'common.noProducts': { es: 'Pronto agregaremos nuestros deliciosos platos.', en: 'Soon we will add our delicious dishes.' },
  'common.noCategories': { es: 'No hay categorías con productos disponibles.', en: 'No categories with available products.' },
  'common.grid': { es: 'Vista en cuadrícula', en: 'Grid view' },
  'common.list': { es: 'Vista en lista', en: 'List view' },
  'common.scrollTop': { es: 'Volver arriba', en: 'Scroll to top' },
  'common.since': { es: 'Desde 1985', en: 'Since 1985' },
  
  // Carousel
  'carousel.main.title': { es: 'Platos Fuertes', en: 'Main Dishes' },
  'carousel.main.subtitle': { es: 'Sabores auténticos de la República Dominicana', en: 'Authentic flavors of the Dominican Republic' },
  'carousel.salads.title': { es: 'Ensaladas Frescas', en: 'Fresh Salads' },
  'carousel.salads.subtitle': { es: 'Ingredientes naturales y saludables', en: 'Natural and healthy ingredients' },
  'carousel.drinks.title': { es: 'Bebidas Tropicales', en: 'Tropical Drinks' },
  'carousel.drinks.subtitle': { es: 'Refrescantes cócteles y jugos naturales', en: 'Refreshing cocktails and natural juices' },
  'carousel.desserts.title': { es: 'Postres Caseros', en: 'Homemade Desserts' },
  'carousel.desserts.subtitle': { es: 'Dulce tentación tradicional', en: 'Traditional sweet temptation' },
  'carousel.meat.title': { es: 'Parrillada Caribeña', en: 'Caribbean Grill' },
  'carousel.meat.subtitle': { es: 'Carnes a la brasa con toque dominicano', en: 'Grilled meats with Dominican touch' },
  'carousel.grilled.title': { es: 'Carnes Asadas', en: 'Roasted Meats' },
  'carousel.grilled.subtitle': { es: 'Jugosidad y tradición', en: 'Juicy and traditional' },

  // Features
  'features.delivery.title': { es: 'Envío a Domicilio', en: 'Delivery' },
  'features.delivery.subtitle': { es: 'Pedidos a toda la ciudad', en: 'Orders throughout the city' },
  'features.homemade.title': { es: 'Sabor Casero', en: 'Homemade Flavor' },
  'features.homemade.subtitle': { es: 'Recetas tradicionales', en: 'Traditional recipes' },
  'features.quality.title': { es: 'Calidad Garantizada', en: 'Guaranteed Quality' },
  'features.quality.subtitle': { es: 'Ingredientes frescos', en: 'Fresh ingredients' },
  'features.flexible.title': { es: 'Horario Flexible', en: 'Flexible Schedule' },
  'features.flexible.subtitle': { es: 'Lunes a Domingo', en: 'Monday to Sunday' },

  // Home page
  'home.mostRequested': { es: 'Lo más pedido', en: 'Most requested' },
  'home.specialties': { es: 'Especialidades', en: 'Specialties' },
  'home.ofTheHouse': { es: 'de la Casa', en: 'of the House' },
  'home.favoritesDescription': { es: 'Los favoritos de nuestros comensales, seleccionados por el chef', en: 'Our diners favorites, selected by the chef' },
  'home.discoverMenu': { es: 'Descubrir toda la carta', en: 'Discover the full menu' },
  'home.cta.title': { es: '¿Listo para una experiencia caribeña?', en: 'Ready for a Caribbean experience?' },
  'home.cta.subtitle': { es: 'Reserva tu mesa y disfruta de los auténticos sabores de la República Dominicana', en: 'Book your table and enjoy the authentic flavors of the Dominican Republic' },
  'home.cta.button': { es: 'Reservar ahora', en: 'Book now' },
  
  // Admin
  'admin.dashboard': { es: 'Panel de Control', en: 'Dashboard' },
  'admin.sections': { es: 'Secciones', en: 'Sections' },
  'admin.products': { es: 'Productos', en: 'Products' },
  'admin.combos': { es: 'Combos', en: 'Combos' },
  'admin.events': { es: 'Eventos', en: 'Events' },
  'admin.reservations': { es: 'Reservas', en: 'Reservations' },
  'admin.stats.pending': { es: 'Reservas Pendientes', en: 'Pending Reservations' },
  'admin.stats.products': { es: 'Productos Activos', en: 'Active Products' },
  'admin.stats.sections': { es: 'Secciones', en: 'Sections' },
  'admin.stats.events': { es: 'Eventos Próximos', en: 'Upcoming Events' },
  
  // Reservation status
  'status.pending': { es: 'Pendiente', en: 'Pending' },
  'status.confirmed': { es: 'Confirmada', en: 'Confirmed' },
  'status.cancelled': { es: 'Cancelada', en: 'Cancelled' },
  
  // Allergens
  'allergen.gluten': { es: 'Gluten', en: 'Gluten' },
  'allergen.dairy': { es: 'Lácteos', en: 'Dairy' },
  'allergen.eggs': { es: 'Huevos', en: 'Eggs' },
  'allergen.fish': { es: 'Pescado', en: 'Fish' },
  'allergen.shellfish': { es: 'Mariscos', en: 'Shellfish' },
  'allergen.tree nuts': { es: 'Frutos secos', en: 'Tree nuts' },
  'allergen.peanuts': { es: 'Cacahuetes', en: 'Peanuts' },
  'allergen.soy': { es: 'Soja', en: 'Soy' },

  // Events
  'events.title': { es: 'Próximos Eventos', en: 'Upcoming Events' },
  'events.occupiesVenue': { es: 'Evento privado - Local reservado', en: 'Private event - Venue reserved' },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  getLocalizedField: (item: any, field: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    const stored = localStorage.getItem('tipico-language') as Language
    if (stored && (stored === 'es' || stored === 'en')) {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('tipico-language', lang)
  }

  const t = (key: string): string => {
    const translation = translations[key]
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }
    return translation[language]
  }

  const getLocalizedField = (item: any, field: string): string => {
    if (language === 'en') {
      const enField = `${field}En`
      if (item[enField] && typeof item[enField] === 'string') {
        return item[enField]
      }
    }
    const esField = field
    return item[esField] || ''
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, getLocalizedField }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}