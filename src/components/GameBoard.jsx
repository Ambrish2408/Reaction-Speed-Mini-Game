import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInterval from 'react-use/lib/useInterval'

const TARGET_SIZES = [90, 75, 60, 48, 40]

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min }

export default function GameBoard({ onNewBest }) {
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [timeLeft, setTimeLeft] = useState(2000) 
  const [target, setTarget] = useState(null)
  const [bestLocal, setBestLocal] = useState(() => Number(localStorage.getItem('bestScore')||'0'))
  const [isStarting, setIsStarting] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const timerRef = useRef(null)

  const clickSoundRef = useRef(null)
  const missSoundRef = useRef(null)
  const startSoundRef = useRef(null)

  useEffect(() => {
   
    clickSoundRef.current = new Audio('/sounds/click.wav')
    missSoundRef.current = new Audio('/sounds/miss.wav')
    startSoundRef.current = new Audio('/sounds/start.wav')
  }, [])

  useEffect(() => {
    if (!running) { clearTarget(); return }
    spawnNew()
   
  }, [running])

  useEffect(() => {
    if (score>bestLocal){ setBestLocal(score); localStorage.setItem('bestScore', String(score)); onNewBest && onNewBest(score) }
    
  }, [score])

  useEffect(() => {
    let t
    if (isStarting) {
      if (countdown > 0) {
        t = setTimeout(() => setCountdown(c => c-1), 1000)
      } else {
       
        setIsStarting(false)
        setCountdown(3)
       
        try { startSoundRef.current && startSoundRef.current.play() } catch(e){}
        setRunning(true)
      }
    }
    return () => clearTimeout(t)
    
  }, [isStarting, countdown])

  useInterval(() => {
    if (!running || paused) return
    
  }, 100)

  function clearTarget(){
    setTarget(null)
    if (timerRef.current){ clearTimeout(timerRef.current); timerRef.current = null }
  }

  function spawnNew(){
    clearTarget()
    const size = TARGET_SIZES[Math.min(round, TARGET_SIZES.length-1)]
    const board = document.getElementById('game-board')
    const rect = board.getBoundingClientRect()
    const x = randInt(20, Math.max(20, Math.floor(rect.width - size - 20)))
    const y = randInt(20, Math.max(20, Math.floor(rect.height - size - 20)))
    const id = Math.random().toString(36).slice(2,9)
    setTarget({ id, x, y, size })
    
    timerRef.current = setTimeout(() => {
      
      try { missSoundRef.current && missSoundRef.current.play() } catch(e){}
      setRunning(false)
    }, timeLeft)
  }

  function handleHit(){
   
    try { clickSoundRef.current && clickSoundRef.current.play() } catch(e){}
   
    setScore(s => s+1)
    setRound(r => r+1)
   
    setTimeLeft(t => Math.max(350, Math.round(t * 0.92)))
    
    setTarget(null)
    if (timerRef.current){ clearTimeout(timerRef.current); timerRef.current = null }
    setTimeout(() => {
      if (running && !paused) spawnNew()
    }, 150)
  }

  function startSequence(){
    setScore(0)
    setRound(0)
    setTimeLeft(2000)
    setIsStarting(true)
    setPaused(false)
    
  }

  function restart(){
    setScore(0)
    setRound(0)
    setTimeLeft(2000)
    setIsStarting(false)
    setPaused(false)
    setRunning(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-xl font-semibold">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Round</div>
          <div className="text-xl font-semibold">{round}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Time per target</div>
          <div className="text-xl font-semibold">{Math.round(timeLeft)} ms</div>
        </div>
      </div>

      <div id="game-board" className="relative w-full h-96 bg-gradient-to-tr from-sky-50 to-white rounded-lg border border-slate-100 overflow-hidden">
        <AnimatePresence>
          {target && !paused && (
            <motion.button
              key={target?.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={handleHit}
              style={{ position: 'absolute', left: target.x, top: target.y, width: target.size, height: target.size, borderRadius: target.size/2 }}
              className="bg-gradient-to-br from-pink-400 to-rose-400 shadow-lg flex items-center justify-center text-white font-bold"
            >
              <div className="w-3/5 h-3/5 rounded-full bg-white/30" />
            </motion.button>
          )}
        </AnimatePresence>

        {!running && !isStarting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Reaction Speed</h2>
            <p className="text-sm text-gray-600 mt-2">Click targets before the timer runs out. Difficulty increases each round.</p>
            <div className="mt-4 flex gap-3">
              <button onClick={startSequence} className="px-4 py-2 bg-sky-600 text-white rounded">Start</button>
              <button onClick={() => { setScore(0); setRound(0); setTimeLeft(2000); localStorage.setItem('bestScore','0'); setBestLocal(0) }} className="px-4 py-2 border rounded">Reset Best</button>
            </div>
          </div>
        )}

        {isStarting && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-6xl font-bold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {countdown > 0 ? countdown : 'Go!'}
          </motion.div>
        )}

        {running && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={() => setPaused(p => !p)} className="px-3 py-1 bg-white/90 rounded shadow text-sm">
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => setRunning(false)} className="px-3 py-1 bg-white/90 rounded shadow text-sm">End</button>
            <button onClick={restart} className="px-3 py-1 bg-white/90 rounded shadow text-sm">Restart</button>
          </div>
        )}

        {!running && score>0 && (
          <div className="absolute bottom-3 left-3 bg-white/90 rounded p-2 shadow text-sm">
            <div className="font-medium">Game Over</div>
            <div>Score: {score}</div>
            <div className="mt-2">
              <button onClick={restart} className="px-3 py-1 bg-sky-600 text-white rounded text-sm">Play Again</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
