'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signUp(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const validatedFields = signUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error, data } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) {
    // Check if user already exists but is unverified
    if (error.code === 'user_already_registered' || error.message.includes('already been registered')) {
      return {
        error: {
          message: 'An account with this email already exists. Please check your email for the verification link or use the button below to resend it.',
          code: 'unverified_email',
          email: validatedFields.data.email,
        },
      }
    }

    return {
      error: {
        message: error.message,
      },
    }
  }

  // Check if email confirmation is required
  if (data?.user && !data.session) {
    console.log('User created but needs email verification:', data.user.email)
    return {
      success: true,
      message: 'Please check your email to verify your account before signing in.',
      email: data.user.email,
    }
  }

  // If user is created AND session exists (no email confirmation required), redirect
  if (data?.user && data.session) {
    redirect('/events')
  }

  // This shouldn't happen, but handle it just in case
  return {
    error: {
      message: 'An unexpected error occurred during signup.',
    },
  }
}

export async function signIn(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

  if (error) {
    // Check if the error is due to unverified email
    if (error.message.includes('Email not confirmed') || error.message.includes('email is not confirmed')) {
      return {
        error: {
          message: 'Please verify your email before signing in. Check your inbox for the verification link.',
          code: 'unverified_email',
          email: validatedFields.data.email,
        },
      }
    }

    return {
      error: {
        message: error.message,
      },
    }
  }

  redirect('/events')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('OAuth error:', error)
    return
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error)
    return
  }

  redirect('/')
}

export async function resendVerificationEmail(email: string) {
  'use server'

  const supabase = await createClient()

  // There's no direct API to resend verification email in Supabase
  // We'll try to sign up again which will trigger a new email if user exists but unverified
  const { error, data } = await supabase.auth.signUp({
    email,
    password: Math.random().toString(36), // Dummy password, won't be used
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  // If we get a user but no session, email was sent
  if (data?.user && !data.session) {
    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    }
  }

  if (error) {
    return {
      error: 'Unable to resend verification email. Please try again later.',
    }
  }

  return {
    error: 'Unable to resend verification email. The account may already be verified.',
  }
}