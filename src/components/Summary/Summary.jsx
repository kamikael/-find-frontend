import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import mtnLogo from '../../assets/images/MTN.jpg';
import moovLogo from '../../assets/images/MOOV.png';
import celtisLogo from '../../assets/images/celtiis.jpg';
import { getProviders, createCandidatureMultipart } from '../../utils/api';

// backend attend un nombre
const AMOUNT_VALUE = 5000;
const AMOUNT_LABEL = '5 000';

export default function Summary() {
  const navigate = useNavigate();
  const { sector, level, isPair, student1, student2, setProvider_id, cvFile } = useApplication();

  const [providers, setProviders] = useState([]);
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shakeKey, setShakeKey] = useState(0);

  // 🔴 sécurité navigation
  useEffect(() => {
    if (!sector) {
      navigate('/demande-stage', { replace: true });
    }
  }, [sector, navigate]);

  // 🔥 fetch providers
  useEffect(() => {
    (async () => {
      try {
        const data = await getProviders();
        const list = Array.isArray(data) ? data : [];
        setProviders(list);

        // ⭐ auto-sélection du premier actif
        const firstActive = list.find((p) => p.is_active);
        if (firstActive) {
          const pid = firstActive.id ?? firstActive._id;
          setMethod(pid);
          setProvider_id(pid);
        }
      } catch (e) {
        console.error('Erreur providers:', e);
      }
    })();
  }, [setProvider_id]);

  // 🔥 mapping méthodes
  const METHODS = useMemo(() => {
    return providers.map((item) => {
      const name = (item.name ?? '').toLowerCase();

      let logo = celtisLogo;
      if (name.includes('mtn')) logo = mtnLogo;
      else if (name.includes('moov')) logo = moovLogo;

      return {
        id: item.id ?? item._id ?? null,
        label: item.name ?? '',
        logo,
        active: item.is_active ?? false,
      };
    });
  }, [providers]);

  const fullName = (s) => `${s?.prenom ?? ''} ${s?.nom ?? ''}`.trim();
  const names = isPair ? `${fullName(student1)} & ${fullName(student2)}`.trim() : fullName(student1);

  const handlePay = async () => {
    if (!method) {
      setError('Veuillez choisir un moyen de paiement.');
      setShakeKey(k => k + 1);
      return;
    }

    const sectorId = sector?._id ?? sector?.id ?? null;
    if (!sectorId) {
      setError('Secteur invalide. Reprenez la sélection.');
      setShakeKey(k => k + 1);
      return;
    }

    if (!cvFile) {
      setError('CV manquant. Retournez au formulaire.');
      setShakeKey(k => k + 1);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const fd = new FormData();

      // 🔹 Champs texte
      fd.append('sector_id', String(sectorId));
      fd.append('level', String(level));
      fd.append('student_name', fullName(student1));
      fd.append('student_email', String(student1?.email ?? ''));
      fd.append('amount', String(AMOUNT_VALUE));
      fd.append('provider_id', String(method));
      fd.append('phone_number', String(student1.telephone));

      // 🔹 Fichiers
      // 🔹 Fichiers
if (isPair) {
  const f1 = cvFile?.student1;
  const f2 = cvFile?.student2;

  if (!(f1 instanceof File) || !(f2 instanceof File)) {
    throw new Error('CV binôme manquant ou invalide.');
  }

  if (!student2?.email) {
    throw new Error("Email du binôme manquant.");
  }

  fd.append('partner_name', fullName(student2));
  fd.append('partner_email', String(student2.email));

  fd.append('student_cv', f1);    // 🔑 Nom exact attendu
  fd.append('partner_cv', f2);    // 🔑 Nom exact attendu
} else {
  if (!(cvFile instanceof File)) {
    throw new Error('CV invalide.');
  }

  fd.append('student_cv', cvFile); // 🔑 Nom exact attendu
}

      // 🔹 POST multipart
      const res = await createCandidatureMultipart(fd);

      if (!res?.payment_url) {
        throw new Error("Aucune URL de paiement reçue.");
      }

      // 🔹 Redirection vers Fedapay
      window.location.href = res.payment_url;

    } catch (e) {
      console.error(e);
      setError(e?.message || 'Le paiement a échoué. Veuillez réessayer.');
      setShakeKey(k => k + 1);
      setLoading(false);
    }
  };

  const rows = [
    { label: 'Secteur', value: `${sector?.icon ?? ''} ${sector?.name ?? ''}` },
    { label: 'Type', value: isPair ? 'Binôme (Licence)' : 'Individuel (Master)' },
    { label: 'Étudiant(s)', value: names },
    { label: 'Niveau', value: level },
    { label: 'Montant', value: `${AMOUNT_LABEL} FCFA`, bold: true },
  ];

  return (
    <div>
      {/* ── Récap ── */}
      <div className="px-4 sm:px-7 py-6">
        <p className="text-base font-extrabold uppercase tracking-wide text-zinc-900 mb-4">
          Récapitulatif
        </p>

        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between py-3 ${
              i < rows.length - 1 ? 'border-b border-zinc-50' : ''
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {row.label}
            </span>
            <span
              className={`text-sm text-right max-w-[65%] break-words ${
                row.bold ? 'font-bold text-zinc-950' : 'font-medium text-zinc-600'
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px mx-4 sm:mx-7 bg-zinc-100" />

      {/* ── Paiement ── */}
      <div className="px-4 sm:px-7 py-6 flex flex-col gap-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Moyen de paiement
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {METHODS.map((m) => {
            const isSelected = method === m.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMethod(m.id);
                  setProvider_id(m.id);
                }}
                disabled={!m.active}
                className={`rounded-xl border-2 px-3 py-4 text-center transition-all duration-150 ${
                  !m.active
                    ? 'border-zinc-200 bg-zinc-50 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-zinc-950 bg-zinc-950'
                    : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center ${
                    isSelected ? 'bg-white' : 'bg-zinc-100'
                  }`}
                >
                  <img
                    src={m.logo}
                    alt={m.label}
                    className="w-9 h-9 object-contain scale-110 drop-shadow-sm"
                  />
                </div>

                <p className={`text-[11px] font-bold ${isSelected ? 'text-white' : 'text-zinc-700'}`}>
                  {m.label}
                </p>
              </button>
            );
          })}
        </div>

        {error && (
          <div key={shakeKey} className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Traitement en cours…
            </p>
            <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-950 rounded-full transition-all duration-[2000ms] w-full" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading || !method}
          className="w-full flex items-center justify-center gap-2 bg-zinc-950 text-white
                     text-sm font-bold py-4 rounded-xl transition-all duration-200
                     hover:-translate-y-0.5 hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Paiement en cours…' : `Payer ${AMOUNT_LABEL} FCFA`}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-zinc-300">
          <span className="text-[10px] font-semibold uppercase tracking-widest">
            Paiement 100% sécurisé
          </span>
        </div>
      </div>
    </div>
  );
}