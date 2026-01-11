import { getEvent } from '@/app/actions/events'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Trophy, Edit, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getEvent(params.id)

  if (result.error || !result.data) {
    notFound()
  }

  const event = result.data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/events/${event.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{event.name}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <Badge variant="secondary">{event.sport_type}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(event.event_date), 'PPP')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {event.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Event Details</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Date & Time</dt>
                <dd className="mt-1 text-sm">{format(new Date(event.event_date), 'PPPp')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Sport Type</dt>
                <dd className="mt-1 text-sm">{event.sport_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">{format(new Date(event.created_at), 'PP')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="mt-1 text-sm">{format(new Date(event.updated_at), 'PP')}</dd>
              </div>
            </dl>
          </div>

          {event.venues && event.venues.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Venues</h3>
              <div className="space-y-3">
                {event.venues.map((venue) => (
                  <Card key={venue.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-base">{venue.name}</CardTitle>
                          <CardDescription>
                            {venue.address}
                            <br />
                            {venue.city}{venue.state && `, ${venue.state}`}, {venue.country}
                            {venue.postal_code && ` ${venue.postal_code}`}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}