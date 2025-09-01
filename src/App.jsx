import React, { useState } from 'react'
import GameBoard from './components/GameBoard'
import ScoreBoard from './components/ScoreBoard'
import Leaderboard from './components/Leaderboard'

export default function App() {
  const [best, setBest] = useState(() => {
    try { return Number(localStorage.getItem('bestScore') || '0') } catch { return 0 }
  })
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Reaction Speed</h1>
          <div className="text-sm text-gray-500">Built with React + Tailwind + Framer Motion</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <main className="md:col-span-2 bg-white rounded-xl shadow p-4">
            <GameBoard onNewBest={(b) => { if (b>best) { setBest(b); localStorage.setItem('bestScore', String(b)) } }} />
          </main>
          <aside className="bg-white rounded-xl shadow p-4">
            <ScoreBoard best={best} />
            <Leaderboard />
          </aside>
        </div>

        <footer className="text-xs text-gray-400 mt-4 text-center">
          Save best score in localStorage · Demo assignment
        </footer>
      </div>
    </div>
  )
}
