// Displays the AI-generated answer alongside the echoed question.
// whitespace-pre-wrap preserves any newlines in Claude's response.

import { HelpCircle, MessageSquare } from 'lucide-react'
import ChunkImage from './ChunkImage'

export default function AnswerDisplay({ answer, question, sources, docPdfSrc }) {
  const singleSource = sources?.length === 1 ? sources[0] : null
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      {/* Echoed question */}
      <div className="flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-500 italic">{question}</p>
      </div>

      <hr className="border-slate-100" />

      {/* Generated answer */}
      <div className="flex items-start gap-2">
        <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{answer}</p>
      </div>

      {/* Visual grounding — shown only when the answer traces to a single chunk */}
      {singleSource?.bbox && docPdfSrc && (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Source chunk
          </span>
          <ChunkImage pdfSrc={docPdfSrc} page={singleSource.page} bbox={singleSource.bbox} />
        </div>
      )}
    </div>
  )
}
