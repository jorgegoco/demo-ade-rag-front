// Renders a cropped visual of a single ADE chunk from its source PDF.
// Accepts a PDF URL (string) and bbox coordinates (normalized 0–1).
// Uses pdfjs-dist to render the relevant page off-screen, then blits
// only the bbox region onto the visible canvas.

import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export default function ChunkImage({ pdfSrc, page, bbox }) {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(false)

  useEffect(() => {
    if (!pdfSrc || !bbox) return
    let cancelled = false
    setLoading(true)
    setError(false)

    async function render() {
      const pdf   = await pdfjsLib.getDocument(pdfSrc).promise
      const pdfPg = await pdf.getPage(page + 1) // pdfjs is 1-indexed
      const vp    = pdfPg.getViewport({ scale: 2 })

      // Render full page to an off-screen canvas
      const offscreen     = document.createElement('canvas')
      offscreen.width     = vp.width
      offscreen.height    = vp.height
      await pdfPg.render({ canvasContext: offscreen.getContext('2d'), viewport: vp }).promise

      if (cancelled) return

      // Convert normalized bbox (0–1) to pixel coordinates
      const x = bbox.x0 * vp.width
      const y = bbox.y0 * vp.height
      const w = (bbox.x1 - bbox.x0) * vp.width
      const h = (bbox.y1 - bbox.y0) * vp.height

      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = w
      canvas.height = h
      canvas.getContext('2d').drawImage(offscreen, x, y, w, h, 0, 0, w, h)
      setLoading(false)
    }

    render().catch(() => {
      if (!cancelled) setError(true)
    })

    return () => { cancelled = true }
  }, [pdfSrc, page, bbox])

  if (error) return null

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
      {loading && (
        <div className="h-16 flex items-center justify-center text-xs text-slate-400">
          Loading chunk…
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full block"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  )
}
