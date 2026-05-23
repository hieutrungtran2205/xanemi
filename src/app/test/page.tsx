import { getTrending } from '@/lib/tmdb/endpoints'

export default async function TestPage() {
  const data = await getTrending()

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace', background: '#0a0a0b', color: '#fff', minHeight: '100vh' }}>
      <h1>TMDB Test — {data.total_results} results</h1>
      <pre style={{ fontSize: '0.75rem', overflow: 'auto' }}>
        {JSON.stringify(data.results.slice(0, 3), null, 2)}
      </pre>
    </main>
  )
}
