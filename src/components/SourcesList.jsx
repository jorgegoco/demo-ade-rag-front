// Container for all retrieved source chunks shown after a query.
// The retrieval info bar at the top teaches students what happened during the
// Retrieve phase: how many chunks were searched, how many passed the threshold.

import ChunkTypeBadge from './ChunkTypeBadge'
import SourceCard from './SourceCard'

export default function SourcesList({ sources, retrievalInfo }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Section header */}
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Retrieved sources
      </h3>

      {/* Retrieval info bar */}
      {retrievalInfo && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500
                        bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
          <span>
            <strong className="text-slate-700">{retrievalInfo.chunks_returned}</strong> sources returned
          </span>
          <span className="text-slate-300">·</span>
          <span>
            <strong className="text-slate-700">{retrievalInfo.chunks_searched}</strong> chunks searched
          </span>
          <span className="text-slate-300">·</span>
          <span>
            threshold <strong className="text-slate-700">{retrievalInfo.threshold}</strong>
          </span>
          {retrievalInfo.chunk_type_filter && (
            <>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                filtered by <ChunkTypeBadge type={retrievalInfo.chunk_type_filter} />
              </span>
            </>
          )}
        </div>
      )}

      {/* Source cards or empty state */}
      {sources && sources.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sources.map((source) => (
            <SourceCard key={source.chunk_id} source={source} />
          ))}
        </div>
      ) : (
        <div className="text-sm text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-5 py-6 text-center">
          No sources found above the similarity threshold.
          <br />
          Try lowering the threshold or removing the chunk type filter.
        </div>
      )}
    </div>
  )
}
