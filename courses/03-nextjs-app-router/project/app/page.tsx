import ChallengeList from './components/ChallengeList'
import Counter from './components/Counter'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Next.js App Router Project</h1>
        <nav aria-label="Main navigation">
          <Link href="/about">About</Link>
        </nav>
        <p>Complete the challenges to build your Next.js skills!</p>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Work on challenges by modifying code in <code>app/</code> directory.
          Run <code>npm run dev</code> to see your changes.
        </p>
      </header>
      <Image
        src="/nextjs-app-router.svg"
        alt="Diagram showing Next.js pages connected to routes"
        width={720}
        height={360}
        priority
      />
      <Counter />
      <ChallengeList />
    </main>
  )
}
