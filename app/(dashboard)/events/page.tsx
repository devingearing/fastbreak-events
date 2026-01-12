import { Suspense } from 'react'
import { getEvents } from '@/app/actions/events'
import { getCurrentUser } from '@/app/actions/auth'
import { EventsGrid } from '@/components/events/events-grid'
import { EventFilters } from '@/components/events/event-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { search?: string; sport_type?: string }
}) {
  const [result, currentUser] = await Promise.all([
    getEvents({
      search: searchParams.search,
      sport_type: searchParams.sport_type,
    }),
    getCurrentUser()
  ])

  if (result.error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">Error loading events: {result.error}</p>
        <Button asChild variant="outline">
          <Link href="/events">Try Again</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your sports events and venues
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

      <EventsGrid
        events={result.data || []}
        currentUserId={currentUser?.id}
        hasFilters={!!searchParams.search || !!searchParams.sport_type}
      />
    </div>
  )
}