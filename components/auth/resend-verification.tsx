'use client'

import { useState } from 'react'
import { resendVerificationEmail } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail } from 'lucide-react'

interface ResendVerificationProps {
  email: string
}

export function ResendVerification({ email }: ResendVerificationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  async function handleResend() {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await resendVerificationEmail(email)
      setResult(response)
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
        disabled={isLoading}
        variant="outline"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
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