import heroImage from '../../assets/images/arr.png';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --gold:              #d4a017;
    --gold-dark:         #b8860b;
    --gold-light:        #fde68a;
    --gold: #f59e0b;
    --black: #0a0a0a;
    --white: #ffffff;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-700: #374151;
    --gray-900: #111827;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  /* â”€â”€ Animations â”€â”€ */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideRight {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes pulse-gold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
    50%       { box-shadow: 0 0 0 12px rgba(212,160,23,0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .anim-1 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.1s both; }
  .anim-2 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.25s both; }
  .anim-3 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.4s both; }
  .anim-4 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.55s both; }
  .anim-5 { animation: fadeUp 0.7s cubic-bezier(.16,1,.3,1) 0.7s both; }
  .fade-in { animation: fadeIn 1s ease 0.3s both; }

  /* â”€â”€ Hero underline â”€â”€ */
  .hero-underline {
    position: relative;
    display: inline;
  }
  .hero-underline::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--gold);
    border-radius: 2px;
    transform-origin: left;
    animation: slideRight 0.8s cubic-bezier(.16,1,.3,1) 0.9s both;
  }

  /* â”€â”€ Badge pulse â”€â”€ */
  .badge-dot {
    animation: pulse-gold 2s ease infinite;
    border-radius: 50%;
  }

  /* â”€â”€ Floating card â”€â”€ */
  .float-card {
    animation: float 4s ease-in-out infinite;
  }

  /* â”€â”€ Stat card â”€â”€ */
  .stat-item { animation: countUp 0.6s ease both; }
  .stat-item:nth-child(1) { animation-delay: 0.6s; }
  .stat-item:nth-child(2) { animation-delay: 0.75s; }
  .stat-item:nth-child(3) { animation-delay: 0.9s; }

  /* â”€â”€ Step card â”€â”€ */
  .step-card {
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .step-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(212,160,23,0.06), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .step-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.10);
    border-color: var(--gold-light);
  }
  .step-card:hover::before { opacity: 1; }
  .step-card:hover .step-icon {
    background: var(--gold);
    color: white;
    border-color: var(--gold);
  }

  /* â”€â”€ Step icon â”€â”€ */
  .step-icon {
    transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }

  /* â”€â”€ Feature item â”€â”€ */
  .feature-item {
    transition: transform 0.25s ease;
  }
  .feature-item:hover {
    transform: translateX(4px);
  }

  /* â”€â”€ Primary CTA â”€â”€ */
  .btn-primary {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 40px rgba(212,160,23,0.45);
  }
  .btn-primary:hover::after { opacity: 1; }
  .btn-primary:active { transform: scale(0.97); }

  /* â”€â”€ Outline CTA â”€â”€ */
  .btn-outline {
    color: #ffffff !important;
    transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
  }
  .btn-outline:hover {
    color: #ffffff !important;
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.7);
    transform: translateY(-1px);
  }

  /* â”€â”€ Dark CTA â”€â”€ */
  .btn-dark {
    color: #ffffff !important;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.2s ease;
  }
  .btn-dark svg {
    color: #ffffff !important;
    stroke: currentColor;
  }
  .btn-dark:hover {
    color: #ffffff !important;
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(0,0,0,0.25);
    background: #111;
  }
  .btn-dark:active { transform: scale(0.97); }

  /* â”€â”€ About card â”€â”€ */
  .about-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .about-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(212,160,23,0.12);
    border-color: var(--gold-light);
  }

  /* â”€â”€ Section divider â”€â”€ */
  .section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(212,160,23,0.08);
    border: 1px solid rgba(212,160,23,0.2);
    color: var(--gold-dark);
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  /* â”€â”€ Scrollbar â”€â”€ */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }

  /* â”€â”€ CTA Banner gradient â”€â”€ */
  .cta-banner {
    background: linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #1a1200 100%);
    position: relative;
    overflow: hidden;
  }
  .cta-banner::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -10%;
    width: 60%;
    height: 200%;
    background: radial-gradient(ellipse, rgba(212,160,23,0.12) 0%, transparent 65%);
    pointer-events: none;
  }
  .cta-banner::after {
    content: '';
    position: absolute;
    bottom: -40%;
    right: -5%;
    width: 50%;
    height: 180%;
    background: radial-gradient(ellipse, rgba(212,160,23,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  /* â”€â”€ Hero overlay â”€â”€ */
  .hero-overlay {
    background: linear-gradient(160deg,
      rgba(0,0,0,0.82) 0%,
      rgba(0,0,0,0.5) 55%,
      rgba(0,0,0,0.68) 100%);
  }

  .home-hero-bg {
    background-size: cover;
    background-position: right center;
  }

  .home-hero-overlay {
    background: linear-gradient(105deg, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.80) 38%, rgba(0,0,0,0.40) 60%, rgba(0,0,0,0.05) 100%);
  }

  @media (max-width: 640px) {
    .home-hero-bg {
      background-position: 58% center;
    }

    .home-hero-overlay {
      background: linear-gradient(100deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.12) 100%);
    }
  }

  /* â”€â”€ Number accent â”€â”€ */
  .step-number {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: #d1d5db;
  }

  /* â”€â”€ Green gradient text â”€â”€ */
  .text-gold-gradient {
    background: linear-gradient(135deg, #d4a017, #b8860b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export default function Home() {
  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <Navbar />

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            HERO
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section
          className="home-hero-bg relative min-h-screen flex items-center px-4 sm:px-8 lg:px-16 pt-20"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          {/* Gradient: strong on left where text lives, transparent on right to show face */}
          <div className="home-hero-overlay absolute inset-0" />

          {/* Left-aligned content â€” max 44% width on desktop */}
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            <div style={{ maxWidth: '420px' }}>

              {/* Badge */}
              <div className="anim-1 mb-4">
                <span
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-md
                             rounded-full px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-white/80"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="badge-dot w-1.5 h-1.5 bg-amber-400 shrink-0" />
                  Promo 2026 · Inscriptions ouvertes
                </span>
              </div>

              {/* Headline â€” compact */}
              <h1
                className="anim-2 text-white font-bold leading-[1.08] mb-4 tracking-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
                }}
              >
                Trouvez votre stage<br />
                académique sur{' '}
                <span className="hero-underline text-amber-400">#Find</span>
              </h1>

              {/* Sub */}
              <p
                className="anim-3 text-white/65 leading-relaxed mb-7 font-light text-sm"
              >
                La solution moderne pour les étudiants en Licence et Master.
                Accédez aux meilleures offres et validez votre placement en quelques clics.
              </p>

              {/* CTAs */}
              <div className="anim-4 flex flex-row items-center gap-3 mb-10 flex-wrap">
                <Link
                  to="/demande-stage"
                  className="btn-primary inline-flex items-center gap-2
                             bg-amber-500 text-white font-bold text-xs
                             px-5 py-3 rounded-full shadow-lg tracking-wide shrink-0"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  Commencer ma demande
                </Link>
                <a
                  href="#about"
                  className="btn-outline inline-flex items-center gap-2
                             border border-white/30 text-white font-semibold text-xs
                             px-5 py-3 rounded-full backdrop-blur-sm tracking-wide shrink-0"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  En savoir plus
                </a>
              </div>

              {/* Stats bar */}
              <div className="anim-5 flex items-center gap-0">
                {[
                  { value: '500+', label: 'Étudiants placés' },
                  { value: '4.8★', label: 'Note moyenne' },
                  { value: '15+', label: 'Secteurs' },
                ].map(({ value, label }, i) => (
                  <div key={label} className="stat-item flex items-stretch">
                    {i > 0 && <div className="w-px bg-white/20 mx-4 self-stretch" />}
                    <div>
                      <p className="text-white font-bold leading-none mb-0.5 text-lg"
                         style={{ fontFamily: 'var(--font-display)' }}>
                        {value}
                      </p>
                      <p className="text-white/45 text-[10px] tracking-wider uppercase"
                         style={{ fontFamily: 'var(--font-display)' }}>
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Scroll indicator */}
          <div className="fade-in absolute bottom-8 left-8 sm:left-16 flex flex-col items-start gap-2">
            <span className="text-white/40 text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>
              Défiler
            </span>
            <svg className="animate-bounce text-amber-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            HOW IT WORKS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="bg-gray-50 py-20 sm:py-28 px-4 sm:px-6 border-y border-gray-100">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-16">
              <span className="section-tag mb-5">Comment ça marche</span>
              <h2
                className="font-bold text-gray-900 leading-tight mt-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                }}
              >
                Simple,{' '}
                <span className="text-gold-gradient">rapide</span>{' '}
                et sécurisé
              </h2>
              <p className="text-gray-500 max-w-md mx-auto mt-4 text-base">
                Trois étapes suffisent pour décrocher votre stage académique idéal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
              {/* Connector line (desktop) */}
              <div className="hidden md:block absolute top-[52px] left-[calc(33%+16px)] right-[calc(33%+16px)] h-px bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 z-0" />

              {[
                {
                  step: '01',
                  title: 'Explorez',
                  desc: 'Consultez les secteurs et les places disponibles en temps réel.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  ),
                  color: 'bg-amber-500',
                },
                {
                  step: '02',
                  title: 'Postulez',
                  desc: 'Remplissez le formulaire (solo ou binôme) et joignez votre CV.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  ),
                  color: 'bg-amber-600',
                },
                {
                  step: '03',
                  title: 'Validez',
                  desc: 'Sécurisez votre place via MTN, Moov ou Celtis Cash.',
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                  ),
                  color: 'bg-amber-700',
                },
              ].map(({ step, title, desc, icon, color }) => (
                <article
                  key={step}
                  className="step-card relative z-10 bg-white border border-gray-100 rounded-2xl p-8 flex flex-col gap-5 shadow-sm"
                >
                  {/* Icon */}
                  <div className={`step-icon w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                    {icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-lg font-bold text-gray-900"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {title}
                      </h3>
                      <span className="step-number">{step}</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            ABOUT
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="about" className="bg-white py-20 sm:py-28 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-14 lg:gap-20 items-center">

              {/* Left */}
              <div>
                <span className="section-tag mb-6">Pourquoi #Find</span>

                <h2
                  className="font-bold text-gray-900 leading-tight mt-5 mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                  }}
                >
                  Conçu pour{' '}
                  <span className="text-gold-gradient">simplifier</span>{' '}
                  votre parcours
                </h2>

                <p className="text-gray-500 text-base leading-relaxed max-w-lg mb-10">
                  Nous simplifions le lien entre les universités et le monde professionnel.
                  Notre plateforme garantit une gestion équitable et transparente des stages.
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-12">
                  {[
                    {
                      text: 'Mise à jour instantanée des quotas',
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M13 2 3 14h7l-1 8 10-12h-7z" />
                        </svg>
                      ),
                    },
                    {
                      text: 'Gestion des binômes (Licence)',
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ),
                    },
                    {
                      text: 'Paiement Mobile Money intégré',
                      icon: (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
                          <line x1="11" y1="18" x2="13" y2="18" />
                        </svg>
                      ),
                    },
                  ].map(({ text, icon }) => (
                    <li key={text} className="feature-item flex items-center gap-4">
                      <span
                        className="w-10 h-10 rounded-xl border border-amber-500
                                   bg-amber-500
                                   flex items-center justify-center shrink-0 text-white"
                      >
                        {icon}
                      </span>
                      <span className="text-gray-700 font-medium text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/demande-stage"
                  className="btn-dark inline-flex items-center gap-2.5
                             bg-gray-900 text-white font-bold text-sm
                             px-8 py-4 rounded-full tracking-wide w-full sm:w-auto justify-center"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Voir les secteurs disponibles
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              {/* Right: cards */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    label: 'Simple',
                    sub: 'Interface intuitive',
                    accent: 'bg-amber-50 border-amber-100',
                    iconBg: 'bg-amber-500',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
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
                    accent: 'bg-amber-50 border-amber-100',
                    iconBg: 'bg-amber-500',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Sécurisé',
                    sub: 'Données chiffrées',
                    accent: 'bg-blue-50 border-blue-100',
                    iconBg: 'bg-blue-500',
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    ),
                  },
                ].map(({ label, sub, accent, iconBg, icon }) => (
                  <div
                    key={label}
                    className={`about-card ${accent} border rounded-2xl px-6 py-5 flex items-center gap-4`}
                  >
                    <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base" style={{ fontFamily: 'var(--font-display)' }}>
                        {label}
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}

                {/* Testimonial mini card */}
                <div className="mt-2 bg-black rounded-2xl p-5 text-white">
                  <p className="text-sm text-white leading-relaxed italic mb-3">
                    "J'ai trouvé mon stage en moins d'une semaine grâce à #Find. Le processus était incroyablement fluide."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold">
                      N
                    </div>
                    <div>
                      <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Neal .T</p>
                      <p className="text-white text-[10px]">Master 1 IRT</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            CTA BANNER
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="cta-banner py-16 sm:py-20 px-4 sm:px-6">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Prêt à commencer ?
            </span>
            <h2
              className="font-bold text-white leading-tight mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              Réservez votre place<br />
              <span className="text-amber-400">dès maintenant</span>
            </h2>
            <p className="text-white/60 text-base mb-10 max-w-md mx-auto">
              Les places sont limitées. Commencez votre dossier aujourd'hui et sécurisez votre stage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/demande-stage"
                className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5
                           bg-amber-500 text-white font-bold text-sm
                           px-8 py-4 rounded-full shadow-lg tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Commencer ma demande
              </Link>
              <Link
                to="/contact"
                className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2
                           border border-white/25 text-white/80 font-semibold text-sm
                           px-8 py-4 rounded-full tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}




