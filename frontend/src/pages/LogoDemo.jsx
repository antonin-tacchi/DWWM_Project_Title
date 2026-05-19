import Logo3D, { ANIMATIONS } from '../components/ui/Logo3D';

const DESCRIPTIONS = {
  oscillate: 'Oscillation douce sur Y + léger tilt X',
  spin:      'Rotation continue à 360°',
  breathe:   'Scale in/out comme une respiration',
  float:     'Flottement vertical + légère rotation',
  wave:      'Vagues combinées sur les 3 axes',
  pulse:     'Pulsations rapides de scale',
  swing:     'Balancement pendulaire (Z + Y)',
  bounce:    'Rebond vertical continu',
};

export default function LogoDemo() {
  return (
    <div className="min-h-screen bg-clap-bg pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="font-display text-4xl text-clap-gold mb-3">
            Animations disponibles
          </h1>
          <p className="text-clap-gray text-sm tracking-widest uppercase">
            Choisis une animation pour le logo Clap!
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(ANIMATIONS).map((name) => (
            <div
              key={name}
              className="bg-clap-card border border-clap-muted/30 rounded-xl flex flex-col items-center py-8 px-4 gap-4 hover:border-clap-gold/50 transition-colors"
            >
              {/* Live preview */}
              <Logo3D animation={name} />

              {/* Label */}
              <div className="text-center">
                <p className="text-clap-gold font-bold tracking-widest uppercase text-sm mb-1">
                  {name}
                </p>
                <p className="text-clap-gray text-xs leading-relaxed">
                  {DESCRIPTIONS[name]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Usage hint */}
        <div className="mt-12 bg-clap-card border border-clap-muted/30 rounded-xl p-6">
          <p className="text-clap-gray text-sm mb-3 tracking-widest uppercase">
            Comment utiliser
          </p>
          <code className="text-clap-gold text-sm font-mono">
            {'<Logo3D animation="oscillate" />'}
          </code>
          <p className="text-clap-gray text-xs mt-2">
            Remplace <span className="text-clap-light">oscillate</span> par le nom de l'animation choisie.
          </p>
        </div>
      </div>
    </div>
  );
}
