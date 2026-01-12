import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function TestDBPage() {
  let user = null
  let eventsError = null
  let eventsData = null
  let rawQueryError = null
  let rawQueryData = null

  try {
    const supabase = await createClient()

    // Get current user
    const userResult = await supabase.auth.getUser()
    user = userResult.data.user

    // Try a simple query
    const eventsResult = await supabase
      .from('events')
      .select('*')
      .limit(5)

    eventsData = eventsResult.data
    eventsError = eventsResult.error

    // Try raw SQL query
    const rawResult = await supabase.rpc('get_user_id', {})
      .single()
      .catch(() => null)

  } catch (e) {
    console.error('Test DB error:', e)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Database Connection Test</h1>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Current User</h2>
        <pre className="text-sm overflow-auto">
          {user ? JSON.stringify({ id: user.id, email: user.email }, null, 2) : 'No user'}
        </pre>
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Events Table Query</h2>
        {eventsError ? (
          <div>
            <p className="text-red-600 font-semibold">Error:</p>
            <pre className="text-sm text-red-600 overflow-auto">
              {JSON.stringify(eventsError, null, 2)}
            </pre>
          </div>
        ) : (
          <div>
            <p>Found {eventsData?.length || 0} events</p>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(eventsData || [], null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Direct Supabase Test</h2>
        <p className="text-sm">
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not set'}
        </p>
        <p className="text-sm">
          Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
        </p>
      </div>
    </div>
  )
}