import { createContext, useContext, useState, useCallback, useEffect } from 'react';

/**
 * Contexte global pour la candidature : secteur, niveau, type (binome/individuel),
 * infos etudiants, CV, et etat du paiement.
 */
const ApplicationContext = createContext(null);

const STORAGE_KEY = 'find:application:v1';
const EMPTY_STUDENT = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  universite: '',
  filiere: '',
  niveau: '',
};

function readPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function ApplicationProvider({ children }) {
  const persisted = readPersistedState();

  const [sector, setSector] = useState(persisted?.sector ?? null);
  const [provider_id, setProvider_id] = useState(persisted?.provider_id ?? '');
  const [level, setLevel] = useState(persisted?.level ?? '');
  const [isPair, setIsPair] = useState(Boolean(persisted?.isPair));
  const [student1, setStudent1] = useState(persisted?.student1 ?? EMPTY_STUDENT);
  const [student2, setStudent2] = useState(persisted?.student2 ?? EMPTY_STUDENT);
  const [cvFile, setCvFile] = useState(null);
  const [cvValid, setCvValid] = useState(Boolean(persisted?.cvValid));

  const setSectorAndModality = useCallback((s, l) => {
    setSector(s);
    setLevel(l);
    setIsPair(l === 'Licence');
  }, []);

  const resetApplication = useCallback(() => {
    setSector(null);
    setProvider_id('');
    setLevel('');
    setIsPair(false);
    setStudent1(EMPTY_STUDENT);
    setStudent2(EMPTY_STUDENT);
    setCvFile(null);
    setCvValid(false);

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sector,
          provider_id,
          level,
          isPair,
          student1,
          student2,
          cvValid,
          updatedAt: Date.now(),
        })
      );
    } catch {
      // noop
    }
  }, [sector, provider_id, level, isPair, student1, student2, cvValid]);

  const value = {
    sector,
    level,
    isPair,
    setSectorAndModality,
    student1,
    provider_id,
    setProvider_id,
    setStudent1,
    student2,
    setStudent2,
    cvFile,
    setCvFile,
    cvValid,
    setCvValid,
    resetApplication,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}
