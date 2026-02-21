# RAG Document Q&A — demo-ade-rag-front

Frontend demo for **Lesson 5** of the course
[document_ai_from_OCR_to_agentic_doc_extraction](https://github.com/jorgegoco).

Upload any document, index it with AI embeddings, and ask natural language questions.
The app returns grounded answers backed by the exact chunks retrieved from the document.

**Live backend:** https://miagentuca-demos-ade-rag.ud2cay.easypanel.host

---

## What this app demonstrates

The three phases of a RAG (Retrieval Augmented Generation) pipeline, made visible:

| Phase | What happens |
|-------|-------------|
| **Ingest** | Document is parsed by ADE into semantic chunks, embedded with OpenAI, stored in ChromaDB |
| **Retrieve** | Your question is embedded, ChromaDB finds the most similar chunks by cosine similarity |
| **Generate** | Retrieved chunks are passed as context to Claude, which writes a grounded answer |

Key concepts taught through the UI:
- **Similarity scores** — color-coded bars (red / yellow / green) per source chunk
- **Chunk types** — text, table, figure, marginalia etc., each color-coded consistently
- **Hybrid search** — filter retrieval to a specific chunk type (e.g. tables only)
- **Threshold tuning** — adjust minimum similarity to control result quality vs. quantity
- **Visual grounding** — cropped PDF image of each source chunk rendered directly in the card, tracing answers back to the exact page region

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 7 |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| File upload | react-dropzone |
| PDF rendering | pdfjs-dist (chunk visual grounding) |
| State | Plain useState (no Redux) |
| Backend | FastAPI (separate repo, deployed on Contabo VPS / Easypanel) |

---

## Project structure

```
src/
├── api/
│   └── client.js            # All fetch calls to the backend
└── components/
    ├── StatusBanner.jsx     # Shows currently indexed document
    ├── PipelineVisual.jsx   # Animated 3-phase RAG diagram
    ├── UploadZone.jsx       # Drag-and-drop upload (react-dropzone)
    ├── IngestResult.jsx     # Chunk summary + timing stats after ingest
    ├── QueryPanel.jsx       # Question input + advanced options drawer
    ├── AnswerDisplay.jsx    # AI-generated answer display (+ visual crop when single source)
    ├── SourcesList.jsx      # Retrieval info + list of source chunks
    ├── SourceCard.jsx       # Individual chunk: type, page, similarity, preview, visual crop
    ├── ChunkImage.jsx       # Cropped PDF canvas rendered via pdfjs-dist
    ├── ChunkTypeBadge.jsx   # Color-coded chunk type pill
    ├── SimilarityBar.jsx    # Visual similarity score bar
    ├── LoadingSpinner.jsx   # Spinner with contextual message
    └── ErrorBanner.jsx      # Error notification
```

---

## Getting started

```bash
git clone https://github.com/jorgegoco/demo-ade-rag-front
cd demo-ade-rag-front
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL
npm run dev
```

Open http://localhost:5173

### Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the RAG backend API |

---

## Backend API

The frontend talks to a FastAPI backend with these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | Returns indexed document info |
| `/ingest` | POST | Uploads and indexes a document (multipart/form-data, field: `file`) |
| `/query` | POST | Asks a question, returns answer + sources |
| `/health` | GET | Service health check |

### Query request body

```json
{
  "question": "What was the total revenue in 2023?",
  "top_k": 3,
  "threshold": 0.25,
  "chunk_type_filter": "table"
}
```

### Query response

```json
{
  "success": true,
  "question": "...",
  "answer": "Based on the retrieved context...",
  "sources": [
    {
      "chunk_id": "uuid",
      "chunk_type": "table",
      "page": 46,
      "similarity": 0.87,
      "text_preview": "Net sales: Products $298,085...",
      "bbox": { "x0": 0.05, "y0": 0.30, "x1": 0.95, "y1": 0.60 }
    }
  ],
  "retrieval_info": {
    "chunks_searched": 453,
    "chunks_returned": 3,
    "top_k": 3,
    "threshold": 0.25,
    "chunk_type_filter": "table"
  }
}
```

---

## Supported file types

PDF, JPEG, PNG, GIF, WebP, TIFF, BMP, DOCX, DOC, XLSX, CSV, PPTX, PPT, ODT — max 10 MB

---

## Course series

| Lesson | Repo | Stack |
|--------|------|-------|
| Lesson 3 — Document parsing | [demo-ade-parse-front](https://github.com/jorgegoco/demo-ade-parse-front) | Vanilla JS + Vite |
| Lesson 4 — Processing pipeline | [demo-ade-pipeline-front](https://github.com/jorgegoco/demo-ade-pipeline-front) | React + Vite + Tailwind |
| Lesson 5 — RAG Q&A | [demo-ade-rag-front](https://github.com/jorgegoco/demo-ade-rag-front) | React + Vite + Tailwind |
