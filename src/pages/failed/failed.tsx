import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

/* ══════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

  :root {
    --gold:      #D4A017;
    --gold-dark: #B8860B;
    --ink:       #0A0A0A;
    --ivory:     #FDFCF8;
    --border:    #E5E1D8;
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
  }

  /* ── Page background ── */
  .fail-page {
    background-color: var(--ivory);
    background-image:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 10% 100%, rgba(212,160,23,0.04) 0%, transparent 50%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Animations ── */
  @keyframes popIn {
    0%   { opacity:0; transform: scale(.92) translateY(24px); }
    100% { opacity:1; transform: scale(1) translateY(0); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(14px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes crossDraw {
    from { stroke-dashoffset: 50; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes circleDraw {
    from { stroke-dashoffset: 200; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-4px); }
    40%     { transform: translateX(4px); }
    60%     { transform: translateX(-3px); }
    80%     { transform: translateX(3px); }
  }
  @keyframes float-particle {
    0%   { opacity:0; transform: translateY(0) scale(0) rotate(0deg); }
    15%  { opacity:1; }
    100% { opacity:0; transform: translateY(-80px) scale(1.2) rotate(180deg); }
  }

  .pop-in {
    animation: popIn .65s cubic-bezier(.16,1,.3,1) .05s both;
  }
  .fade-up    { opacity:0; animation: fadeUp .5s cubic-bezier(.16,1,.3,1) forwards; }
  .fade-up.d1 { animation-delay: .5s; }
  .fade-up.d2 { animation-delay: .65s; }
  .fade-up.d3 { animation-delay: .80s; }
  .fade-up.d4 { animation-delay: .95s; }

  .circle-anim {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    animation: circleDraw .7s .15s cubic-bezier(.16,1,.3,1) forwards;
  }
  .cross-anim {
    stroke-dasharray: 50;
    stroke-dashoffset: 50;
    animation: crossDraw .4s .65s cubic-bezier(.16,1,.3,1) forwards;
  }
  .icon-shake {
    animation: shake .5s .85s cubic-bezier(.36,.07,.19,.97) both;
  }

  /* Floating error particles */
  .particle {
    position: absolute;
    border-radius: 99px;
    pointer-events: none;
    animation: float-particle 1.6s ease-out forwards;
  }

  /* ── Buttons ── */
  .btn-primary {
    background: var(--ink);
    color: #fff;
    border: 1.5px solid var(--ink);
    font-family: var(--font-display);
    transition: transform .22s ease, box-shadow .22s ease, background .2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(0,0,0,0.20);
    background: #111;
  }
  .btn-primary:active { transform: scale(.97); }

  .btn-outline {
    background: transparent;
    color: var(--ink);
    border: 1.5px solid var(--border);
    font-family: var(--font-display);
    transition: border-color .22s ease, background .2s ease, transform .22s ease, box-shadow .2s ease;
  }
  .btn-outline:hover {
    border-color: var(--ink);
    background: rgba(0,0,0,0.03);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }
  .btn-outline:active { transform: scale(.97); }

  /* ── Info tag ── */
  .info-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 999px;
    font-family: var(--font-display);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  /* ── Divider ── */
  .gold-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,160,23,0.30), transparent);
  }

  :focus-visible { outline: 2px solid var(--gold); outline-offset:3px; border-radius:6px; }
`;

/* ── Particle config ── */
const PARTICLES = [
  { color: '#DC2626', left: '44%', delay: '.05s', w: 6, h: 6 },
  { color: '#FCA5A5', left: '52%', delay: '.12s', w: 5, h: 5 },
  { color: '#D4A017', left: '48%', delay: '.20s', w: 4, h: 4 },
  { color: '#DC2626', left: '38%', delay: '.08s', w: 7, h: 4 },
  { color: '#F87171', left: '57%', delay: '.18s', w: 5, h: 5 },
  { color: '#B8860B', left: '41%', delay: '.25s', w: 4, h: 6 },
  { color: '#DC2626', left: '55%', delay: '.10s', w: 6, h: 4 },
];

/* ══════════════════════════════════════════════
   FAILED PAGE
══════════════════════════════════════════════ */
export default function Failed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status        = searchParams.get('status') || 'failed';
  const transactionId = searchParams.get('transaction_id') || '';

  const isCanceled = status === 'canceled';
  const title   = isCanceled ? 'Paiement annulé' : 'Paiement échoué';
  const message = isCanceled
    ? 'Vous avez annulé le paiement. Vous pouvez réessayer à tout moment.'
    : 'Le paiement n\'a pas pu être traité. Vérifiez vos informations et réessayez.';

  return (
    <>
      <style>{STYLES}</style>

      <div className="fail-page" style={{ fontFamily: 'var(--font-body)' }}>
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 relative z-10">
          <div className="w-full max-w-sm mx-auto">

            <div className="pop-in relative bg-white rounded-3xl border px-6 sm:px-10 py-10 sm:py-12 text-center"
              style={{
                borderColor: 'var(--border)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04)',
              }}>

              {/* ── Animated cross icon ── */}
              <div className="relative flex justify-center mb-7">
                {/* Particles */}
                {PARTICLES.map((p, i) => (
                  <span key={i} className="particle"
                    style={{
                      left: p.left, bottom: '50%',
                      width: p.w, height: p.h,
                      background: p.color,
                      animationDelay: p.delay,
                    }}
                  />
                ))}

                {/* Icon circle */}
                <div className="icon-shake relative w-20 h-20">
                  {/* Soft glow ring */}
                  <div className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)' }} />

                  <svg viewBox="0 0 80 80" className="w-20 h-20 relative z-10" fill="none">
                    {/* Outer ring */}
                    <circle
                      cx="40" cy="40" r="36"
                      fill="rgba(254,226,226,0.6)"
                      stroke="#FECACA"
                      strokeWidth="1.5"
                    />
                    {/* Animated border */}
                    <circle
                      cx="40" cy="40" r="36"
                      stroke="#DC2626"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="circle-anim"
                      fill="none"
                    />
                    {/* Cross lines */}
                    <line x1="27" y1="27" x2="53" y2="53" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" className="cross-anim" />
                    <line x1="53" y1="27" x2="27" y2="53" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" className="cross-anim" />
                  </svg>
                </div>
              </div>

              {/* ── Status tag ── */}
              <div className="fade-up d1 flex justify-center mb-4">
                <span className="info-tag"
                  style={{
                    background: 'rgba(220,38,38,0.07)',
                    color: '#DC2626',
                    border: '1px solid rgba(220,38,38,0.18)',
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {isCanceled ? 'Annulé' : 'Échoué'}
                </span>
              </div>

              {/* ── Title ── */}
              <h1 className="fade-up d2 font-black tracking-tight leading-tight mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                  color: 'var(--ink)',
                }}>
                {title}
              </h1>

              {/* ── Message ── */}
              <p className="fade-up d3 text-gray-500 text-sm leading-relaxed max-w-[260px] mx-auto mb-2">
                {message}
              </p>

              {/* Transaction ID */}
              {transactionId && (
                <p className="fade-up d3 text-gray-400 text-[11px] mb-6 font-mono">
                  ID : {transactionId}
                </p>
              )}

              {/* ── Gold divider ── */}
              <div className="fade-up d3 gold-divider my-7 mx-4" />

              {/* ── Help note ── */}
              <p className="fade-up d3 text-[12px] text-gray-400 mb-7 leading-relaxed">
                Si le problème persiste, contactez notre support à{' '}
                <a href="mailto:support@find.bj"
                  className="font-semibold transition-colors hover:opacity-80"
                  style={{ color: 'var(--gold-dark)' }}>
                  support@find.bj
                </a>
              </p>

              {/* ── Actions ── */}
              <div className="fade-up d4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-primary w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold tracking-wide"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-4.5"/>
                  </svg>
                  Réessayer le paiement
                </button>

                <Link
                  to="/"
                  className="btn-outline w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold tracking-wide"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Retour à l'accueil
                </Link>
              </div>

            </div>

            {/* Bottom label */}
            <p className="fade-up d4 text-center text-[11px] text-gray-400 mt-5"
              style={{ fontFamily: 'var(--font-display)' }}>
              #Find · Promo 2026
            </p>

          </div>
        </main>
      </div>
    </>
  );
}