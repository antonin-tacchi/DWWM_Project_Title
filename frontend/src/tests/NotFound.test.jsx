import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';

// ── Mock react-i18next ─────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'notFound.label':    'Page not found',
        'notFound.title':    "This page doesn't exist.",
        'notFound.subtitle': "The film you're looking for isn't in our catalogue.",
        'notFound.backHome': 'Back to home',
        'notFound.catalogue': 'Browse catalogue',
      };
      return translations[key] ?? key;
    },
  }),
}));

// ── Mock framer-motion (avoids JSDOM animation issues) ─────────────────────

vi.mock('framer-motion', async () => {
  const React = (await import('react')).default;

  const stripFramerProps = ({ initial, animate, exit, transition, whileHover, whileTap, variants, layout, layoutId, ...rest }) => rest;

  const motion = new Proxy({}, {
    get: (_, tag) => {
      const El = ({ children, ...props }) =>
        React.createElement(tag, stripFramerProps(props), children);
      El.displayName = `motion.${tag}`;
      return El;
    },
  });

  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

// ── Tests ──────────────────────────────────────────────────────────────────

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
}

describe('NotFound page', () => {
  it('renders the 404 heading', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the translated label', () => {
    renderNotFound();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    renderNotFound();
    const link = screen.getByRole('link', { name: 'Back to home' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders a link to the catalogue', () => {
    renderNotFound();
    const link = screen.getByRole('link', { name: 'Browse catalogue' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/catalogue');
  });

  it('renders the subtitle text', () => {
    renderNotFound();
    expect(screen.getByText("The film you're looking for isn't in our catalogue.")).toBeInTheDocument();
  });
});
