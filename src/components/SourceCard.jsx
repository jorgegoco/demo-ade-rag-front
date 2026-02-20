// Card representing a single retrieved chunk from ChromaDB.
// Shows all the metadata that makes RAG transparent:
//   - chunk type (what kind of content was retrieved)
//   - page number (where in the document it came from)
//   - similarity score (how relevant it is to the question)
//   - text preview (expandable — the actual content passed to the LLM)
//   - bounding box (the spatial coordinates in the original document)

import { useState } from 'react'
import { FileText } from 'lucide-react'
import ChunkTypeBadge from './ChunkTypeBadge'
import SimilarityBar from './SimilarityBar'

export default function SourceCard({ source }) {
  const [expanded, setExpanded] = useState(false)

  // ADE wraps chunks with <a id='uuid'></a> anchor tags — strip them before display
  const raw = source.text_preview || ''
  const preview = raw.replace(/<a[^>]*><\/a>/g, '').trim()
  const isLong = preview.length > 120
  const displayText = expanded || !isLong ? preview : preview.slice(0, 120) + '…'

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      {/* Header: chunk type + page + similarity % */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <ChunkTypeBadge type={source.chunk_type} />
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <FileText className="w-3 h-3" />
            <span>Page {source.page + 1}</span>
          </div>
        </div>
        <span className="text-sm font-bold text-slate-600">
          {Math.round(source.similarity * 100)}% match
        </span>
      </div>

      {/* Similarity bar — teaches cosine similarity as a visual metric */}
      <SimilarityBar value={source.similarity} />

      {/* Text preview */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-slate-600 leading-relaxed">{displayText}</p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-blue-500 hover:text-blue-700 self-start transition-colors"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Bounding box — spatial coordinates in the original document (normalized 0–1) */}
      {source.bbox && (
        <div className="text-xs text-slate-400 font-mono bg-slate-50 rounded-lg px-3 py-1.5 leading-relaxed">
          bbox&nbsp; x0:{source.bbox.x0?.toFixed(2)} y0:{source.bbox.y0?.toFixed(2)}&nbsp;
          x1:{source.bbox.x1?.toFixed(2)} y1:{source.bbox.y1?.toFixed(2)}
        </div>
      )}
    </div>
  )
}
