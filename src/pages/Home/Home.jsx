import heroImage from '../../assets/images/arr.png';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

  :root {
    --font-display: 'Instrument Serif', Georgia, serif;
    --font-sans: 'Geist', system-ui, sans-serif;
    --font-ui: 'Syne', system-ui, sans-serif;
  }

  /* ── Page scroll ── */
  html { scroll-behavior: smooth; }

  /* ── Hero fade-up ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-anim      { animation: fadeUp .75s cubic-bezier(.16,1,.3,1) both; }
  .hero-anim.d1   { animation-delay: .12s; }
  .hero-anim.d2   { animation-delay: .24s; }
  .hero-anim.d3   { animation-delay: .38s; }
  .hero-anim.d4   { animation-delay: .52s; }

  /* ── Section reveal ── */
  @keyframes revealUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reveal { animation: revealUp .6s cubic-bezier(.16,1,.3,1) both; }

  /* ── Step card hover ── */
  .step-card {
    transition: box-shadow .3s ease, transform .3s ease, border-color .3s ease;
  }
  .step-card:hover {
    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    transform: translateY(-6px);
    border-color: #d4d4d8;
  }

  /* ── CTA primary ── */
  .cta-primary {
    transition: box-shadow .25s ease, transform .25s ease, background .2s ease;
  }
  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.25);
  }
  .cta-primary:active { transform: scale(.98); }

  /* ── CTA secondary ── */
  .cta-secondary {
    transition: background .2s ease, color .2s ease, transform .2s ease;
  }
  .cta-secondary:hover {
    background: rgba(255,255,255,0.15);
    transform: translateY(-1px);
  }

  /* ── Stat card ── */
  .stat-card {
    transition: box-shadow .25s ease, transform .25s ease;
  }
  .stat-card:hover {
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }

  /* ── Hero underline ── */
  .brand-mark {
    position: relative;
    display: inline-block;
  }
  .brand-mark::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: white;
    transform: scaleX(0);
    transform-origin: left;
    animation: lineGrow .7s .9s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes lineGrow {
    to { transform: scaleX(1); }
  }

  /* ── Check icon ── */
  .check-icon {
    transition: transform .2s ease;
  }
  .check-icon:hover { transform: scale(1.1); }

  /* ── Noise ── */
  .noise::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: .016;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px;
  }

  :focus-visible {
    outline: 2px solid #0a0a0a;
    outline-offset: 3px;
    border-radius: 6px;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 99px; }
`;

/* ══════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <style>{STYLES}</style>

      <div
        className="noise min-h-screen bg-white flex flex-col"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <Navbar />

        {/* ════════════════════════════════
            HERO SECTION
        ════════════════════════════════ */}
        <section
          className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'scroll',
          }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(160deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.62) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">

            {/* Badge */}
            <div className="hero-anim flex justify-center mb-7">
              <span
                className="inline-flex items-center gap-2 border border-white/25
                           bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2
                           text-[10px] sm:text-[11px] font-bold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-white/80"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                Promo 2026 · Inscriptions ouvertes
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-anim d1 text-white font-normal leading-[1.06] mb-6
                         text-[clamp(2.8rem,6.5vw,5.2rem)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Trouvez votre stage académique sur{' '}
              <span className="brand-mark italic">#Find</span>
            </h1>

            {/* Sub */}
            <p
              className="hero-anim d2 text-white/75 text-[1rem] sm:text-[1.1rem] leading-relaxed
                         max-w-xl mx-auto mb-10 font-light"
            >
              La solution moderne pour les étudiants en Licence et Master.
              Accédez aux meilleures offres et validez votre placement en quelques clics.
            </p>

            {/* CTAs */}
            <div className="hero-anim d3 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to="/demande-stage"
                className="cta-primary inline-flex items-center gap-2.5
                           bg-white text-zinc-950 font-bold text-sm
                           w-full sm:w-auto px-6 sm:px-7 py-4 rounded-full shadow-lg
                           tracking-wide"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Commencer ma demande
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              <a
                href="#about"
                className="cta-secondary inline-flex items-center gap-2
                           border border-white/30 text-white font-semibold text-sm
                           w-full sm:w-auto px-6 sm:px-7 py-4 rounded-full backdrop-blur-sm
                           tracking-wide"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                En savoir plus
              </a>
            </div>

            {/* Scroll indicator */}
            <div className="hero-anim d4 flex justify-center mt-16">
              <div className="flex flex-col items-center gap-2 text-white/40">
                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: 'var(--font-ui)' }}>
                  Défiler
                </span>
                <svg
                  className="animate-bounce"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            STEPS SECTION
        ════════════════════════════════ */}
        <section className="bg-zinc-50 border-y border-zinc-100 py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-14">
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-[0.22em]
                           text-zinc-400 mb-4"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Comment ça marche
              </span>
              <h2
                className="text-[clamp(1.8rem,4vw,2.8rem)] font-normal text-zinc-950 leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Simple,{' '}
                <em className="italic">rapide</em> et sécurisé
              </h2>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Explorez',
                  desc: 'Consultez les secteurs et les places disponibles en temps réel.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  ),
                },
                {
                  step: '02',
                  title: 'Postulez',
                  desc: 'Remplissez le formulaire (solo ou binôme) et joignez votre CV.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  ),
                },
                {
                  step: '03',
                  title: 'Validez',
                  desc: 'Sécurisez votre place via MTN, Moov ou Celtis Cash.',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                  ),
                },
              ].map(({ step, title, desc, icon }) => (
                <article
                  key={step}
                  className="step-card bg-white border border-zinc-100 rounded-2xl
                             p-8 flex flex-col gap-6 shadow-sm"
                >
                  {/* Top row: step number + icon */}
                  <div className="flex items-start justify-between">
                    <span
                      className="text-[11px] font-bold text-zinc-300 tracking-widest"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {step}
                    </span>
                    <div
                      className="w-11 h-11 bg-zinc-50 border border-zinc-100 rounded-xl
                                 flex items-center justify-center text-zinc-700"
                    >
                      {icon}
                    </div>
                  </div>

                  {/* Text */}
                  <div>
                    <h3
                      className="text-lg font-semibold text-zinc-950 mb-2"
                      style={{ fontFamily: 'var(--font-ui)' }}
                    >
                      {title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            ABOUT SECTION
        ════════════════════════════════ */}
        <section id="about" className="bg-white py-16 sm:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-16 lg:gap-24 items-center">

              {/* Left: text */}
              <div>
                {/* Eyebrow */}
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-[0.22em]
                             text-zinc-400 mb-5"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Pourquoi #Find
                </span>

                <h2
                  className="text-[clamp(2rem,4.5vw,3rem)] font-normal text-zinc-950
                             leading-tight mb-6"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Conçu pour{' '}
                  <em className="italic">simplifier</em>{' '}
                  votre parcours
                </h2>

                <p className="text-zinc-500 text-[1.02rem] leading-relaxed max-w-lg mb-10">
                  Nous simplifions le lien entre les universités et le monde professionnel.
                  Notre plateforme garantit une gestion équitable et transparente des stages.
                </p>

                {/* Feature list */}
                <ul className="space-y-4">
                  {[
                    'Mise à jour instantanée des quotas',
                    'Gestion des binômes (Licence)',
                    'Paiement Mobile Money intégré',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <span
                        className="check-icon w-7 h-7 bg-zinc-950 rounded-full
                                   flex items-center justify-center shrink-0"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                      <span
                        className="text-zinc-700 font-medium text-sm"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-12">
                  <Link
                    to="/demande-stage"
                    className="inline-flex items-center gap-2.5
                               font-bold text-sm px-7 py-4 rounded-full
                               w-full sm:w-auto justify-center
                               active:scale-[.98] transition-all duration-200
                               tracking-wide border-2"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      background: '#0a0a0a',
                      color: '#ffffff',
                      borderColor: '#0a0a0a',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.color = '#0a0a0a';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.14)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#0a0a0a';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.18)';
                    }}
                  >
                    Voir les secteurs disponibles
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right: stat cards */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    label: 'Simple',
                    sub: 'Interface intuitive',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                        <line x1="9" y1="9" x2="9.01" y2="9"/>
                        <line x1="15" y1="9" x2="15.01" y2="9"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Rapide',
                    sub: 'Candidature en 2 min',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Sécurisé',
                    sub: 'Données chiffrées',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    ),
                  },
                ].map(({ label, sub, icon }) => (
                  <div
                    key={label}
                    className="stat-card bg-zinc-50 border border-zinc-100 rounded-2xl
                               px-5 sm:px-7 py-5 sm:py-6 flex items-center gap-4 sm:gap-5"
                  >
                    <div
                      className="w-12 h-12 bg-white border border-zinc-200 rounded-xl
                                 flex items-center justify-center text-zinc-700 shrink-0 shadow-sm"
                    >
                      {icon}
                    </div>
                    <div>
                      <p
                        className="text-[1.05rem] font-bold text-zinc-950 leading-none mb-1"
                        style={{ fontFamily: 'var(--font-ui)' }}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-zinc-400 font-medium">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            CTA BANNER
        ════════════════════════════════ */}
        

        <Footer />
      </div>
    </>
  );
}
