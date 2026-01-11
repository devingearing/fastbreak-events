import { Database } from './supabase'

// Type aliases for easier use
export type Event = Database['public']['Tables']['events']['Row']
export type Venue = Database['public']['Tables']['venues']['Row']
export type EventVenue = Database['public']['Tables']['event_venues']['Row']

export type EventInsert = Database['public']['Tables']['events']['Insert']
export type VenueInsert = Database['public']['Tables']['venues']['Insert']
export type EventVenueInsert = Database['public']['Tables']['event_venues']['Insert']

export type EventUpdate = Database['public']['Tables']['events']['Update']
export type VenueUpdate = Database['public']['Tables']['venues']['Update']

// Custom types
export type EventWithVenues = Event & {
  venues: Venue[]
}

export type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export type ActionState = {
  error?: string
  success?: boolean
}