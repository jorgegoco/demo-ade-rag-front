// Visual progress bar representing a cosine similarity score (0.0 to 1.0).
// Color changes with value to teach students how to interpret similarity:
//   red = low relevance, yellow = moderate, green = high relevance.

export default function SimilarityBar({ value }) {
  const pct = Math.round(value * 100)

  const color =
    pct >= 60 ? 'bg-green-500' :
    pct >= 40 ? 'bg-yellow-500' :
    'bg-red-400'

  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
