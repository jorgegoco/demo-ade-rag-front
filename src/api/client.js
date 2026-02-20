// All backend communication lives here.
// The base URL is read from the .env file via Vite's import.meta.env.
const API_URL = import.meta.env.VITE_API_URL

/**
 * GET /status
 * Returns info about the currently indexed document.
 * Response: { document_loaded, document_name, total_chunks, chunk_summary, total_pages, indexed_at }
 */
export async function getStatus() {
  const response = await fetch(`${API_URL}/status`)
  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`)
  }
  return response.json()
}

/**
 * POST /ingest
 * Uploads and indexes a document.
 * Input: a single File object (multipart/form-data, field name: "file")
 * Response: IngestResponse { success, document_name, parsing, indexing, error }
 */
export async function ingestDocument(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/ingest`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Server error: ${response.status}`)
  }

  return response.json()
}

/**
 * POST /query
 * Sends a question and retrieval parameters to the backend.
 * Input: { question, top_k, threshold, chunk_type_filter }
 * Response: QueryResponse { success, question, answer, sources, retrieval_info, error }
 */
export async function queryDocument({ question, top_k, threshold, chunk_type_filter }) {
  const response = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      top_k,
      threshold,
      // Send null if no filter is selected so the backend retrieves all chunk types
      chunk_type_filter: chunk_type_filter || null,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `Server error: ${response.status}`)
  }

  return response.json()
}

/**
 * GET /health
 * Quick service health check — called on mount to verify backend is reachable.
 * Response: { status, ade_configured, openai_configured, anthropic_configured,
 *             chroma_collection_count, document_loaded, document_name, max_file_size_mb }
 */
export async function checkHealth() {
  const response = await fetch(`${API_URL}/health`)
  return response.json()
}
