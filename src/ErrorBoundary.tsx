import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6">
          <div className="max-w-md rounded-xl border border-rose-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-800">Algo correu mal</h1>
            <p className="mt-2 text-sm text-slate-600">{this.state.error.message}</p>
            <p className="mt-4 text-xs text-slate-500">
              Abre a consola do browser (F12) para mais detalhes.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Tentar outra vez
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
