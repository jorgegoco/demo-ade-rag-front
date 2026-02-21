// Root component — all application state lives here.
// Children receive only the props they need; no global state library is used.
//
// Two tabs:
//   Ingest — upload a document, parse + embed + store it in ChromaDB
//   Query  — ask questions, retrieve relevant chunks, get an AI-generated answer

import { useState, useEffect } from 'react'
import { Upload, MessageSquare, Info } from 'lucide-react'

import { getStatus, ingestDocument, queryDocument } from './api/client'

import StatusBanner    from './components/StatusBanner'
import PipelineVisual  from './components/PipelineVisual'
import UploadZone      from './components/UploadZone'
import IngestResult    from './components/IngestResult'
import QueryPanel      from './components/QueryPanel'
import AnswerDisplay   from './components/AnswerDisplay'
import SourcesList     from './components/SourcesList'
import LoadingSpinner  from './components/LoadingSpinner'
import ErrorBanner     from './components/ErrorBanner'

export default function App() {
  // ── Document status (fetched on mount, refreshed after ingest) ──────────
  const [docStatus, setDocStatus] = useState(null)

  // ── Active tab ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('ingest')

  // ── Ingest flow ──────────────────────────────────────────────────────────
  const [ingestFile,    setIngestFile]    = useState(null)
  const [ingestLoading, setIngestLoading] = useState(false)
  const [ingestResult,  setIngestResult]  = useState(null)
  const [ingestError,   setIngestError]   = useState(null)

  // ── Query flow ───────────────────────────────────────────────────────────
  const [queryResult,  setQueryResult]  = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)
  const [queryError,   setQueryError]   = useState(null)

  // ── Derived: which RAG phase to highlight in PipelineVisual ─────────────
  const activePhase =
    ingestLoading              ? 'ingest'   :
    queryLoading               ? 'retrieve' :
    queryResult && !queryLoading ? 'generate' :
    null

  // ── On mount: fetch document status ─────────────────────────────────────
  useEffect(() => {
    getStatus()
      .then((data) => {
        setDocStatus(data)
        // If a document is already indexed, start on the query tab
        if (data.document_loaded) setActiveTab('query')
      })
      .catch(() => {
        // Backend unreachable — show "no document" state gracefully
        setDocStatus({ document_loaded: false })
      })
  }, [])

  // ── Ingest handler ───────────────────────────────────────────────────────
  const handleIngest = async () => {
    if (!ingestFile) return
    setIngestLoading(true)
    setIngestError(null)
    setIngestResult(null)
    try {
      const data = await ingestDocument(ingestFile)
      if (!data.success) throw new Error(data.error || 'Ingest failed')
      setIngestResult(data)
      // Refresh the status banner to show the new document
      const newStatus = await getStatus()
      setDocStatus(newStatus)
      // Give the user 1.2 s to read the ingest stats, then switch to query tab
      setTimeout(() => setActiveTab('query'), 1200)
    } catch (err) {
      setIngestError(err.message || 'Unexpected error during ingest')
    } finally {
      setIngestLoading(false)
    }
  }

  // ── Query handler ────────────────────────────────────────────────────────
  const handleQuery = async (params) => {
    setQueryLoading(true)
    setQueryError(null)
    setQueryResult(null)
    try {
      const data = await queryDocument(params)
      if (!data.success) throw new Error(data.error || 'Query failed')
      setQueryResult(data)
    } catch (err) {
      setQueryError(err.message || 'Unexpected error during query')
    } finally {
      setQueryLoading(false)
    }
  }

  // ── File change: clear previous ingest state on new file selection ───────
  const handleFileChange = (file) => {
    setIngestFile(file)
    setIngestResult(null)
    setIngestError(null)
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            RAG Document Q&amp;A
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload a document, index it with embeddings, and ask questions answered by AI
          </p>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">

        {/* Always visible: indexed document status */}
        <StatusBanner docStatus={docStatus} />

        {/* Always visible: RAG pipeline diagram */}
        <PipelineVisual activePhase={activePhase} />

        {/* ── Tab switcher ── */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl overflow-hidden -mb-3">
          {[
            { id: 'ingest', label: 'Ingest Document', icon: Upload },
            { id: 'query',  label: 'Ask Questions',   icon: MessageSquare },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Ingest tab ── */}
        {activeTab === 'ingest' && (
          <div className="bg-white rounded-b-xl rounded-tr-xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-5 shadow-sm">
            <div className="flex gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p>
                  <strong>Demo pre-loaded:</strong> This service comes ready to query with Apple's 10-K annual
                  report (FY2023) — 453 indexed chunks. You can start asking questions immediately.
                </p>
                <p className="text-blue-600">
                  Want to try with your own document? Upload any PDF, image, Word, or spreadsheet file below.
                  Your upload will replace the demo document for this session. The demo resets automatically
                  after a service restart.
                </p>
              </div>
            </div>

            <UploadZone file={ingestFile} onFileChange={handleFileChange} />

            <button
              onClick={handleIngest}
              disabled={!ingestFile || ingestLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600
                         text-white text-sm font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-start"
            >
              <Upload className="w-4 h-4" />
              {ingestLoading ? 'Indexing…' : 'Index Document'}
            </button>

            {ingestLoading && (
              <LoadingSpinner message="Parsing and embedding document — this may take a minute…" />
            )}
            {ingestError   && <ErrorBanner message={ingestError} />}
            {ingestResult  && <IngestResult result={ingestResult} />}
          </div>
        )}

        {/* ── Query tab ── */}
        {activeTab === 'query' && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-b-xl rounded-tr-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
              <QueryPanel
                onQuery={handleQuery}
                loading={queryLoading}
                disabled={!docStatus?.document_loaded}
              />
            </div>

            {queryLoading && (
              <LoadingSpinner message="Retrieving relevant chunks and generating answer…" />
            )}
            {queryError  && <ErrorBanner message={queryError} />}

            {queryResult && (
              <>
                <AnswerDisplay
                  answer={queryResult.answer}
                  question={queryResult.question}
                />
                <SourcesList
                  sources={queryResult.sources}
                  retrievalInfo={queryResult.retrieval_info}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200 bg-white mt-auto">
        Powered by ADE · ChromaDB · Claude &nbsp;·&nbsp; Demo only
      </footer>
    </div>
  )
}
