import { Link, useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import Navbar from '../../components/Navbar/Navbar';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --gold:       #C9A84C;
    --gold-light: #E8C96A;
    --gold-dim:   rgba(201,168,76,0.10);
    --gold-bd:    rgba(201,168,76,0.22);
    --ink:        #0C0C0C;
    --white:      #FFFFFF;
    --off-white:  #F9F8F5;
    --border:     rgba(12,12,12,0.09);
    --muted:      #8A8680;
    --green:      #15803D;
    --green-bg:   rgba(21,128,61,0.07);
    --green-bd:   rgba(21,128,61,0.18);
    --font:       'Outfit', sans-serif;
    --serif:      'Playfair Display', serif;
    --mono:       'DM Mono', monospace;
  }

  .success-root {
    background-color: var(--off-white);
    background-image:
      radial-gradient(ellipse 80% 45% at 50% -5%, rgba(201,168,76,0.06) 0%, transparent 60%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: var(--font);
  }

  /* ── Animations ── */
  @keyframes cardIn {
    0%   { opacity:0; transform: translateY(28px) scale(0.97); }
    100% { opacity:1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform: translateY(12px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes circleDraw {
    from { stroke-dashoffset: 226; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 70; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes ringPulse {
    0%,100% { transform: scale(1); opacity: 0.5; }
    50%     { transform: scale(1.12); opacity: 0; }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
    15%     { opacity: 1; }
    100%    { transform: translateY(-90px) rotate(220deg); opacity: 0; }
  }
  @keyframes shimmerGold {
    0%   { background-position: -300px 0; }
    100% { background-position: 300px 0; }
  }
  @keyframes stepIn {
    from { opacity:0; transform: scaleX(0); transform-origin: left; }
    to   { opacity:1; transform: scaleX(1); }
  }

  .anim-card { animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
  .fade-up   { opacity:0; animation: fadeUp 0.48s cubic-bezier(0.22,1,0.36,1) forwards; }
  .d1 { animation-delay: 0.95s; }
  .d2 { animation-delay: 1.10s; }
  .d3 { animation-delay: 1.24s; }
  .d4 { animation-delay: 1.38s; }
  .d5 { animation-delay: 1.52s; }

  .circle-draw {
    stroke-dasharray: 226;
    stroke-dashoffset: 226;
    animation: circleDraw 0.75s 0.15s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .check-draw {
    stroke-dasharray: 70;
    stroke-dashoffset: 70;
    animation: checkDraw 0.42s 0.8s cubic-bezier(0.22,1,0.36,1) forwards;
  }
  .ring-pulse {
    animation: ringPulse 1.8s ease-out 0.9s infinite;
  }

  /* ── Particle ── */
  .particle {
    position: absolute;
    border-radius: 99px;
    pointer-events: none;
    animation: float 1.8s ease-out forwards;
  }

  /* ── Gold shimmer text ── */
  .gold-shimmer {
    background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 45%, var(--gold) 100%);
    background-size: 300px 100%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerGold 2.8s 1.1s ease-in-out infinite;
  }

  /* ── Divider ── */
  .gold-div {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-bd), transparent);
  }

  /* ── Primary CTA ── */
  .btn-primary {
    background: var(--ink);
    color: var(--white);
    border: 1.5px solid var(--ink);
    font-family: var(--font);
    font-weight: 700;
    font-size: 13.5px;
    letter-spacing: 0.01em;
    border-radius: 14px;
    padding: 13px 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    width: 100%;
    cursor: pointer;
    transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.08) 100%);
    opacity: 0;
    transition: opacity 0.22s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(12,12,12,0.22), 0 4px 10px rgba(12,12,12,0.12);
  }
  .btn-primary:hover::after { opacity: 1; }
  .btn-primary:active { transform: scale(0.97); }

  /* ── Back button ── */
  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    padding: 8px 14px;
    cursor: pointer;
    transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
  }
  .btn-back:hover {
    color: var(--ink);
    border-color: rgba(12,12,12,0.22);
    transform: translateX(-2px);
  }

  /* ── Info item ── */
  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
  }
  .info-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: var(--off-white);
    border: 1px solid var(--border);
  }

  /* ── Step tracker ── */
  .step-line {
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    animation: stepIn 0.6s cubic-bezier(0.22,1,0.36,1) 1.3s both;
  }

  :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 6px; }
`;

const PARTICLES = [
  { color: '#C9A84C', left: '40%', delay: '0.05s', w: 6,  h: 6,  round: true  },
  { color: '#0C0C0C', left: '53%', delay: '0.12s', w: 5,  h: 5,  round: false },
  { color: '#E8C96A', left: '46%', delay: '0.20s', w: 7,  h: 4,  round: true  },
  { color: '#0C0C0C', left: '37%', delay: '0.04s', w: 4,  h: 7,  round: false },
  { color: '#C9A84C', left: '58%', delay: '0.16s', w: 5,  h: 5,  round: true  },
  { color: '#B8860B', left: '50%', delay: '0.09s', w: 6,  h: 4,  round: false },
  { color: '#E8C96A', left: '43%', delay: '0.24s', w: 4,  h: 6,  round: true  },
  { color: '#0C0C0C', left: '56%', delay: '0.07s', w: 5,  h: 5,  round: false },
];




export default function Success() {
  const navigate = useNavigate();
  const { resetApplication } = useApplication();

  return (
    <>
      <style>{STYLES}</style>

      <div className="success-root">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6">
          <div className="w-full max-w-lg">

            {/* Back button */}
            <div className="mb-5">
              <button type="button" onClick={() => navigate(-1)} className="btn-back">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour
              </button>
            </div>

            {/* Main card */}
            <div className="anim-card relative overflow-hidden rounded-3xl bg-white"
              style={{
                border: '1.5px solid rgba(12,12,12,0.08)',
                boxShadow: '0 2px 6px rgba(12,12,12,0.04), 0 20px 52px rgba(12,12,12,0.07)',
              }}>

              {/* Gold top accent line */}
              <div style={{
                height: 3,
                background: 'linear-gradient(90deg, transparent 0%, #C9A84C 30%, #E8C96A 50%, #C9A84C 70%, transparent 100%)',
              }} />

              {/* Hero section */}
              <div className="px-8 pt-10 pb-8 text-center"
                style={{ background: 'linear-gradient(180deg, #FDFCF9 0%, #FFFFFF 100%)' }}>

                {/* Animated check */}
                <div className="relative flex justify-center mb-7">
                  {PARTICLES.map((p, i) => (
                    <span key={i} className="particle"
                      style={{
                        left: p.left,
                        bottom: '50%',
                        width: p.w,
                        height: p.h,
                        background: p.color,
                        animationDelay: p.delay,
                        borderRadius: p.round ? '99px' : '3px',
                      }} />
                  ))}

                  <div className="relative w-[88px] h-[88px]">
                    {/* Pulse ring */}
                    <div className="ring-pulse absolute inset-0 rounded-full"
                      style={{ border: '2px solid rgba(201,168,76,0.25)' }} />

                    <svg viewBox="0 0 88 88" width="88" height="88" fill="none"
                      className="relative z-10" style={{ overflow: 'visible' }}>
                      {/* BG circle */}
                      <circle cx="44" cy="44" r="40"
                        fill="rgba(201,168,76,0.07)"
                        stroke="rgba(201,168,76,0.20)"
                        strokeWidth="1" />
                      {/* Animated circle */}
                      <circle cx="44" cy="44" r="36"
                        stroke="#C9A84C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                        className="circle-draw" />
                      {/* Checkmark */}
                      <polyline
                        points="26,45 37,56 62,30"
                        stroke="#0C0C0C"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        className="check-draw" />
                    </svg>
                  </div>
                </div>

                {/* Status badge */}
                <div className="fade-up d1 flex justify-center mb-5">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                    style={{
                      background: 'rgba(201,168,76,0.09)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#B8860B',
                    }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: '#C9A84C' }} />
                    Candidature enregistrée
                  </span>
                </div>

                {/* Title */}
                <h1 className="fade-up d2"
                  style={{
                    fontFamily: 'var(--font)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.8rem, 4vw, 2.3rem)',
                    color: '#0C0C0C',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}>
                  Dossier{' '}
                  <span className="gold-shimmer">transmis</span>
                  {' '}avec succès
                </h1>

                {/* Subtitle */}
                <p className="fade-up d3"
                  style={{
                    fontFamily: 'var(--font)',
                    fontSize: 14,
                    color: '#8A8680',
                    lineHeight: 1.65,
                    maxWidth: 310,
                    margin: '0 auto',
                  }}>
                  Votre dossier a bien été transmis. Un consultant prendra contact avec vous prochainement.
                </p>

                {/* Progress steps strip */}
                <div className="fade-up d3 mt-6 flex items-center justify-center gap-1.5">
                  {['Secteur', 'Dossier', 'Confirmé'].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{
                            background: '#0C0C0C',
                            color: '#fff',
                            fontFamily: 'var(--mono)',
                          }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#8A8680', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {s}
                        </span>
                      </div>
                      {i < 2 && (
                        <div className="step-line mb-4" style={{ width: 40 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>


              {/* CTA */}
              <div className="px-8 py-7">
                <div className="fade-up d5">
                  <Link to="/" onClick={resetApplication} className="btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Retour à l'accueil
                  </Link>
                </div>
              </div>

            </div>

            {/* Footer stamp */}
            <p className="mt-6 text-center"
              style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C4C0BA' }}>
              #Find · Promo 2026
            </p>

          </div>
        </main>
      </div>
    </>
  );
}