import { getEvent } from '@/app/actions/events'
import { getVenues } from '@/app/actions/venues'
import { EventForm } from '@/components/forms/event-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

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

  const [eventResult, venuesResult] = await Promise.all([
    getEvent(eventId),
    getVenues(),
  ])

  if (eventResult.error || !eventResult.data) {
    notFound()
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