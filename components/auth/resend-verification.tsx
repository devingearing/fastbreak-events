'use client'

import { useState, useEffect } from 'react'
import { resendVerificationEmail } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Clock } from 'lucide-react'

interface ResendVerificationProps {
  email: string
}

export function ResendVerification({ email }: ResendVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownSeconds])

  async function handleResend() {
    if (cooldownSeconds > 0) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await resendVerificationEmail(email)
      setResult(response)

      // Start cooldown if successful
      if (response.success) {
        setCooldownSeconds(60)
      }
    } catch (error) {
      setResult({ error: 'An unexpected error occurred.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {result?.success && (
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>{result.message}</AlertDescription>
        </Alert>
      )}

      {result?.error && (
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleResend}
        disabled={isLoading || cooldownSeconds > 0}
        variant="default"
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Verification Email...
          </>
        ) : cooldownSeconds > 0 ? (
          <>
            <Clock className="mr-2 h-4 w-4" />
            Resend in {cooldownSeconds}s
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Resend Verification Email
          </>
        )}
      </Button>
    </div>
  )
}