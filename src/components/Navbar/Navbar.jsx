import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --gold: #d4a017;
    --gold-dark: #b8860b;
  }

  .nav-header {
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;
  }

  .nav-header.scrolled {
    background-color: rgba(0, 0, 0, 0.94);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .nav-link {
    position: relative;
    color: rgba(255, 255, 255, 0.88) !important;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #ffffff !important;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    right: 50%;
    height: 2px;
    background: var(--gold);
    border-radius: 2px;
    transition: left 0.25s ease, right 0.25s ease;
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    left: 0;
    right: 0;
  }

  .nav-link.active {
    color: var(--gold) !important;
  }

  .nav-cta {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.25s ease;
  }

  .nav-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(212, 160, 23, 0.4);
  }

  .nav-cta:hover::before { opacity: 1; }
  .nav-cta:active { transform: scale(0.97); }

  .nav-cta .arrow {
    transition: transform 0.25s ease;
  }

  .nav-cta:hover .arrow {
    transform: translateX(3px);
  }

  .menu-btn {
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .mobile-drawer {
    transform: translateX(100%);
    opacity: 0;
    transition: transform 0.3s cubic-bezier(.16,1,.3,1), opacity 0.25s ease;
  }

  .mobile-drawer.open {
    transform: translateX(0);
    opacity: 1;
  }

  .mobile-link {
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .mobile-link:hover {
    background: #f9fafb;
    transform: translateX(4px);
  }

  .mobile-link.active-mobile {
    background: #fffbeb;
    color: var(--gold-dark);
    border-color: #fde68a;
  }

  .mobile-cta {
    transition: transform 0.2s ease, box-shadow 0.25s ease;
  }

  .mobile-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(212, 160, 23, 0.3);
  }

  .mobile-cta:active { transform: scale(0.98); }

  @keyframes overlayFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .nav-overlay { animation: overlayFade 0.2s ease both; }

  .logo-wrap {
    width: 176px;
    height: 52px;
    overflow: hidden;
    display: block;
    background: transparent;
  }

  .logo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    background: transparent;
  }

  @media (min-width: 640px) {
    .logo-wrap { width: 192px; height: 58px; }
  }
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
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const isHomePage = location.pathname === '/';
  const useSolidHeader = !isHomePage || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) drawerRef.current?.querySelector('a,button')?.focus();
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const goToApply = () => { close(); navigate('/demande-stage'); };

  const isActive = (to) => {
    if (to.includes('#')) {
      const [p, h] = to.split('#');
      return location.pathname === (p || '/') && location.hash === `#${h}`;
    }
    return location.pathname === to && !location.hash;
  };

  return (
    <>
      <style>{STYLES}</style>

      <header
        className={`nav-header fixed top-0 left-0 right-0 z-50 border-b border-transparent ${useSolidHeader ? 'scrolled' : ''}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <div className="w-full max-w-7xl mx-auto h-[72px] md:h-[80px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link to="/" aria-label="Accueil" className="shrink-0">
            <span className="logo-wrap">
              <img src={logo} alt="#Find" />
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to) ? 'active' : ''} px-4 py-2 text-sm font-semibold rounded-lg`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={goToApply}
              className="nav-cta inline-flex items-center gap-2.5 bg-amber-500 text-white font-bold text-[13px] px-6 py-2.5 rounded-full tracking-wide"
            >
              Postuler
              <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              className="menu-btn w-10 h-10 rounded-xl border border-white/25 bg-white/5 flex items-center justify-center text-white"
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
        <div className="nav-overlay fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={close} aria-hidden="true" />
      )}

      <nav
        id="mobile-drawer"
        ref={drawerRef}
        className={`mobile-drawer fixed top-0 right-0 z-50 h-full w-full max-w-[300px] bg-white shadow-2xl md:hidden ${menuOpen ? 'open' : ''}`}
        aria-label="Navigation mobile"
        aria-hidden={!menuOpen}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">Menu</span>
          <button
            type="button"
            onClick={close}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
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
              className={`mobile-link ${isActive(to) ? 'active-mobile' : 'border-gray-100 text-gray-700'} px-4 py-3 rounded-xl text-sm font-semibold border flex items-center justify-between`}
            >
              {label}
              {isActive(to) && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-amber-600">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </Link>
          ))}

          <button
            type="button"
            onClick={goToApply}
            className="mobile-cta mt-3 w-full inline-flex items-center justify-center gap-2.5 bg-amber-500 text-white font-bold text-sm px-6 py-4 rounded-xl shadow-md tracking-wide"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Postuler maintenant
          </button>

          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="text-xs text-amber-800 font-medium">Promo 2026 - Inscriptions ouvertes</p>
          </div>
        </div>
      </nav>
    </>
  );
}


