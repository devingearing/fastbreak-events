import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import { ActionResult } from '@/types'
import { User } from '@supabase/supabase-js'

export class ActionError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ActionError'
  }
}

type ActionFunction<T> = (
  supabase: SupabaseClient<Database>,
  user: User | null
) => Promise<T>

/**
 * Wrapper for server actions that provides consistent error handling
 * and Supabase client access
 */
export async function actionWrapper<T>(
  action: ActionFunction<T>,
  requireAuth: boolean = true
): Promise<ActionResult<T>> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (requireAuth && !user) {
      throw new ActionError('You must be logged in to perform this action', 'UNAUTHORIZED')
    }

    const data = await action(supabase, user)

    return { data, error: null }
  } catch (error) {
    console.error('Action error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: (error as any)?.code,
      hint: (error as any)?.hint,
      details: (error as any)?.details
    })

    if (error instanceof ActionError) {
      return {
        data: null,
        error: error.message
      }
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

/**
 * Wrapper specifically for authenticated actions
 */
export async function authActionWrapper<T>(
  action: (supabase: SupabaseClient<Database>, user: User) => Promise<T>
): Promise<ActionResult<T>> {
  return actionWrapper(async (supabase, user) => {
    if (!user) {
      throw new ActionError('Unauthorized', 'UNAUTHORIZED')
    }
    return action(supabase, user)
  }, true)
}