'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MenuNavProps {
  sections: Array<{ id: string; name: string }>
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function MenuNav({ sections, activeSection, onSectionChange }: MenuNavProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftArrow(scrollLeft > 10)
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollPosition()
      container.addEventListener('scroll', checkScrollPosition)
      window.addEventListener('resize', checkScrollPosition)
      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
        window.removeEventListener('resize', checkScrollPosition)
      }
    }
  }, [sections])

  const scrollHorizontal = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }

  return (
    <div className={cn(
      'z-40 transition-all duration-300',
      isSticky ? 'sticky top-16 bg-background/95 backdrop-blur border-b py-3' : 'py-4'
    )}>
      <div className="container mx-auto px-4">
        <div className="relative flex items-center gap-2">
          {showLeftArrow && (
            <button
              onClick={() => scrollHorizontal('left')}
              className="absolute left-0 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition-colors"
              style={{ transform: 'translateX(-50%)' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scroll-smooth py-2"
            style={{ 
              scrollbarWidth: 'thin',
              msOverflowStyle: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'whitespace-nowrap rounded-full px-4 flex-shrink-0',
                  activeSection === section.id && 'bg-primary text-primary-foreground'
                )}
                onClick={() => onSectionChange(section.id)}
              >
                {section.name}
              </Button>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => scrollHorizontal('right')}
              className="absolute right-0 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition-colors"
              style={{ transform: 'translateX(50%)' }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}