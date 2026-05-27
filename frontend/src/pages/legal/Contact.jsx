import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const GOLD  = '#C9A96E';
const CREAM = '#E8DCBF';

/* ─── Film strip ─────────────────────────────────────────────── */
function FilmStrip() {
  return (
    <div className="w-full h-8 flex items-center overflow-hidden" style={{ background: '#0a0a0f' }}>
      <div className="flex gap-1 w-full px-2">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-sm"
            style={{ width: 14, height: 20, background: i % 4 === 0 ? `${GOLD}30` : '#1a1a2a' }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Input field ─────────────────────────────────────────────── */
function Field({ label, id, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs uppercase tracking-widest font-semibold" style={{ color: `${GOLD}90` }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = `w-full rounded-xl px-4 py-3 text-sm text-white/80 outline-none transition-all duration-200`;
const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,169,110,0.15)',
};
const inputFocusStyle = {
  background: 'rgba(201,169,110,0.05)',
  border: `1px solid ${GOLD}60`,
  boxShadow: `0 0 0 3px ${GOLD}12`,
};

function StyledInput({ id, type = 'text', value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputCls}
      style={focused ? inputFocusStyle : inputStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function StyledSelect({ id, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className={inputCls}
      style={{ ...(focused ? inputFocusStyle : inputStyle), appearance: 'none', cursor: 'pointer' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <option value="" style={{ background: '#0e0e1c' }}>Sélectionner un sujet…</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background: '#0e0e1c' }}>{o.label}</option>
      ))}
    </select>
  );
}

function StyledTextarea({ id, value, onChange, placeholder, required, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`${inputCls} resize-none`}
      style={focused ? inputFocusStyle : inputStyle}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

/* ─── Contact card ────────────────────────────────────────────── */
function ContactCard({ icon, label, value, href }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,169,110,0.12)' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,169,110,0.07)'; e.currentTarget.style.borderColor = `${GOLD}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.12)'; }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${GOLD}15` }}
      >
        <span style={{ color: GOLD }}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: `${GOLD}60` }}>{label}</p>
        <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">{value}</p>
      </div>
    </a>
  );
}

/* ─── FAQ item ────────────────────────────────────────────────── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden border transition-all"
      style={{ borderColor: open ? `${GOLD}30` : 'rgba(255,255,255,0.07)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? `${GOLD}08` : 'rgba(255,255,255,0.02)' }}
      >
        <span className="text-white/75 text-sm font-medium pr-4">{question}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={GOLD} strokeWidth="2" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 py-4 text-sm text-white/50 leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SUBJECTS = [
  { value: 'bug', label: '🐛 Signaler un bug' },
  { value: 'question', label: '❓ Question générale' },
  { value: 'suggestion', label: '💡 Suggestion d\'amélioration' },
  { value: 'rgpd', label: '🔒 Demande RGPD (accès / suppression)' },
  { value: 'partenariat', label: '🤝 Partenariat' },
  { value: 'autre', label: '📬 Autre' },
];

const FAQ = [
  {
    question: 'Comment supprimer mon compte ?',
    answer: "Rendez-vous dans votre profil → Paramètres → Supprimer le compte. La suppression est définitive et entraîne la suppression de toutes vos données dans un délai de 30 jours.",
  },
  {
    question: 'Les données des films sont-elles à jour ?',
    answer: "Les données cinématographiques proviennent de l'API TMDB (The Movie Database), mise à jour en temps réel. Clap! ne stocke pas ces données localement.",
  },
  {
    question: 'Mon mot de passe est-il sécurisé ?',
    answer: "Oui. Votre mot de passe est haché avec bcrypt avant d'être stocké. Même l'équipe de développement ne peut pas le lire. En cas d'oubli, contactez-nous.",
  },
  {
    question: 'Puis-je changer mon adresse e-mail ?',
    answer: "Oui, depuis votre page de profil → Modifier les informations. La modification est prise en compte immédiatement.",
  },
  {
    question: 'Comment signaler un contenu inapproprié ?',
    answer: "Utilisez le formulaire de contact ci-dessus avec le sujet \"Signaler un bug\" et décrivez le contenu problématique. Nous traiterons votre signalement sous 48h.",
  },
];

/* ─── Success screen ──────────────────────────────────────────── */
function SuccessScreen({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Animated checkmark */}
      <div className="relative w-20 h-20 mb-8">
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: GOLD }}
        />
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: `${GOLD}18`, border: `2px solid ${GOLD}50` }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h3 className="font-display text-4xl italic mb-3" style={{ color: CREAM }}>Message envoyé !</h3>
      <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">
        Merci pour votre message. Nous reviendrons vers vous dans les meilleurs délais (généralement sous 48h).
      </p>
      <button
        onClick={onReset}
        className="text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all"
        style={{ border: `1px solid ${GOLD}40`, color: GOLD }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${GOLD}15`; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        Envoyer un autre message
      </button>
    </motion.div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */
export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    /* Simulate network delay — no real backend for contact form */
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>

      <FilmStrip />

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden pt-16 pb-20 px-6"
        style={{
          background: 'linear-gradient(180deg, #0e0e1c 0%, #080810 100%)',
          borderBottom: `1px solid ${GOLD}18`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(to right, ${GOLD} 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
              style={{ color: `${GOLD}60` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}60`)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Retour à l'accueil
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: GOLD }}>
              Clap! · Contact
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl italic leading-tight mb-4"
            style={{ color: CREAM }}
          >
            Nous contacter
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm tracking-wider max-w-xl"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Une question, un bug, une suggestion ? Nous lisons chaque message avec attention.
          </motion.p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 xl:gap-16">

          {/* ── Left: Form ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <SuccessScreen key="success" onReset={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} />
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Field label="Nom complet" id="name">
                        <StyledInput
                          id="name" value={form.name}
                          onChange={handleChange('name')}
                          placeholder="Antonin Tacchi" required
                        />
                      </Field>
                      <Field label="Adresse e-mail" id="email">
                        <StyledInput
                          id="email" type="email" value={form.email}
                          onChange={handleChange('email')}
                          placeholder="votre@email.com" required
                        />
                      </Field>
                    </div>

                    <Field label="Sujet" id="subject">
                      <div className="relative">
                        <StyledSelect
                          id="subject" value={form.subject}
                          onChange={handleChange('subject')}
                          options={SUBJECTS} required
                        />
                        <svg
                          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                          width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke={GOLD} strokeWidth="2" strokeLinecap="round"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </Field>

                    <Field label="Message" id="message">
                      <StyledTextarea
                        id="message" value={form.message}
                        onChange={handleChange('message')}
                        placeholder="Décrivez votre demande avec le plus de détails possible…"
                        rows={6} required
                      />
                    </Field>

                    {error && (
                      <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center gap-3"
                      style={{ background: GOLD, color: '#080810' }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          Envoyer le message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right: Info + FAQ ── */}
          <div className="space-y-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: `${GOLD}60` }}>
                Coordonnées
              </p>
              <ContactCard
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                label="Email"
                value="antonin.tacchi2005@gmail.com"
                href="mailto:antonin.tacchi2005@gmail.com"
              />
              <ContactCard
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>}
                label="GitHub"
                value="github.com/Antonin"
                href="https://github.com"
              />
              <ContactCard
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>}
                label="Formation"
                value="DWWM · Projet Titre Professionnel"
                href="#"
              />
            </motion.div>

            {/* Response time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl p-4"
              style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 animate-pulse" style={{ background: '#4ade80' }} />
                <div>
                  <p className="text-white/80 text-sm font-semibold">Délai de réponse</p>
                  <p className="text-white/45 text-xs mt-0.5 leading-relaxed">Nous répondons généralement sous <span style={{ color: GOLD }}>24 à 48 heures</span> en jours ouvrés.</p>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: `${GOLD}60` }}>
                Questions fréquentes
              </p>
              <div className="space-y-2">
                {FAQ.map((item) => (
                  <FaqItem key={item.question} {...item} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-20 pt-8 border-t flex flex-wrap gap-6 justify-center" style={{ borderColor: `${GOLD}18` }}>
          {[
            { to: '/legal', label: 'Mentions légales' },
            { to: '/terms', label: 'Conditions d\'utilisation' },
            { to: '/privacy', label: 'Politique de confidentialité' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-xs uppercase tracking-widest transition-colors"
              style={{ color: `${GOLD}45` }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = `${GOLD}45`)}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <FilmStrip />
    </div>
  );
}
