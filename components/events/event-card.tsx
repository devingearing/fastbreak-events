import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Trophy, MoreVertical, Edit, Trash } from 'lucide-react'
import { format } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import type { EventWithVenues } from '@/types'

interface EventCardProps {
  event: EventWithVenues
  onDelete?: (id: string) => void
  isOwner?: boolean
}

export function EventCard({ event, onDelete, isOwner = false }: EventCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1 flex-1 pr-2">
          <CardTitle className="text-xl font-semibold line-clamp-2">
            {event.name}
          </CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{event.sport_type}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/events/${event.id}`} className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/events/${event.id}/edit`} className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive flex items-center"
                  onClick={() => onDelete?.(event.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span>{format(new Date(event.event_date), 'PPp')}</span>
        </div>

        {event.venues && event.venues.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {event.venues.slice(0, 2).map((venue) => (
                <div key={venue.id} className="line-clamp-1">
                  {venue.name}
                  {venue.city && `, ${venue.city}`}
                </div>
              ))}
              {event.venues.length > 2 && (
                <div className="text-muted-foreground">
                  +{event.venues.length - 2} more venue{event.venues.length > 3 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-4">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>View Event</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}