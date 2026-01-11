import { getEvents } from '@/app/actions/events'
import { EventsGrid } from '@/components/events/events-grid'
import { EventFilters } from '@/components/events/event-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { search?: string; sport?: string }
}) {
  const result = await getEvents({
    search: searchParams.search,
    sport_type: searchParams.sport,
  })

  if (result.error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">Error loading events: {result.error}</p>
        <Button asChild variant="outline">
          <Link href="/events">Try again</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports Events</h1>
          <p className="text-muted-foreground">
            Manage and track all your sports events
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <EventFilters />

      <EventsGrid events={result.data || []} />
    </div>
  )
}