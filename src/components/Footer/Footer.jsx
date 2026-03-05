import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

  :root {
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --gold:              #d4a017;
    --gold-dark:         #b8860b;
    --gold-muted:        rgba(212, 160, 23, 0.12);
  }

  /* ── Footer base ── */
  .find-footer {
    position: relative;
    overflow: hidden;
    background: linear-gradient(155deg, #0a0a0a 0%, #1a1400 45%, #111 100%);
    border-top: 1px solid rgba(212,160,23,0.18);
    color: #fffbeb;
  }

  /* ── Ambient glows ── */
  .find-footer::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -5%;
    width: 55%;
    height: 160%;
    background: radial-gradient(ellipse, rgba(212,160,23,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .find-footer::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: 0;
    width: 45%;
    height: 140%;
    background: radial-gradient(ellipse, rgba(212,160,23,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .ff-inner { position: relative; z-index: 1; }

  .ff-logo-wrap {
    width: 176px;
    height: 52px;
    overflow: hidden;
    display: block;
    background: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
    margin-bottom: 12px;
  }
  .ff-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  @media (min-width: 640px) {
    .ff-logo-wrap {
      width: 196px;
      height: 60px;
    }
  }

  /* ── Social icons ── */
  .ff-social {
    width: 42px;
    height: 42px;
    border: 1px solid rgba(212,160,23,0.25);
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: rgba(252,211,77,0.9);
    background: rgba(212,160,23,0.06);
    transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .ff-social:hover {
    transform: translateY(-3px);
    border-color: rgba(212,160,23,0.5);
    background: rgba(212,160,23,0.14);
    box-shadow: 0 8px 20px rgba(212,160,23,0.2);
  }

  /* ── Nav links ── */
  .ff-link {
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease, transform 0.2s ease;
    display: inline-block;
  }
  .ff-link:hover {
    color: #ffffff;
    transform: translateX(4px);
  }

  /* ── Contact icon ── */
  .ff-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--gold);
    background: rgba(212,160,23,0.1);
    border: 1px solid rgba(212,160,23,0.2);
    flex-shrink: 0;
  }

  /* ── Hours box ── */
  .ff-hours {
    border: 1px solid rgba(212,160,23,0.2);
    border-radius: 14px;
    padding: 14px 16px;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
  }

  /* ── Divider ── */
  .ff-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent);
    margin: 40px 0 32px;
  }

  /* ── CTA banner ── */
  .ff-cta-box {
    border: 1px solid rgba(212,160,23,0.25);
    border-radius: 22px;
    padding: 28px 28px;
    background: linear-gradient(120deg, rgba(5,20,10,0.95) 0%, rgba(10,25,15,0.9) 60%, rgba(20,40,25,0.85) 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  /* ── CTA buttons ── */
  .ff-btn-primary {
    background: linear-gradient(135deg, #d4a017, #b8860b);
    color: white;
    border: none;
    border-radius: 14px;
    height: 52px;
    padding: 0 32px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 10px 24px rgba(212,160,23,0.3);
  }
  .ff-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(212,160,23,0.42);
  }
  .ff-btn-primary:active { transform: scale(0.97); }

  .ff-btn-secondary {
    background: transparent;
    color: rgba(252,211,77,0.9);
    border: 1.5px solid rgba(212,160,23,0.35);
    border-radius: 14px;
    height: 52px;
    padding: 0 28px;
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }
  .ff-btn-secondary:hover {
    background: rgba(212,160,23,0.1);
    border-color: rgba(212,160,23,0.6);
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    .ff-cta-box { padding: 20px 18px; border-radius: 16px; }
    .ff-btn-primary, .ff-btn-secondary { width: 100%; }
  }
`;

export default function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="find-footer" id="footer">
      <style>{STYLES}</style>

      <div className="ff-inner max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-6">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">

          {/* Brand column */}
          <div>
            <span className="ff-logo-wrap">
              <img src={logo} alt="#Find" className="ff-logo-img" />
            </span>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: '#ffffff', fontFamily: 'var(--font-body)', maxWidth: '260px' }}
            >
              Trouvez votre stage académique plus vite, suivez votre candidature et validez votre inscription avec un parcours simple et clair.
            </p>
            <div className="flex gap-2.5" aria-label="Réseaux sociaux">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="ff-social" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="ff-social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="18" cy="6" r="1"/>
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="ff-social" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l16 16M20 4L4 20"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-base font-bold uppercase tracking-[0.16em] mb-5"
              style={{ fontFamily: 'var(--font-display)', color: '#d4a017' }}
            >
              Navigation rapide
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', to: '/', internal: true },
                { label: 'Demande de stage', to: '/demande-stage', internal: true },
                { label: 'Contact', to: '/contact', internal: true },
                { label: 'À propos', to: '/#about', internal: true },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link className="ff-link" to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-base font-bold uppercase tracking-[0.16em] mb-5"
              style={{ fontFamily: 'var(--font-display)', color: '#d4a017' }}
            >
              Contactez-nous
            </h3>

            <div className="space-y-3 mb-5">
              {[
                {
                  text: 'Cotonou, Bénin',
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                },
                {
                  text: '+229 01 00 00 00 00',
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.8.63 2.65a2 2 0 0 1-.45 2.11l-1.2 1.2a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.85.3 1.75.51 2.65.63A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  ),
                },
                {
                  text: 'support@find.bj',
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-10 7L2 7"/>
                    </svg>
                  ),
                },
              ].map(({ text, icon }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="ff-icon">{icon}</div>
                  <p className="text-sm" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="ff-divider" />

        {/* ── CTA box ── */}
        <div className="ff-cta-box">
          <div>
            <p
              className="text-2xl sm:text-3xl font-bold mb-1.5"
              style={{ fontFamily: 'var(--font-display)', color: '#fffbeb' }}
            >
              Prêt à postuler ?
            </p>
            <p className="text-sm" style={{ color: '#ffffff', fontFamily: 'var(--font-body)' }}>
              Commencez votre dossier maintenant et réservez votre place.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap w-full sm:w-auto">
            <button type="button" className="ff-btn-primary" onClick={() => navigate('/demande-stage')}>
              Postuler
            </button>
            <button type="button" className="ff-btn-secondary" onClick={() => navigate('/contact')}>
              Contact
            </button>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ color: 'rgba(252,211,77,0.45)', fontFamily: 'var(--font-body)', fontSize: '12px' }}
        >
          <span>© {year}. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <span className="opacity-40">·</span>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <span className="opacity-40">·</span>
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}





