import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import mtnLogo from '../../assets/images/MTN.jpg';
import moovLogo from '../../assets/images/MOOV.png';
import celtisLogo from '../../assets/images/celtiis.jpg';
import { getProviders, createCandidatureMultipart } from '../../utils/api';

const AMOUNT_VALUE = 5000;
const AMOUNT_LABEL = '5 000';
const FALLBACK_METHODS = [
  { id: '__mtn', label: 'MTN', logo: mtnLogo, active: false, isFallback: true },
  { id: '__moov', label: 'Moov', logo: moovLogo, active: false, isFallback: true },
  { id: '__celtis', label: 'Celtis', logo: celtisLogo, active: false, isFallback: true },
];

export default function Summary() {
  const navigate = useNavigate();
  const { sector, level, isPair, student1, student2, setProvider_id, cvFile } = useApplication();

  const [providers, setProviders] = useState([]);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingProviders, setFetchingProviders] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sector) {
      navigate('/demande-stage', { replace: true });
    }
  }, [sector, navigate]);

  useEffect(() => {
    (async () => {
      setFetchingProviders(true);
      try {
        const data = await getProviders();
        const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setProviders(list);

        const defaultProvider = list.find((p) => p.is_active) ?? list[0];
        if (defaultProvider) {
          const pid = defaultProvider.id ?? defaultProvider._id;
          setMethod(pid);
          setProvider_id(pid);
        }
      } catch (e) {
        console.error('Erreur providers:', e);
      } finally {
        setFetchingProviders(false);
      }
    })();
  }, [setProvider_id]);

  const methods = useMemo(() => {
    const mapped = providers.map((item) => {
      const name = String(item.name ?? '').toLowerCase();

      let logo = celtisLogo;
      if (name.includes('mtn')) logo = mtnLogo;
      else if (name.includes('moov')) logo = moovLogo;

      return {
        id: item.id ?? item._id ?? null,
        label: item.name ?? '',
        logo,
        active: item.is_active ?? false,
        isFallback: false,
      };
    });
    return mapped.length ? mapped : FALLBACK_METHODS;
  }, [providers]);

  const hasRealProviders = methods.some((m) => !m.isFallback);
  const hasActiveMethod = methods.some((m) => m.active && !m.isFallback);
  const fullName = (s) => `${s?.prenom ?? ''} ${s?.nom ?? ''}`.trim();
  const names = isPair ? `${fullName(student1)} & ${fullName(student2)}`.trim() : fullName(student1);

  const rows = [
    { label: 'Secteur', value: `${sector?.icon ?? ''} ${sector?.name ?? ''}`.trim() },
    { label: 'Type', value: isPair ? 'Binôme (Licence)' : 'Individuel (Master)' },
    { label: 'Étudiant(s)', value: names },
    { label: 'Niveau', value: level },
    { label: 'Montant', value: `${AMOUNT_LABEL} FCFA`, strong: true },
  ];

  const handlePay = async () => {
    if (!hasRealProviders) {
      setError('Moyens de paiement indisponibles côté backend. Réessayez dans quelques instants.');
      return;
    }

    if (!method) {
      setError('Veuillez choisir un moyen de paiement.');
      return;
    }

    const sectorId = sector?._id ?? sector?.id ?? null;
    if (!sectorId) {
      setError('Secteur invalide. Reprenez la sélection.');
      return;
    }

    if (!cvFile) {
      setError('CV manquant. Retournez au formulaire.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('sector_id', String(sectorId));
      fd.append('level', String(level));
      fd.append('student_name', fullName(student1));
      fd.append('student_email', String(student1?.email ?? ''));
      fd.append('amount', String(AMOUNT_VALUE));
      fd.append('provider_id', String(method));
      fd.append('phone_number', String(student1?.telephone ?? ''));

      if (isPair) {
        const f1 = cvFile?.student1;
        const f2 = cvFile?.student2;

        if (!(f1 instanceof File) || !(f2 instanceof File)) {
          throw new Error('CV binôme manquant ou invalide.');
        }
        if (!student2?.email) {
          throw new Error('Email du binôme manquant.');
        }

        fd.append('partner_name', fullName(student2));
        fd.append('partner_email', String(student2.email));
        fd.append('student_cv', f1);
        fd.append('partner_cv', f2);
      } else {
        if (!(cvFile instanceof File)) {
          throw new Error('CV invalide.');
        }
        fd.append('student_cv', cvFile);
      }

      const res = await createCandidatureMultipart(fd);
      if (!res?.payment_url) {
        throw new Error('Aucune URL de paiement reçue.');
      }

      window.location.href = res.payment_url;
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Le paiement a échoué. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-[#fdfcf8] to-[#faf8f2] px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">Dossier 2026</p>
              <p className="mt-0.5 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">Récapitulatif</p>
            </div>
          </div>

          <div className="flex items-center gap-2" aria-label="Progression des étapes">
            {[1, 2, 3].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    step <= 3
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-zinc-200 bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {step}
                </span>
                {i < 2 && <span className="h-px w-4 bg-zinc-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white">
        <div className="divide-y divide-zinc-100">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center sm:gap-4 sm:px-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                {row.label}
              </span>
              <span className={`text-left text-base sm:text-right ${row.strong ? 'font-extrabold text-zinc-900' : 'font-medium text-zinc-700'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Moyen de paiement</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {methods.map((m) => {
            const isSelected = method === m.id;
            const isDisabled = !m.isFallback && !m.active && hasActiveMethod;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMethod(m.id);
                  if (!m.isFallback) {
                    setProvider_id(m.id);
                  }
                  setError(null);
                }}
                disabled={isDisabled}
                className={`group rounded-2xl border-2 px-4 py-4 text-center transition ${
                  isDisabled
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100/70 opacity-60'
                    : isSelected
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl ${isSelected ? 'bg-white' : 'bg-zinc-100'}`}>
                  <img src={m.logo} alt={m.label} className="h-12 w-12 object-contain" />
                </div>
                <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-700'}`}>{m.label}</p>
              </button>
            );
          })}
        </div>

        {!hasRealProviders && !fetchingProviders && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-700">
              Aucun moyen de paiement disponible pour le moment. Vérifiez la connexion au backend puis réessayez.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Traitement en cours</p>
            <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
              <div className="h-full w-full animate-pulse rounded-full bg-zinc-900" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-4 text-base font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Paiement en cours...' : `Payer ${AMOUNT_LABEL} FCFA`}
        </button>

        <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-300">
          Paiement 100% sécurisé
        </p>
      </div>
    </div>
  );
}
