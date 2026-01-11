'use server'

import { authActionWrapper, actionWrapper } from '@/lib/actions/wrapper'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { EventWithVenues } from '@/types'
import type { Database } from '@/types/supabase'

const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255),
  sport_type: z.string().min(1, 'Sport type is required').max(50),
  event_date: z.string().datetime({ message: 'Valid date and time required' }),
  description: z.string().optional().nullable(),
  venue_ids: z.array(z.string().uuid()).min(1, 'At least one venue is required'),
})

export async function createEvent(data: z.infer<typeof eventSchema>) {
  return authActionWrapper(async (supabase, user) => {
    // Cast supabase to ensure proper typing
    const db = supabase as any
    // Validate input
    const validatedData = eventSchema.parse(data)
    const { venue_ids, ...eventData } = validatedData

    // Create event
    const insertData: Database['public']['Tables']['events']['Insert'] = {
      name: eventData.name,
      sport_type: eventData.sport_type,
      event_date: eventData.event_date,
      description: eventData.description,
      user_id: user.id,
    }

    const { data: event, error: eventError } = await db
      .from('events')
      .insert(insertData)
      .select()
      .single()

    if (eventError) throw eventError

    // Link venues
    const venueLinks: Database['public']['Tables']['event_venues']['Insert'][] = venue_ids.map(venue_id => ({
      event_id: event!.id,
      venue_id,
    }))

    const { error: linkError } = await db
      .from('event_venues')
      .insert(venueLinks)

    if (linkError) throw linkError

    revalidatePath('/events')
    return event
  })
}

export async function updateEvent(
  id: string,
  data: z.infer<typeof eventSchema>
) {
  return authActionWrapper(async (supabase, user) => {
    const db = supabase as any
    // Validate input
    const validatedData = eventSchema.parse(data)
    const { venue_ids, ...eventData } = validatedData

    // Update event
    const updateData: Database['public']['Tables']['events']['Update'] = {
      name: eventData.name,
      sport_type: eventData.sport_type,
      event_date: eventData.event_date,
      description: eventData.description,
    }

    const { error: updateError } = await db
      .from('events')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    // Delete existing venue links
    const { error: deleteError } = await db
      .from('event_venues')
      .delete()
      .eq('event_id', id)

    if (deleteError) throw deleteError

    // Create new venue links
    const venueLinks: Database['public']['Tables']['event_venues']['Insert'][] = venue_ids.map(venue_id => ({
      event_id: id,
      venue_id,
    }))

    const { error: linkError } = await db
      .from('event_venues')
      .insert(venueLinks)

    if (linkError) throw linkError

    revalidatePath('/events')
    revalidatePath(`/events/${id}`)
    return { id }
  })
}

export async function deleteEvent(id: string) {
  return authActionWrapper(async (supabase, user) => {
    const db = supabase as any
    const { error } = await db
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/events')
    return { id }
  })
}

export async function getEvents(filters?: {
  search?: string
  sport_type?: string
}) {
  return actionWrapper(async (supabase) => {
    const db = supabase as any
    let query = db
      .from('events')
      .select(`
        *,
        event_venues (
          venue:venues (*)
        )
      `)
      .order('event_date', { ascending: true })

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters?.sport_type) {
      query = query.eq('sport_type', filters.sport_type)
    }

    const { data, error } = await query

    if (error) throw error
    if (!data) return []

    // Transform the data to match our EventWithVenues type
    const eventsWithVenues: EventWithVenues[] = (data as any[]).map(event => ({
      id: event.id,
      user_id: event.user_id,
      name: event.name,
      sport_type: event.sport_type,
      event_date: event.event_date,
      description: event.description,
      created_at: event.created_at,
      updated_at: event.updated_at,
      venues: event.event_venues?.map((ev: any) => ev.venue) || []
    }))

    return eventsWithVenues
  }, false) // Don't require auth for viewing events
}

export async function getEvent(id: string) {
  return actionWrapper(async (supabase) => {
    const db = supabase as any
    const { data, error } = await db
      .from('events')
      .select(`
        *,
        event_venues (
          venue:venues (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    // Transform the data
    const event = data as any
    const eventWithVenues: EventWithVenues = {
      id: event.id,
      user_id: event.user_id,
      name: event.name,
      sport_type: event.sport_type,
      event_date: event.event_date,
      description: event.description,
      created_at: event.created_at,
      updated_at: event.updated_at,
      venues: event.event_venues?.map((ev: any) => ev.venue) || []
    }

    return eventWithVenues
  }, false) // Don't require auth for viewing events
}

export async function getUserEvents() {
  return authActionWrapper(async (supabase, user) => {
    const db = supabase as any
    const { data, error } = await db
      .from('events')
      .select(`
        *,
        event_venues (
          venue:venues (*)
        )
      `)
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })

    if (error) throw error
    if (!data) return []

    // Transform the data
    const eventsWithVenues: EventWithVenues[] = (data as any[]).map(event => ({
      id: event.id,
      user_id: event.user_id,
      name: event.name,
      sport_type: event.sport_type,
      event_date: event.event_date,
      description: event.description,
      created_at: event.created_at,
      updated_at: event.updated_at,
      venues: event.event_venues?.map((ev: any) => ev.venue) || []
    }))

    return eventsWithVenues
  })
}