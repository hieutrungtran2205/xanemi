import { NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb/endpoints'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) {
    return NextResponse.json({ results: [], total_results: 0 })
  }

  try {
    const data = await searchMovies(q, 1)
    return NextResponse.json({
      results: data.results.slice(0, 5),
      total_results: data.total_results,
    })
  } catch {
    return NextResponse.json({ results: [], total_results: 0 }, { status: 500 })
  }
}
