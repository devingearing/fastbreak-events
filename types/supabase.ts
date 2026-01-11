export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          user_id: string
          name: string
          sport_type: string
          event_date: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sport_type: string
          event_date: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sport_type?: string
          event_date?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string | null
          country: string
          postal_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state?: string | null
          country: string
          postal_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string | null
          country?: string
          postal_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_venues: {
        Row: {
          event_id: string
          venue_id: string
        }
        Insert: {
          event_id: string
          venue_id: string
        }
        Update: {
          event_id?: string
          venue_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}