import { NextResponse } from 'next/server'

interface Post {
  id: number
  title: string
  body: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    body: 'Build pages and APIs with the App Router.',
  },
  {
    id: 2,
    title: 'Route Handlers',
    body: 'Return JSON from a server-side GET handler.',
  },
]

export function GET() {
  return NextResponse.json(posts)
}
