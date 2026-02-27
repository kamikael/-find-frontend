import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Geist:wght@300;400;500;600&display=swap');

  :root {
    --font-sans: 'Geist', system-ui, sans-serif;
    --font-ui: 'Syne', system-ui, sans-serif;
  }

  .nav-header {
    transition: box-shadow .25s ease, background .25s ease;
  }
  .nav-header.scrolled {
    box-shadow: 0 8px 30px rgba(0,0,0,.08);
    background: rgba(255,255,255,.98);
  }

  .mobile-drawer {
    transform: translateX(100%);
    opacity: 0;
    transition: transform .28s cubic-bezier(.16,1,.3,1), opacity .22s ease;
  }
  .mobile-drawer.open {
    transform: translateX(0);
    opacity: 1;
  }

  @keyframes overlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .nav-overlay { animation: overlayIn .2s ease both; }
`;

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'A propos', to: '/#about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) drawerRef.current?.querySelector('a,button')?.focus();
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  const isActive = (to) => {
    if (to.includes('#')) {
      const [pathPart, hashPart] = to.split('#');
      const path = pathPart || '/';
      return location.pathname === path && location.hash === `#${hashPart}`;
    }
    return location.pathname === to && !location.hash;
  };

  return (
    <>
      <style>{STYLES}</style>

      <header
        className={`nav-header sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-xl ${scrolled ? 'scrolled' : ''}`}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="w-full max-w-7xl mx-auto h-[72px] md:h-[82px] px-3 sm:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <Link to="/" className="shrink-0" aria-label="Accueil">
            <img src={logo} alt="#Find" className="w-[78px] h-[46px] sm:w-[86px] sm:h-[50px] object-contain scale-105" />
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${isActive(to) ? 'bg-zinc-100 text-zinc-900 border-zinc-300' : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-950 hover:border-zinc-400'}`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center justify-end">
            <Link
              to="/demande-stage"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-zinc-950 bg-zinc-950 text-white text-[12px] font-bold tracking-wide"
              style={{ fontFamily: 'var(--font-ui)', color: '#ffffff' }}
            >
              Postuler
            </Link>
          </div>

          <div className="md:hidden flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="17" x2="21" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="nav-overlay fixed inset-0 z-40 bg-black/30 md:hidden" onClick={close} aria-hidden="true" />
      )}

      <nav
        id="mobile-drawer"
        ref={drawerRef}
        className={`mobile-drawer fixed top-0 right-0 z-50 h-full w-full max-w-[320px] bg-white border-l border-zinc-100 shadow-[-8px_0_36px_rgba(0,0,0,.14)] md:hidden ${menuOpen ? 'open' : ''}`}
        aria-label="Navigation mobile"
        aria-hidden={!menuOpen}
      >
        <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400" style={{ fontFamily: 'var(--font-ui)' }}>
            Menu
          </span>
          <button type="button" onClick={close} className="w-8 h-8 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center" aria-label="Fermer le menu">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-5 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className={`px-4 py-3 rounded-xl text-sm font-semibold border ${isActive(to) ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-700 border-zinc-200'}`}
              style={{ fontFamily: 'var(--font-ui)', color: isActive(to) ? '#ffffff' : undefined }}
            >
              {label}
            </Link>
          ))}

          <Link
            to="/demande-stage"
            onClick={close}
            className="mt-2 w-full py-3.5 rounded-xl border-2 border-zinc-950 bg-zinc-950 text-white text-sm font-bold text-center"
            style={{ fontFamily: 'var(--font-ui)', letterSpacing: '0.08em', color: '#ffffff' }}
          >
            Postuler
          </Link>
        </div>
      </nav>
    </>
  );
}
