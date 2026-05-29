import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * ErrorBoundary — capture les erreurs React inattendues et affiche
 * une page de repli au lieu de planter silencieusement l'app.
 *
 * Accepte une prop `resetKey` (typiquement pathname) : dès que sa valeur
 * change, l'état d'erreur est automatiquement réinitialisé, ce qui permet
 * de continuer la navigation normalement après un crash sur une page.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, prevResetKey: props.resetKey };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Réinitialise l'état d'erreur si la clé de reset a changé
   * (= l'utilisateur a navigué vers une autre route).
   */
  static getDerivedStateFromProps(props, state) {
    if (state.hasError && props.resetKey !== state.prevResetKey) {
      return { hasError: false, error: null, prevResetKey: props.resetKey };
    }
    return { prevResetKey: props.resetKey };
  }

  componentDidCatch(error, info) {
    // En production : envoyer à un service de monitoring (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-clap-bg px-6 text-center"
        style={{ fontFamily: 'system-ui' }}
      >
        {/* Film strip decoration */}
        <div className="flex gap-1 mb-8 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-6 h-10 bg-white/30 rounded-sm" />
          ))}
        </div>

        <p className="text-clap-gold/50 text-xs uppercase tracking-[0.4em] mb-3">
          Erreur inattendue
        </p>
        <h1 className="font-display text-6xl text-clap-light italic mb-4">Oups.</h1>
        <p className="text-white/40 text-sm max-w-sm mb-8">
          Quelque chose s'est cassé. Le film s'est arrêté avant la fin.
        </p>

        {import.meta.env.DEV && this.state.error && (
          <pre className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-red-400 text-xs text-left max-w-lg w-full overflow-auto mb-8">
            {this.state.error.message}
          </pre>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-5 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
          >
            Réessayer
          </button>
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-clap-gold/10 border border-clap-gold/30 text-clap-gold hover:bg-clap-gold/20 text-sm transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
