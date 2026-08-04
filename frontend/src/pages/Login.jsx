import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm]       = useState({ identifier: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }  = useAuthStore();
  const navigate   = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        identifier: form.identifier,
        password:   form.password,
      });
      const { token, ...userFields } = data;
      login(token, userFields);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || t('login.errorInvalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/BackgroundLogin.png')" }}
        role="presentation"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-8 py-8">

          {/* Tabs */}
          <div className="flex mb-8" role="tablist" aria-label={t('login.tabsLabel')}>
            <div
              className="flex-1 text-center py-2 rounded-lg border border-white/40 text-white font-medium text-lg cursor-default"
              role="tab"
              aria-selected="true"
              aria-current="page"
            >
              {t('login.tab')}
            </div>
            <Link
              to="/register"
              className="flex-1 text-center py-2 text-white/50 hover:text-white transition-colors font-medium text-lg"
              role="tab"
              aria-selected="false"
            >
              {t('login.tabRegister')}
            </Link>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            aria-label={t('login.formLabel')}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-identifier" className="text-white/80 text-sm">
                {t('login.emailOrUsername')}
              </label>
              <input
                id="login-identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                value={form.identifier}
                onChange={handleChange}
                required
                aria-required="true"
                aria-describedby={error ? 'login-error' : undefined}
                className="bg-black/60 rounded-lg px-4 py-3 text-white outline-none border border-transparent focus:border-clap-gold/60 transition-colors text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-white/80 text-sm">
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-describedby={error ? 'login-error' : undefined}
                  className="w-full bg-black/60 rounded-lg px-4 py-3 pr-11 text-white outline-none border border-transparent focus:border-clap-gold/60 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <p id="login-error" role="alert" className="text-clap-red text-sm text-center">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              aria-busy={loading}
              className="mt-1 bg-clap-gold text-clap-bg font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60"
            >
              {loading ? t('login.loggingIn') : t('login.loginBtn')}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6" aria-hidden="true">
            <div className="flex-1 h-px bg-white/25" />
            <span className="text-white/50 text-xs whitespace-nowrap">{t('login.otherLogin')}</span>
            <div className="flex-1 h-px bg-white/25" />
          </div>

          {/* Social — boutons désactivés visuellement, non fonctionnels */}
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-2.5 border border-white/10"
              aria-label={t('login.googleNotAvailable')}
              disabled
            >
              <GoogleIcon />
              <span className="text-white text-sm font-medium">Google</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-2.5 border border-white/10"
              aria-label={t('login.tmdbNotAvailable')}
              disabled
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
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.148 17.64 11.84 17.64 9.2Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"/>
    </svg>
  );
}
