import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
  { color: '#6366f1', left: '42%', delay: '.1s' },
  { color: '#0a0a0a', left: '50%', delay: '.18s' },
  { color: '#a1a1aa', left: '56%', delay: '.08s' },
  { color: '#6366f1', left: '46%', delay: '.22s' },
  { color: '#0a0a0a', left: '53%', delay: '.05s' },
  { color: '#d4d4d8', left: '60%', delay: '.15s' },
  { color: '#6366f1', left: '38%', delay: '.25s' },
];



export default function Failed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'failed';
  const transactionId = searchParams.get('transaction_id') || '';

  const title = status === 'canceled' ? 'Paiement annulé' : 'Paiement échoué';
  const message = status === 'canceled'
    ? 'Vous avez annulé le paiement. Vous pouvez réessayer ou revenir à l’accueil.'
    : 'Le paiement n’a pas pu être traité. Veuillez vérifier vos informations et réessayer.';

  return (
    <>
      <style>{STYLES}</style>
      <div className="noise min-h-screen bg-zinc-50 flex flex-col relative overflow-hidden" style={{ fontFamily: 'var(--font-sans)' }}>
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16 relative z-10 w-full">
          <div className="w-full max-w-md mx-auto">
            <div className="pop-in relative z-10 bg-white border border-zinc-100 rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.08)] px-5 sm:px-10 py-10 sm:py-14 w-full max-w-md text-center">
              
              {/* Icon failed */}
              <div className="relative flex justify-center mb-6">
                <svg viewBox="0 0 64 64" className="w-20 h-20">
                  <circle cx="32" cy="32" r="30" fill="#fee2e2" />
                  <line x1="20" y1="20" x2="44" y2="44" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="44" y1="20" x2="20" y2="44" stroke="#dc2626" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>

              <h1 className="fade-up d2 text-[clamp(1.7rem,4vw,2.2rem)] font-normal text-zinc-950 leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h1>

              <p className="fade-up d3 text-zinc-500 text-[0.95rem] leading-relaxed max-w-xs mx-auto mb-10">
                {message}<br/>
                {transactionId && <span className="text-zinc-400 text-xs">Transaction ID: {transactionId}</span>}
              </p>

              <div className="flex flex-col gap-3 fade-up d4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full font-bold text-sm px-7 py-4 rounded-2xl border-2 tracking-wide bg-zinc-950 text-white border-zinc-950 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Réessayer le paiement
                </button>
                <Link
                  to="/"
                  className="w-full font-bold text-sm px-7 py-4 rounded-2xl border-2 tracking-wide bg-white text-zinc-950 border-zinc-950 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Retour à l'accueil
                </Link>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}