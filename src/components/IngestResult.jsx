// Displayed after a successful document ingest.
// Shows: document summary, chunk type breakdown, and timing stats.
// Uses ChunkTypeBadge so the same colors appear here and in the query results —
// connecting what was ingested to what gets retrieved.

import { FileText, CheckCircle } from 'lucide-react'
import ChunkTypeBadge from './ChunkTypeBadge'

function TimingPill({ label, valueMs, color }) {
  const seconds = (valueMs / 1000).toFixed(1)
  return (
    <div className={`flex flex-col items-center px-4 py-2 rounded-lg ${color}`}>
      <span className="text-xs font-medium opacity-70">{label}</span>
      <span className="text-lg font-bold">{seconds}s</span>
    </div>
  )
}

export default function IngestResult({ result }) {
  const { document_name, parsing, indexing } = result
  const chunkSummary = parsing?.chunk_summary || {}
  const chunkEntries = Object.entries(chunkSummary).filter(([, count]) => count > 0)

  return (
    <div className="bg-white border border-green-200 rounded-xl p-5 flex flex-col gap-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        <h3 className="text-sm font-semibold text-slate-700">Document indexed successfully</h3>
      </div>

      {/* Document summary */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-medium truncate max-w-xs">{document_name}</span>
        </div>
        <span>{parsing?.total_pages ?? '—'} pages</span>
        <span>{indexing?.chunks_embedded ?? parsing?.total_chunks ?? '—'} chunks indexed</span>
      </div>

      {/* Chunk type breakdown */}
      {chunkEntries.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Chunk breakdown
          </p>
          <div className="flex flex-wrap gap-2">
            {chunkEntries.map(([type, count]) => (
              <div key={type} className="flex items-center gap-1.5">
                <ChunkTypeBadge type={type} />
                <span className="text-xs text-slate-500 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timing stats */}
      {(parsing?.parse_duration_ms || indexing?.embedding_duration_ms) && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Processing time
          </p>
          <div className="flex gap-3 flex-wrap">
            {parsing?.parse_duration_ms != null && (
              <TimingPill
                label="Parse"
                valueMs={parsing.parse_duration_ms}
                color="bg-blue-50 text-blue-700"
              />
            )}
            {indexing?.embedding_duration_ms != null && (
              <TimingPill
                label="Embed"
                valueMs={indexing.embedding_duration_ms}
                color="bg-purple-50 text-purple-700"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
