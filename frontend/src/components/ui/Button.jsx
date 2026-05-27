import { motion } from 'framer-motion';

export default function Button({ children, variant = 'gold', className = '', onClick, type = 'button', disabled = false }) {
  const base = 'px-6 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    gold:    'bg-clap-gold text-clap-bg hover:brightness-110',
    outline: 'border border-clap-gold text-clap-gold hover:bg-clap-gold hover:text-clap-bg',
    ghost:   'text-clap-light hover:text-clap-gold',
    danger:  'bg-clap-red text-white hover:brightness-110',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}