import React, { useEffect, useState } from 'react'

export default function Leaderboard(){
  const [list, setList] = useState([])
  useEffect(() => {
    fetch('/mockLeaderboard.json').then(r=>r.json()).then(setList).catch(()=>setList([]))
  },[])
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Leaderboard (Mock)</h3>
      <div className="space-y-2">
        {list.map((p,i)=>(
          <div key={i} className="flex items-center justify-between bg-slate-50 rounded p-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center font-semibold text-xs">{i+1}</div>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">{p.date}</div>
              </div>
            </div>
            <div className="font-semibold">{p.score}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
