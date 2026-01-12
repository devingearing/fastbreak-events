import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function DebugPage() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Try to get all events without auth context
  const { data: allEvents, error: allEventsError } = await supabase
    .from('events')
    .select('id, name, user_id, created_at')

  // Try to get events with RLS
  let userEvents = null
  let userEventsError = null

  if (user?.id) {
    const result = await supabase
      .from('events')
      .select('id, name, user_id, created_at')
      .eq('user_id', user.id)

    userEvents = result.data
    userEventsError = result.error
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug Information</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Current User</h2>
          <pre className="text-sm overflow-auto">
            {user ? JSON.stringify({ id: user.id, email: user.email }, null, 2) : 'No user'}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">All Events Query (without user filter)</h2>
          {allEventsError ? (
            <pre className="text-sm text-red-600">Error: {JSON.stringify(allEventsError, null, 2)}</pre>
          ) : (
            <pre className="text-sm overflow-auto">
              Found {allEvents?.length || 0} events:
              {JSON.stringify(allEvents || [], null, 2)}
            </pre>
          )}
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">User Events Query (with user_id filter)</h2>
          {userEventsError ? (
            <pre className="text-sm text-red-600">Error: {JSON.stringify(userEventsError, null, 2)}</pre>
          ) : (
            <pre className="text-sm overflow-auto">
              Found {userEvents?.length || 0} events:
              {JSON.stringify(userEvents || [], null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}