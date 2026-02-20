// Color-coded pill badge for each chunk type returned by the ADE parser.
// These colors match the lesson's visual grounding color scheme.

const TYPE_STYLES = {
  text:        'bg-green-100 text-green-700',
  table:       'bg-blue-100 text-blue-700',
  figure:      'bg-pink-100 text-pink-700',
  marginalia:  'bg-yellow-100 text-yellow-700',
  logo:        'bg-orange-100 text-orange-700',
  form:        'bg-indigo-100 text-indigo-700',
  attestation: 'bg-red-100 text-red-700',
  scanCode:    'bg-gray-100 text-gray-700',
  card:        'bg-teal-100 text-teal-700',
}

const TYPE_LABELS = {
  text:        'Text',
  table:       'Table',
  figure:      'Figure',
  marginalia:  'Marginalia',
  logo:        'Logo',
  form:        'Form',
  attestation: 'Attestation',
  scanCode:    'Scan Code',
  card:        'Card',
}

export default function ChunkTypeBadge({ type }) {
  // Normalize: handles both "chunkTable" and "table" conventions from the backend
  const normalized = type
    ? type.startsWith('chunk')
      ? type.slice(5).charAt(0).toLowerCase() + type.slice(6)
      : type
    : 'unknown'

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        TYPE_STYLES[normalized] || 'bg-slate-100 text-slate-500'
      }`}
    >
      {TYPE_LABELS[normalized] || normalized}
    </span>
  )
}
