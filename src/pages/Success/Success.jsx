import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import Navbar from '../../components/Navbar/Navbar';

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

  /* ── Card pop-in ── */
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(.94) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .pop-in { animation: popIn .6s cubic-bezier(.16,1,.3,1) both; }

  /* ── Check circle draw ── */
  @keyframes circleDraw {
    from { stroke-dashoffset: 180; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }
  .circle-draw {
    stroke-dasharray: 180;
    stroke-dashoffset: 180;
    animation: circleDraw .7s .3s cubic-bezier(.16,1,.3,1) forwards;
  }
  .check-draw {
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
    animation: checkDraw .45s .85s cubic-bezier(.16,1,.3,1) forwards;
  }

  /* ── Fade up stagger ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up    { opacity: 0; animation: fadeUp .5s cubic-bezier(.16,1,.3,1) forwards; }
  .fade-up.d1 { animation-delay: 1s; }
  .fade-up.d2 { animation-delay: 1.15s; }
  .fade-up.d3 { animation-delay: 1.3s; }
  .fade-up.d4 { animation-delay: 1.48s; }

  /* ── Confetti dots ── */
  @keyframes confettiFloat {
    0%   { opacity: 0; transform: translateY(0) scale(0); }
    20%  { opacity: 1; }
    100% { opacity: 0; transform: translateY(-90px) scale(1); }
  }
  .confetti-dot {
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 99px;
    animation: confettiFloat 1.4s ease-out forwards;
  }

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
`;

/* Confetti dots config */
const CONFETTI = [
  { color: '#22c55e', left: '42%', delay: '.1s' },
  { color: '#0a0a0a', left: '50%', delay: '.18s' },
  { color: '#a1a1aa', left: '56%', delay: '.08s' },
  { color: '#22c55e', left: '46%', delay: '.22s' },
  { color: '#0a0a0a', left: '53%', delay: '.05s' },
  { color: '#d4d4d8', left: '60%', delay: '.15s' },
  { color: '#22c55e', left: '38%', delay: '.25s' },
];

/**
 * Page confirmation : message ✅ Paiement confirmé, texte de succès, bouton Retour à l'accueil.
 */
export default function Success() {
  const { resetApplication } = useApplication();

  return (
    <>
      <style>{STYLES}</style>

      <div
        className="noise min-h-screen bg-zinc-50 flex flex-col relative overflow-hidden"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <Navbar />
        

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full">
          {/* Card */}
          <div
            className="pop-in relative z-10 bg-white border border-zinc-100 rounded-3xl
                       shadow-[0_8px_60px_rgba(0,0,0,0.08)] px-5 sm:px-10 py-10 sm:py-14
                       w-full max-w-md text-center"
          >
            {/* Animated check icon */}
            <div className="relative flex justify-center mb-8">
              {/* Confetti */}
              {CONFETTI.map((c, i) => (
                <span
                  key={i}
                  className="confetti-dot"
                  style={{
                    background: c.color,
                    left: c.left,
                    top: '50%',
                    animationDelay: c.delay,
                    borderRadius: i % 2 === 0 ? '99px' : '2px',
                    transform: `rotate(${i * 40}deg)`,
                  }}
                />
              ))}

              {/* SVG circle + checkmark */}
              <div className="w-20 h-20 relative">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Background circle */}
                  <circle cx="32" cy="32" r="30" fill="#f0fdf4" />
                  {/* Animated border circle */}
                  <circle
                    className="circle-draw"
                    cx="32" cy="32" r="28"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                  {/* Animated checkmark */}
                  <polyline
                    className="check-draw"
                    points="20,33 28,41 44,24"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Status badge */}
            <div className="fade-up d1 flex justify-center mb-6">
              <span
                className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100
                           text-emerald-700 rounded-full px-4 py-1.5
                           text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                Paiement confirmé
              </span>
            </div>

          {/* Title */}
            <h1
              className="fade-up d2 text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-zinc-950
                         leading-tight mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Candidature{' '}
              <em className="italic">enregistrée</em>
            </h1>

          {/* Body text */}
            <p
              className="fade-up d3 text-zinc-500 text-[0.95rem] leading-relaxed max-w-xs mx-auto mb-10"
            >
              Votre dossier a été transmis au consultant. Vous serez contacté prochainement pour la suite du processus.
            </p>

          {/* Divider */}
            <div className="fade-up d3 h-px bg-zinc-100 mb-8" />

          {/* Info row */}
            <div
              className="fade-up d3 flex items-center justify-center flex-wrap gap-2 text-zinc-400
                         text-xs font-medium mb-10"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Un récapitulatif vous sera envoyé par SMS ou e-mail.
            </div>

          {/* CTA button */}
            <div className="fade-up d4">
              <Link
                to="/"
                onClick={resetApplication}
                className="group inline-flex items-center justify-center gap-2.5
                           w-full font-bold text-sm
                           px-7 py-4 rounded-2xl
                           active:scale-[.98] transition-all duration-200
                           border-2 tracking-wide"
                style={{
                  fontFamily: 'var(--font-ui)',
                  background: '#0a0a0a',
                  color: '#ffffff',
                  borderColor: '#0a0a0a',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#0a0a0a';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#0a0a0a';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.22)';
                }}
              >
                <svg
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
