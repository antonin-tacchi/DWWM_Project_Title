import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

/* ── Eye icons ── */
const EyeIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ── Password field with toggle ── */
function PasswordInput({ id, name, label, value, onChange, errorId, showLabel, hideLabel }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-white/80 text-sm">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          aria-required="true"
          autoComplete={name === 'password' ? 'new-password' : 'new-password'}
          aria-describedby={errorId}
          className="w-full bg-black/60 rounded-lg px-4 py-3 pr-11 text-white outline-none border border-transparent focus:border-clap-gold/60 transition-colors text-sm"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? hideLabel : showLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm]         = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [consent, setConsent]   = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || t('register.errorDefault'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto pt-24 pb-8">

      {/* Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/BackgroundRegister.png')" }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-black/40" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-8 py-8">

          {/* Tabs */}
          <div role="tablist" aria-label={t('register.tabsLabel')} className="flex mb-8">
            <Link
              to="/login"
              role="tab"
              aria-selected="false"
              className="flex-1 text-center py-2 text-white/50 hover:text-white transition-colors font-medium text-lg"
            >
              {t('register.tabLogin')}
            </Link>
            <div
              role="tab"
              aria-selected="true"
              aria-current="page"
              className="flex-1 text-center py-2 rounded-lg border border-white/40 text-white font-medium text-lg cursor-default"
            >
              {t('register.tab')}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-label={t('register.formLabel')}>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-username" className="text-white/80 text-sm">{t('register.username')}</label>
              <input
                id="register-username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="username"
                aria-describedby={error ? 'register-error' : undefined}
                className="bg-black/60 rounded-lg px-4 py-3 text-white outline-none border border-transparent focus:border-clap-gold/60 transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="register-email" className="text-white/80 text-sm">{t('register.email')}</label>
              <input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                aria-required="true"
                autoComplete="email"
                aria-describedby={error ? 'register-error' : undefined}
                className="bg-black/60 rounded-lg px-4 py-3 text-white outline-none border border-transparent focus:border-clap-gold/60 transition-colors text-sm"
              />
            </div>

            <PasswordInput
              id="register-password"
              name="password"
              label={t('register.password')}
              value={form.password}
              onChange={handleChange}
              errorId={error ? 'register-error' : undefined}
              showLabel={t('register.showPassword')}
              hideLabel={t('register.hidePassword')}
            />

            <PasswordInput
              id="register-confirm-password"
              name="confirmPassword"
              label={t('register.confirmPassword')}
              value={form.confirmPassword}
              onChange={handleChange}
              errorId={error ? 'register-error' : undefined}
              showLabel={t('register.showConfirmPassword')}
              hideLabel={t('register.hideConfirmPassword')}
            />

            {/* Consent checkbox */}
            <label htmlFor="register-consent" className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                consent
                  ? 'bg-clap-gold border-clap-gold'
                  : 'border-white/30 bg-black/40 group-hover:border-clap-gold/50'
              }`}>
                {consent && (
                  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5 3.5-4" stroke="#0a0a0f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                id="register-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                aria-required="true"
                className="sr-only"
              />
              <span className="text-white/60 text-xs leading-relaxed">
                {t('register.consentText')}{' '}
                <a href="/legal" onClick={e => e.stopPropagation()} className="text-clap-gold hover:underline">{t('register.consentLink')}</a>.
              </span>
            </label>

            {error && (
              <p id="register-error" role="alert" className="text-clap-red text-sm text-center">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading || !consent}
              aria-busy={loading}
              whileTap={{ scale: 0.97 }}
              className="mt-1 bg-clap-gold text-clap-bg font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
            >
              {loading ? t('register.registering') : t('register.registerBtn')}
            </motion.button>
          </form>

          {/* Divider */}
          <div aria-hidden="true" className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/25" />
            <span className="text-white/50 text-xs whitespace-nowrap">{t('register.otherRegister')}</span>
            <div className="flex-1 h-px bg-white/25" />
          </div>

          {/* Social — not yet implemented */}
          <div className="flex gap-3">
            <button
              disabled
              aria-label={t('register.googleNotAvailable')}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 transition-colors rounded-xl py-2.5 border border-white/10 opacity-50 cursor-not-allowed"
            >
              <GoogleIcon />
              <span className="text-white text-sm font-medium">Google</span>
            </button>
            <button
              disabled
              aria-label={t('register.tmdbNotAvailable')}
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 transition-colors rounded-xl py-2.5 border border-white/10 opacity-50 cursor-not-allowed"
            >
              <span className="text-[#01B4E4] font-bold text-sm tracking-tight">TMDB</span>
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.148 17.64 11.84 17.64 9.2Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"/>
    </svg>
  );
}
