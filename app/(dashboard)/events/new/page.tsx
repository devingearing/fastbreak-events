import { getVenues } from '@/app/actions/venues'
import { EventForm } from '@/components/forms/event-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewEventPage() {
  const result = await getVenues()

  if (result.error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">Error loading venues: {result.error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>
            Fill in the details to create a new sports event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventForm venues={result.data || []} />
        </CardContent>
      </Card>
    </div>
  )
}