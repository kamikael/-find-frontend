import { useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { EMAILJS_CONFIG, isEmailJsConfigured } from '../../config/emailjs';

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GLOBAL STYLES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Cabinet+Grotesk:wght@300;400;500;600;700;800&display=swap');

  :root {
    --gold:        #C9A84C;
    --gold-light:  #E2C97E;
    --gold-dim:    rgba(201,168,76,0.12);
    --gold-border: rgba(201,168,76,0.28);
    --ink:         #080808;
    --ink-soft:    #1A1A1A;
    --white:       #FFFFFF;
    --off-white:   #F9F8F5;
    --muted:       #8A8680;
    --border:      #E8E4DC;
    --font-display: 'Cormorant Garamond', serif;
    --font-body:    'Cabinet Grotesk', sans-serif;
  }

  * { box-sizing: border-box; }

  .cp-root {
    font-family: var(--font-body);
    background: var(--off-white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-image:
      radial-gradient(ellipse 80% 50% at 0% 0%, rgba(201,168,76,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(201,168,76,0.04) 0%, transparent 55%);
  }

  /* â”€â”€ Fade-up animation â”€â”€ */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes breathe {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.6; transform: scale(0.85); }
  }
  @keyframes lineGrow {
    from { width: 0; }
    to   { width: 48px; }
  }

  .au1 { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .05s both; }
  .au2 { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .15s both; }
  .au3 { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .25s both; }
  .au4 { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .35s both; }
  .au5 { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .45s both; }

  .gold-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: breathe 2.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* â”€â”€ Badge â”€â”€ */
  .cp-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    border-radius: 999px;
    border: 1px solid var(--gold-border);
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(8px);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    font-family: var(--font-body);
  }

  /* â”€â”€ Section heading â”€â”€ */
  .cp-heading {
    font-family: var(--font-display);
    font-weight: 600;
    line-height: 1.08;
    color: var(--ink);
  }
  .cp-heading .gold-word {
    font-style: italic;
    background: linear-gradient(120deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* â”€â”€ Gold accent line â”€â”€ */
  .cp-accent-line {
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    animation: lineGrow .7s cubic-bezier(.16,1,.3,1) .6s both;
    margin-top: 10px;
  }

  /* â”€â”€ Card â”€â”€ */
  .cp-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.05);
    transition: box-shadow .3s ease;
  }
  .cp-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.07);
  }

  /* â”€â”€ Field label â”€â”€ */
  .cp-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 7px;
    font-family: var(--font-body);
  }

  /* â”€â”€ Input â”€â”€ */
  .cp-input {
    width: 100%;
    background: var(--off-white);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 14px;
    font-family: var(--font-body);
    color: var(--ink);
    transition: border-color .2s ease, background .2s ease, box-shadow .2s ease;
    outline: none;
  }
  .cp-input::placeholder { color: #B8B4AC; }
  .cp-input:hover  { border-color: #CEC9C0; }
  .cp-input:focus  {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.13);
  }
  .cp-input.valid   { border-color: var(--gold); background: #FFFDF5; }
  .cp-input.invalid { border-color: #DC2626; background: #FEF2F2; }
  .cp-input.invalid:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.10); }

  /* â”€â”€ Submit button â”€â”€ */
  .cp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 32px;
    border-radius: 14px;
    border: 1.5px solid var(--gold);
    background: linear-gradient(135deg, var(--gold) 0%, #B8952F 100%);
    color: var(--white);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform .22s ease, box-shadow .22s ease, filter .2s ease;
    box-shadow: 0 4px 16px rgba(201,168,76,0.3);
    position: relative;
    overflow: hidden;
  }
  .cp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity .2s ease;
  }
  .cp-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(201,168,76,0.40);
    filter: brightness(1.06);
  }
  .cp-btn:hover::before { opacity: 1; }
  .cp-btn:active:not(:disabled) { transform: scale(.97); }
  .cp-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* â”€â”€ Info item â”€â”€ */
  .cp-info-item .cp-info-icon {
    transition: background .2s ease, border-color .2s ease, transform .2s ease, color .2s ease;
  }
  .cp-info-item:hover .cp-info-icon {
    background: var(--gold-dim);
    border-color: var(--gold-border);
    transform: scale(1.10);
    color: var(--gold);
  }

  /* â”€â”€ Social btn â”€â”€ */
  .cp-social {
    width: 42px; height: 42px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--off-white);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted);
    text-decoration: none;
    transition: background .2s ease, border-color .2s ease, color .2s ease, transform .2s ease, box-shadow .2s ease;
  }
  .cp-social:hover {
    background: var(--gold-dim);
    border-color: var(--gold-border);
    color: var(--gold);
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(201,168,76,0.18);
  }

  /* â”€â”€ Dark availability card â”€â”€ */
  .cp-dark-card {
    border-radius: 20px;
    background: linear-gradient(145deg, #0C0C0C 0%, #1A1200 100%);
    border: 1px solid rgba(201,168,76,0.18);
    box-shadow: 0 8px 32px rgba(0,0,0,0.20);
    position: relative;
    overflow: hidden;
  }
  .cp-dark-card::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  /* â”€â”€ Divider â”€â”€ */
  .cp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 20px 0;
  }

  /* â”€â”€ Status note â”€â”€ */
  .cp-status {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-family: var(--font-body);
    line-height: 1.45;
  }

  /* â”€â”€ Decorative separator â”€â”€ */
  .cp-sep {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }
  .cp-sep-line { flex: 1; height: 1px; background: var(--border); }
  .cp-sep-diamond {
    width: 6px; height: 6px;
    border: 1.5px solid var(--gold);
    transform: rotate(45deg);
    flex-shrink: 0;
  }

  :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; border-radius: 8px; }
  textarea.cp-input { min-height: 150px; resize: vertical; }
`;

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ICONS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[18px] h-[18px]">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-4 h-4">
    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
  </svg>
);
const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
);
const AlertCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 shrink-0">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4 animate-spin">
    <circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0 1 10 10"/>
  </svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   VALIDATION
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
const INITIAL = { nom: '', email: '', sujet: '', message: '' };
const TOUCHED_INIT = { nom: false, email: false, sujet: false, message: false };
const CONTACT_FALLBACK_EMAIL = 'contact@find-stage.com';

function validate(v) {
  const e = {};
  if (!v.nom.trim())    e.nom = 'Nom requis';
  if (!v.email.trim())  e.email = 'Email requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Email invalide';
  if (!v.sujet.trim())  e.sujet = 'Sujet requis';
  if (!v.message.trim()) e.message = 'Message requis';
  return e;
}

function buildMailto(values) {
  const subject = encodeURIComponent(values.sujet || 'Demande de contact');
  const body = encodeURIComponent(
    `Nom: ${values.nom}\nEmail: ${values.email}\n\nMessage:\n${values.message}`
  );
  return `mailto:${CONTACT_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   FIELD COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
function Field({ label, name, type = 'text', placeholder, value, onChange, onBlur, touched, error, as }) {
  const cls = `cp-input${touched ? (error ? ' invalid' : ' valid') : ''}`;
  return (
    <div>
      <label className="cp-label">{label}</label>
      {as === 'textarea'
        ? <textarea className={cls} name={name} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} required />
        : <input className={cls} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} required />
      }
      {touched && error && <span className="mt-1.5 block text-[11px] text-red-500 font-medium">{error}</span>}
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN COMPONENT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function Contact() {
  const [values,    setValues]    = useState(INITIAL);
  const [touched,   setTouched]   = useState(TOUCHED_INIT);
  const [isSending, setIsSending] = useState(false);
  const [status,    setStatus]    = useState({ type: 'idle', message: '' });

  const errors  = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues(p => ({ ...p, [name]: value }));
    if (status.type !== 'idle') setStatus({ type: 'idle', message: '' });
  };
  const onBlur = (e) => setTouched(p => ({ ...p, [e.target.name]: true }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ nom: true, email: true, sujet: true, message: true });
    if (!isValid) return;
    if (!isEmailJsConfigured()) {
      window.location.href = buildMailto(values);
      setStatus({ type: 'success', message: 'Messagerie ouverte. Envoyez votre message pour finaliser.' });
      return;
    }
    setIsSending(true);
    setStatus({ type: 'idle', message: '' });
    try {
      await emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, e.currentTarget, { publicKey: EMAILJS_CONFIG.publicKey });
      setStatus({ type: 'success', message: 'Message envoyé avec succès !' });
      setValues(INITIAL);
      setTouched(TOUCHED_INIT);
    } catch {
      // Fallback local if EmailJS fails at runtime.
      window.location.href = buildMailto(values);
      setStatus({ type: 'success', message: 'Messagerie ouverte. EmailJS indisponible actuellement.' });
    } finally {
      setIsSending(false);
    }
  };

  const contactItems = [
    { icon: <PhoneIcon />,  label: 'Téléphone',  value: '+229 01 90 00 00 00', sub: 'Appel direct', href: 'tel:+22901900000' },
    { icon: <MailIcon />,   label: 'Email',       value: 'contact@find-stage.com', sub: 'Réponse sous 24h', href: 'mailto:contact@find-stage.com' },
    { icon: <MapPinIcon />, label: 'Adresse',     value: 'Cotonou, Bénin', sub: 'Afrique de l\'Ouest', href: '#' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="cp-root">
        <Navbar />

        <main className="flex-1 pt-[96px] md:pt-[112px] pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* â”€â”€ Header â”€â”€ */}
            <div className="text-center mb-14 au1">
              <h1 className="cp-heading mb-4" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>
                Parlons de{' '}
                <span className="gold-word">votre projet</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 max-w-[440px] mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Une question sur votre candidature ou votre stage ?<br className="hidden sm:block" />
                Notre équipe est à votre écoute.
              </p>
              <div className="flex justify-center mt-4">
                <div className="cp-accent-line" style={{ width: 48 }} />
              </div>
            </div>

            {/* â”€â”€ Main grid â”€â”€ */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

              {/* â”€â”€ FORM CARD â”€â”€ */}
              <div className="cp-card p-7 sm:p-9 au2">
                <form onSubmit={onSubmit} noValidate>
                  <input type="hidden" name="to_email"   value="tokponeal@gmail.com" />
                  <input type="hidden" name="from_name"  value={values.nom} />
                  <input type="hidden" name="from_email" value={values.email} />
                  <input type="hidden" name="subject"    value={values.sujet} />
                  <input type="hidden" name="message"    value={values.message} />

                  {/* Form header */}
                  <div className="mb-7">
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2 }}>
                      Envoyez-nous un message
                    </h2>
                    <div className="cp-accent-line" />
                  </div>

                  {/* Row: Nom + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Nom complet" name="nom" placeholder="Jean Dupont"
                      value={values.nom} onChange={onChange} onBlur={onBlur}
                      touched={touched.nom} error={errors.nom} />
                    <Field label="Adresse email" name="email" type="email" placeholder="jean@exemple.com"
                      value={values.email} onChange={onChange} onBlur={onBlur}
                      touched={touched.email} error={errors.email} />
                  </div>

                  {/* Sujet */}
                  <div className="mt-5">
                    <Field label="Sujet" name="sujet" placeholder="Comment pouvons-nous vous aider ?"
                      value={values.sujet} onChange={onChange} onBlur={onBlur}
                      touched={touched.sujet} error={errors.sujet} />
                  </div>

                  {/* Message */}
                  <div className="mt-5">
                    <Field label="Message" name="message" as="textarea"
                      placeholder="Décrivez votre besoin en détail..."
                      value={values.message} onChange={onChange} onBlur={onBlur}
                      touched={touched.message} error={errors.message} />
                  </div>

                  {/* Decorative divider */}
                  <div className="cp-sep">
                    <span className="cp-sep-line" />
                    <span className="cp-sep-diamond" />
                    <span className="cp-sep-line" />
                  </div>

                  {/* Submit row */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button type="submit" disabled={isSending} className="cp-btn">
                      {isSending ? (
                        <><SpinnerIcon /> Envoi en cours...</>
                      ) : (
                        <><SendIcon /> Envoyer le message</>
                      )}
                    </button>

                    {status.type === 'success' && (
                      <div className="cp-status text-emerald-700 bg-emerald-50 border border-emerald-100">
                        <CheckCircleIcon /> {status.message}
                      </div>
                    )}
                    {status.type === 'error' && (
                      <div className="cp-status text-red-700 bg-red-50 border border-red-100">
                        <AlertCircleIcon /> {status.message}
                      </div>
                    )}
                  </div>

                  {/* Security note */}
                  <p className="mt-5 flex items-center gap-2 text-[11px] text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--gold)' }}>
                      <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Vos informations sont sécurisées et ne seront jamais partagées
                  </p>
                </form>
              </div>

              {/* â”€â”€ SIDEBAR â”€â”€ */}
              <div className="flex flex-col gap-5">

                {/* Contact info card */}
                <div className="cp-card p-6 sm:p-7 au3">
                  <div className="mb-5">
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--ink)' }}>
                      Coordonnées
                    </h2>
                    <div className="cp-accent-line" />
                  </div>

                  <ul className="space-y-5">
                    {contactItems.map(({ icon, label, value, sub, href }) => (
                      <li key={label} className="cp-info-item flex items-start gap-4">
                        <span
                          className="cp-info-icon mt-0.5 w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border"
                          style={{ borderColor: 'var(--border)', background: 'var(--off-white)', color: 'var(--muted)' }}
                        >
                          {icon}
                        </span>
                        <div>
                          <p className="cp-label mb-0.5">{label}</p>
                          <a href={href} className="text-[13.5px] font-semibold text-gray-800 hover:text-gray-900 transition-colors block leading-tight">
                            {value}
                          </a>
                          <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="cp-divider" />

                  {/* Socials */}
                  <div>
                    <p className="cp-label mb-3">Réseaux sociaux</p>
                    <div className="flex gap-2.5">
                      {[
                        { label: 'Facebook',  icon: <FbIcon />,       href: '#' },
                        { label: 'LinkedIn',  icon: <LinkedInIcon />, href: '#' },
                        { label: 'X/Twitter', icon: <XIcon />,        href: '#' },
                      ].map(({ label, icon, href }) => (
                        <a key={label} href={href} aria-label={label} className="cp-social">
                          {icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Always-on card */}
                <div className="cp-dark-card p-6 au4">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="gold-dot" style={{ background: 'var(--gold)' }} />
                      <span className="cp-label" style={{ color: 'rgba(201,168,76,0.75)', marginBottom: 0 }}>
                        Disponible 24h/24 · 7j/7
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>
                      Notre plateforme est accessible à tout moment. Nous répondons en général sous{' '}
                      <span className="font-bold" style={{ color: 'var(--gold)' }}>quelques heures</span>.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}






