'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon, Clock, Users, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'
import toast from 'react-hot-toast'

const reservationSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  date: z.string().min(1, 'Fecha requerida'),
  time: z.string().min(1, 'Hora requerida'),
  guests: z.number().min(1).max(20),
  notes: z.string().optional(),
})

type ReservationFormData = z.infer<typeof reservationSchema>

export function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t, language } = useI18n()

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      notes: '',
    },
  })

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simular envío a Firebase (puedes conectar con tu backend real después)
      console.log('Reserva enviada:', data)
      
      // Aquí puedes agregar la lógica para guardar en Firebase
      // Por ahora solo mostramos éxito
      
      toast.success('Reserva enviada con éxito')
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al enviar la reserva')
    } finally {
      setIsSubmitting(false)
    }
  }

  const dateLocale = language === 'es' ? es : enUS

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h3 className="mb-2 text-xl font-semibold">{t('reservations.success')}</h3>
          <p className="text-muted-foreground">
            {t('reservations.success') || 'Gracias por tu reserva. Te contactaremos pronto.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('reservations.form.name')}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Juan Pérez"
                  className="pl-9"
                  {...form.register('name')}
                />
              </div>
              {form.formState.errors.name && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>{t('reservations.form.email')}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="juan@ejemplo.com"
                  className="pl-9"
                  {...form.register('email')}
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('reservations.form.phone')}</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="+34 123 456 789"
                  className="pl-9"
                  {...form.register('phone')}
                />
              </div>
              {form.formState.errors.phone && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label>{t('reservations.form.guests')}</Label>
              <div className="relative mt-1">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  max={20}
                  className="pl-9"
                  {...form.register('guests', { valueAsNumber: true })}
                />
              </div>
              {form.formState.errors.guests && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.guests.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('reservations.form.date')}</Label>
              <div className="relative mt-1">
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-9"
                  {...form.register('date')}
                />
              </div>
              {form.formState.errors.date && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div>
              <Label>{t('reservations.form.time')}</Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  className="pl-9"
                  {...form.register('time')}
                />
              </div>
              {form.formState.errors.time && (
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>{t('reservations.form.notes')}</Label>
            <div className="relative mt-1">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                placeholder="Alergias, ocasión especial, etc."
                className="pl-9"
                rows={3}
                {...form.register('notes')}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : t('reservations.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}