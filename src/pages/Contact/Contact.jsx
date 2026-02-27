import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Fraunces:wght@600;700&display=swap');

  :root {
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-display: 'Fraunces', Georgia, serif;
  }

  * { box-sizing: border-box; }

  .contact-page {
    background-color: #fafafa;
    background-image: radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0);
    background-size: 28px 28px;
  }

  .field-input {
    transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
    font-family: var(--font-body);
  }
  .field-input:focus {
    outline: none;
    border-color: #111827;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
  .field-input.valid {
    border-color: #16a34a;
    background-color: #f0fdf4;
  }
  .field-input.invalid {
    border-color: #dc2626;
    background-color: #fef2f2;
  }
  .field-input.valid:focus {
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
  }
  .field-input.invalid:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
  }

  .send-btn {
    background: #111827;
    color: white;
    transition: background .2s ease, transform .15s ease, box-shadow .2s ease;
  }
  .send-btn:hover {
    background: #000000;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.22);
    transform: translateY(-1px);
  }
  .send-btn:active {
    transform: translateY(0);
  }

  .info-icon {
    transition: background .2s, transform .2s;
  }
  .info-item:hover .info-icon {
    background: #111827;
    color: #ffffff;
    transform: scale(1.1);
  }

  .social-btn {
    transition: background .2s, border-color .2s, color .2s, transform .15s;
  }
  .social-btn:hover {
    background: #111827;
    border-color: #111827;
    color: #ffffff;
    transform: translateY(-2px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeup { animation: fadeUp .5s ease both; }
  .delay-1 { animation-delay: .08s; }
  .delay-2 { animation-delay: .16s; }
  .delay-3 { animation-delay: .24s; }
  .delay-4 { animation-delay: .32s; }
`;

const INITIAL = { nom: '', email: '', sujet: '', message: '' };
const TOUCHED_INIT = { nom: false, email: false, sujet: false, message: false };

function validate(values) {
  const errors = {};
  if (!values.nom.trim()) errors.nom = 'Nom requis';
  if (!values.email.trim()) errors.email = 'Email requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Email invalide';
  if (!values.sujet.trim()) errors.sujet = 'Sujet requis';
  if (!values.message.trim()) errors.message = 'Message requis';
  return errors;
}

function InputField({ label, name, type = 'text', placeholder, value, onChange, onBlur, touched, error, as }) {
  const className = `field-input mt-1.5 w-full rounded-xl border px-4 py-3 text-slate-900 text-sm placeholder:text-slate-400 ${
    touched ? (error ? 'invalid border-red-400 bg-red-50' : 'valid border-green-500 bg-green-50') : 'border-slate-200 bg-slate-50'
  }`;

  return (
    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500">
      {label}
      {as === 'textarea' ? (
        <textarea
          className={className + ' min-h-[140px] resize-y'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
      ) : (
        <input
          className={className}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
        />
      )}
      {touched && error && (
        <span className="mt-1 block text-[11px] text-red-500 font-normal normal-case tracking-normal">{error}</span>
      )}
    </label>
  );
}

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.27 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState(TOUCHED_INIT);
  const [sent, setSent] = useState(false);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (sent) setSent(false);
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({ nom: true, email: true, sujet: true, message: true });
    if (!isValid) return;
    setSent(true);
    setValues(INITIAL);
    setTouched(TOUCHED_INIT);
  };

  const contactItems = [
    { icon: <PhoneIcon />, label: 'Téléphone', value: '+229 01 90 00 00 00', href: 'tel:+22901900000' },
    { icon: <EmailIcon />, label: 'Email', value: 'contact@find-stage.com', href: 'mailto:contact@find-stage.com' },
    { icon: <MapPinIcon />, label: 'Adresse', value: 'Cotonou, Bénin', href: '#' },
  ];

  const socials = [
    { label: 'Facebook', icon: <FacebookIcon />, href: '#' },
    { label: 'LinkedIn', icon: <LinkedInIcon />, href: '#' },
    { label: 'X / Twitter', icon: <TwitterIcon />, href: '#' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="contact-page min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <Navbar />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="text-center mb-8 animate-fadeup">
<h1
                className="text-4xl sm:text-5xl text-slate-900 leading-tight mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Parlons de votre besoin
              </h1>

            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

              {/* Form */}
              <form
                onSubmit={onSubmit}
                noValidate
                className="animate-fadeup delay-1 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-[0_4px_32px_rgba(0,0,0,0.07)]"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Nom complet"
                    name="nom"
                    placeholder="Jean Dupont"
                    value={values.nom}
                    onChange={onChange}
                    onBlur={onBlur}
                    touched={touched.nom}
                    error={errors.nom}
                  />
                  <InputField
                    label="Adresse email"
                    name="email"
                    type="email"
                    placeholder="jean@exemple.com"
                    value={values.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    touched={touched.email}
                    error={errors.email}
                  />
                </div>

                <div className="mt-5">
                  <InputField
                    label="Sujet"
                    name="sujet"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={values.sujet}
                    onChange={onChange}
                    onBlur={onBlur}
                    touched={touched.sujet}
                    error={errors.sujet}
                  />
                </div>

                <div className="mt-5">
                  <InputField
                    label="Message"
                    name="message"
                    as="textarea"
                    placeholder="Décrivez votre besoin en détail..."
                    value={values.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    touched={touched.message}
                    error={errors.message}
                  />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <button
                    type="submit"
                    className="send-btn inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold"
                  >
                    <span>Envoyer le message</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                  </button>

                  {sent && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                      </svg>
                      Message envoyé avec succès !
                    </div>
                  )}
                </div>
              </form>

              {/* Info card */}
              <aside className="animate-fadeup delay-2 flex flex-col gap-5">
                <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 sm:p-7 shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
                  <h2 className="text-lg font-semibold text-slate-900 mb-5" style={{ fontFamily: 'var(--font-display)' }}>
                    Coordonnées
                  </h2>
                  <ul className="space-y-4">
                    {contactItems.map(({ icon, label, value, href }) => (
                      <li key={label} className="info-item flex items-start gap-3.5">
                        <span className="info-icon mt-0.5 w-8 h-8 shrink-0 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                          {icon}
                        </span>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-0.5">{label}</p>
                          <a href={href} className="text-sm text-slate-700 hover:text-slate-900 transition-colors">
                            {value}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-sm p-6 shadow-[0_4px_32px_rgba(0,0,0,0.07)]">
                  <p className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mb-4">Réseaux sociaux</p>
                  <div className="flex items-center gap-2.5">
                    {socials.map(({ label, icon, href }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="social-btn w-10 h-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 flex items-center justify-center"
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Availability badge */}
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Disponible</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Nous répondons en général sous <span className="text-white font-semibold">24 heures</span> les jours ouvrés.
                  </p>
                </div>
              </aside>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}