"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { createEvent, updateEvent } from '@/app/actions/events'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import type { Event, Venue } from '@/types'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255),
  sport_type: z.string().min(1, 'Sport type is required'),
  event_date: z.string().min(1, 'Event date is required'),
  description: z.string().optional(),
  venue_ids: z.array(z.string()).min(1, 'At least one venue is required'),
})

type FormData = z.infer<typeof formSchema>

interface EventFormProps {
  event?: Event & { venues: Venue[] }
  venues: Venue[]
}

const SPORT_TYPES = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Football',
  'Volleyball',
  'Swimming',
  'Track & Field',
  'Other',
]

export function EventForm({ event, venues }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: event?.name || '',
      sport_type: event?.sport_type || '',
      event_date: event?.event_date ? format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm") : '',
      description: event?.description || '',
      venue_ids: event?.venues.map(v => v.id) || [],
    },
  })

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)

    try {
      // Convert the datetime-local format to ISO string
      const formattedData = {
        ...data,
        event_date: new Date(data.event_date).toISOString(),
      }

      const result = event
        ? await updateEvent(event.id, formattedData)
        : await createEvent(formattedData)

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(event ? 'Event updated successfully' : 'Event created successfully')
      router.push('/events')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const venueOptions = venues.map(venue => ({
    value: venue.id,
    label: `${venue.name} - ${venue.city}, ${venue.country}`,
  }))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Summer Soccer Tournament"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SPORT_TYPES.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date & Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue_ids"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venues</FormLabel>
              <FormControl>
                <MultiSelect
                  options={venueOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select venues"
                />
              </FormControl>
              <FormDescription>
                Select one or more venues for this event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your event..."
                  rows={4}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {event ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              event ? 'Update Event' : 'Create Event'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/events')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}