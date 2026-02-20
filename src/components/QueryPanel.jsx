// Q&A input panel with an expandable "Advanced options" drawer.
// All retrieval parameters (top_k, threshold, chunk_type_filter) live here as local state.
// When the user submits, it calls onQuery() with all parameters so App.jsx
// can send them to the backend.

import { useState } from 'react'
import { Send, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import ChunkTypeBadge from './ChunkTypeBadge'

// Chunk types the backend accepts as filters (lowercase, no prefix)
const CHUNK_TYPE_OPTIONS = [
  { value: null,         label: 'All types' },
  { value: 'text',       label: 'Text' },
  { value: 'table',      label: 'Table' },
  { value: 'figure',     label: 'Figure' },
  { value: 'marginalia', label: 'Marginalia' },
]

export default function QueryPanel({ onQuery, loading, disabled }) {
  const [question, setQuestion]               = useState('')
  const [topK, setTopK]                       = useState(3)
  const [threshold, setThreshold]             = useState(0.25)
  const [chunkTypeFilter, setChunkTypeFilter] = useState(null)
  const [showAdvanced, setShowAdvanced]       = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!question.trim() || loading || disabled) return
    onQuery({
      question: question.trim(),
      top_k: topK,
      threshold,
      chunk_type_filter: chunkTypeFilter,
    })
  }

  // Allow submitting with Ctrl+Enter or Cmd+Enter
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Disabled state hint */}
      {disabled && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
          Index a document first using the <strong>Ingest</strong> tab before asking questions.
        </p>
      )}

      {/* Question textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Your question
        </label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          placeholder="e.g. What was the total revenue in 2023?"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700
                     placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300
                     disabled:bg-slate-50 disabled:text-slate-400 transition"
        />
        <p className="text-xs text-slate-400 self-end">Ctrl + Enter to send</p>
      </div>

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 self-start transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
        Advanced options
        {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Advanced options panel */}
      {showAdvanced && (
        <div className="flex flex-col gap-4 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl">

          {/* top_k slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-slate-600">
                Max sources <span className="font-normal text-slate-400">(top_k)</span>
              </label>
              <span className="text-sm font-bold text-blue-600">{topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-slate-400">How many chunks to retrieve from ChromaDB</p>
          </div>

          {/* threshold slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-semibold text-slate-600">
                Min similarity <span className="font-normal text-slate-400">(threshold)</span>
              </label>
              <span className="text-sm font-bold text-purple-600">{threshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
            <p className="text-xs text-slate-400">Only return chunks with similarity ≥ this value</p>
          </div>

          {/* chunk_type_filter buttons */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Filter by chunk type <span className="font-normal text-slate-400">(chunk_type_filter)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CHUNK_TYPE_OPTIONS.map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setChunkTypeFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    chunkTypeFilter === opt.value
                      ? 'bg-slate-700 text-white border-slate-700'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {opt.value ? <ChunkTypeBadge type={opt.value} /> : opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">Restrict retrieval to one chunk type (hybrid search)</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!question.trim() || loading || disabled}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600
                   text-white text-sm font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-start"
      >
        <Send className="w-4 h-4" />
        {loading ? 'Thinking…' : 'Ask'}
      </button>
    </form>
  )
}
