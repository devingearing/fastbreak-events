import { getEvent } from '@/app/actions/events'
import { getCurrentUser } from '@/app/actions/auth'
import { getVenues } from '@/app/actions/venues'
import { EventForm } from '@/components/forms/event-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function EditEventPage({
  params,
}: {
  params: { id: string }
}) {
  // In Next.js 15, params might be a Promise
  const resolvedParams = await Promise.resolve(params)
  const eventId = resolvedParams.id

  const [eventResult, venuesResult, currentUser] = await Promise.all([
    getEvent(eventId),
    getVenues(),
    getCurrentUser()
  ])

  if (eventResult.error || !eventResult.data) {
    notFound()
  }

  // Check if current user is the owner
  if (currentUser?.id !== eventResult.data.user_id) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Unauthorized Access</CardTitle>
            </div>
            <CardDescription>
              You don't have permission to edit this event.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button asChild>
              <Link href={`/events/${eventId}`}>View Event</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">Back to Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (venuesResult.error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">Error loading venues: {venuesResult.error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>
            Update the details of your sports event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm
            event={eventResult.data}
            venues={venuesResult.data || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}