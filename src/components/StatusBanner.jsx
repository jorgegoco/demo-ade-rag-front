// Always-visible banner at the top of the page showing the currently indexed document.
// Three states: loading (null), no document (yellow warning), document ready (green).

import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

export default function StatusBanner({ docStatus }) {
  // Loading state — status fetch not yet complete
  if (docStatus === null) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-400 text-sm">
        <Loader className="w-4 h-4 animate-spin" />
        <span>Checking document status…</span>
      </div>
    )
  }

  // No document indexed yet
  if (!docStatus.document_loaded) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
        <span className="text-sm text-yellow-800">
          No document indexed. Upload a document in the <strong>Ingest</strong> tab to get started.
        </span>
      </div>
    )
  }

  // Document ready
  const indexedAt = docStatus.indexed_at
    ? new Date(docStatus.indexed_at).toLocaleString()
    : null

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 min-w-0">
        <span className="text-sm font-semibold text-green-800 truncate">
          {docStatus.document_name}
        </span>
        <span className="text-xs text-green-600">
          {docStatus.total_chunks} chunks indexed
        </span>
        {docStatus.total_pages > 0 && (
          <span className="text-xs text-green-500">
            {docStatus.total_pages} pages
          </span>
        )}
      </div>
      {indexedAt && (
        <span className="text-xs text-green-400 ml-auto shrink-0 hidden sm:block">
          {indexedAt}
        </span>
      )}
    </div>
  )
}
