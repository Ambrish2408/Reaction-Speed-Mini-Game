import React from 'react'

export default function ScoreBoard({ best }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Stats</h3>
      <div className="bg-slate-50 rounded p-3">
        <div className="flex justify-between text-sm"><span>Best Score</span><span className="font-medium">{best}</span></div>
        <div className="flex justify-between text-sm mt-2"><span>Version</span><span className="text-gray-500">1.1</span></div>
      </div>
    </div>
  )
}
