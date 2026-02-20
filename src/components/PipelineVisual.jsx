// Educational diagram showing the 3-phase RAG pipeline.
// The active phase is highlighted so students can see which step is running.
// Phases:
//   1. Ingest  — Parse document, embed chunks, store in ChromaDB
//   2. Retrieve — Embed the query, find similar chunks by cosine similarity
//   3. Generate — Pass retrieved chunks as context, Claude writes the answer

import { Upload, Search, MessageSquare, ChevronRight } from 'lucide-react'

const PHASES = [
  {
    id: 'ingest',
    label: 'Ingest',
    icon: Upload,
    description: 'Parse → Chunk → Embed → Store',
    activeColor: 'bg-blue-50 border-blue-400 ring-2 ring-blue-300',
    iconColor: 'text-blue-500',
    defaultColor: 'bg-white border-slate-200',
  },
  {
    id: 'retrieve',
    label: 'Retrieve',
    icon: Search,
    description: 'Embed Query → Cosine Similarity',
    activeColor: 'bg-purple-50 border-purple-400 ring-2 ring-purple-300',
    iconColor: 'text-purple-500',
    defaultColor: 'bg-white border-slate-200',
  },
  {
    id: 'generate',
    label: 'Generate',
    icon: MessageSquare,
    description: 'Context + LLM → Answer',
    activeColor: 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300',
    iconColor: 'text-emerald-500',
    defaultColor: 'bg-white border-slate-200',
  },
]

export default function PipelineVisual({ activePhase }) {
  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        RAG Pipeline
      </p>
      <div className="flex items-center gap-1 sm:gap-2">
        {PHASES.map((phase, index) => {
          const Icon = phase.icon
          const isActive = activePhase === phase.id

          return (
            <div key={phase.id} className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
              {/* Phase card */}
              <div
                className={`flex-1 flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border transition-all duration-300 ${
                  isActive ? phase.activeColor : phase.defaultColor
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? phase.iconColor : 'text-slate-300'
                  }`}
                />
                <span
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isActive ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {phase.label}
                </span>
                <span className="text-xs text-slate-400 text-center leading-tight hidden sm:block">
                  {phase.description}
                </span>
              </div>

              {/* Arrow separator (not after the last phase) */}
              {index < PHASES.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
