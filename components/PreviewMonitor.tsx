'use client'

import { Monitor } from 'lucide-react'

interface PreviewMonitorProps {
  title: string
  children: React.ReactNode
}

export function PreviewMonitor({ title, children }: PreviewMonitorProps) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Monitor className="h-4 w-4 text-green-400" />
        <span className="text-white font-medium">Vista previa en vivo - {title}</span>
      </div>
      <div className="bg-gray-900 rounded-lg p-4">
        {children}
      </div>
    </div>
  )
}