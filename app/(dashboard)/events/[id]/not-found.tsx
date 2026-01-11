import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarX } from 'lucide-react'

export default function EventNotFound() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CalendarX className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle>Event Not Found</CardTitle>
          <CardDescription>
            The event you're looking for doesn't exist or has been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}