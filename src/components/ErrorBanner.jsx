// Red notification banner displayed when an API call fails.

export default function ErrorBanner({ message }) {
  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-lg px-5 py-4 flex items-start gap-3">
      <span className="text-red-500 text-xl leading-none select-none">✕</span>
      <div>
        <p className="text-red-700 font-semibold text-sm">Something went wrong</p>
        <p className="text-red-600 text-sm mt-0.5">{message}</p>
      </div>
    </div>
  )
}
