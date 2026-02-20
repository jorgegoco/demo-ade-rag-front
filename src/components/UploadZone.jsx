// Drag-and-drop file upload zone powered by react-dropzone.
// Only accepts one file at a time (the backend replaces the indexed document on each ingest).
// Max size: 10MB (matches backend limit).

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, X } from 'lucide-react'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

// Accepted MIME types aligned with backend ALLOWED_EXTENSIONS
const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'image/tiff': ['.tif', '.tiff'],
  'image/bmp': ['.bmp'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadZone({ file, onFileChange }) {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
      if (rejectedFiles.length > 0) {
        const reason = rejectedFiles[0]?.errors?.[0]?.message || 'File rejected'
        alert(`Upload error: ${reason}`)
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_SIZE_BYTES,
  })

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud
          className={`w-10 h-10 transition-colors ${
            isDragActive ? 'text-blue-500' : 'text-slate-300'
          }`}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600">
            {isDragActive ? 'Drop the file here…' : 'Drag & drop a document here'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            or <span className="text-blue-500 underline">click to browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            PDF, Word, Excel, PowerPoint, CSV, images — max 10 MB
          </p>
        </div>
      </div>

      {/* Selected file display */}
      {file && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <FileText className="w-5 h-5 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-blue-800 truncate">{file.name}</p>
            <p className="text-xs text-blue-500">{formatBytes(file.size)}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null)
            }}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
