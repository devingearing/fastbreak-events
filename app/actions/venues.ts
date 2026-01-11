'use server'

import { authActionWrapper, actionWrapper } from '@/lib/actions/wrapper'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Venue } from '@/types'
import type { Database } from '@/types/supabase'

const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(255),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(50).optional().nullable(),
  country: z.string().min(1, 'Country is required').max(100),
  postal_code: z.string().max(20).optional().nullable(),
})

export async function createVenue(data: z.infer<typeof venueSchema>) {
  return authActionWrapper(async (supabase, user) => {
    const db = supabase as any
    const validatedData = venueSchema.parse(data)

    const insertData: Database['public']['Tables']['venues']['Insert'] = validatedData

    const { data: venue, error } = await db
      .from('venues')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/venues')
    return venue
  })
}

export async function getVenues() {
  return actionWrapper(async (supabase) => {
    const db = supabase as any
    const { data, error } = await db
      .from('venues')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return data as Venue[]
  }, false) // Don't require auth for viewing venues
}

export async function getVenue(id: string) {
  return actionWrapper(async (supabase) => {
    const db = supabase as any
    const { data, error } = await db
      .from('venues')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data as Venue
  }, false)
}

export async function searchVenues(query: string) {
  return actionWrapper(async (supabase) => {
    const db = supabase as any
    const { data, error } = await db
      .from('venues')
      .select('*')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%`)
      .order('name', { ascending: true })
      .limit(10)

    if (error) throw error

    return data as Venue[]
  }, false)
}