// Centered spinner with an optional message shown during async operations.
// The message prop makes it clear which pipeline phase is running.

export default function LoadingSpinner({ message = 'Processing...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-slate-500 text-sm font-medium">{message}</p>
    </div>
  )
}
