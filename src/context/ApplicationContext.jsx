import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Contexte global pour la candidature : secteur, niveau, type (binôme/individuel),
 * infos étudiants, CV, et état du paiement.
 */
const ApplicationContext = createContext(null);

export function ApplicationProvider({ children }) {
  const [sector, setSector] = useState(null);
  const [level, setLevel] = useState(''); // 'Licence' | 'Master'
  const [isPair, setIsPair] = useState(false); // true = binôme (Licence), false = individuel (Master)
  const [student1, setStudent1] = useState({ nom: '', prenom: '', email: '', telephone: '', universite: '', filiere: '', niveau: '' });
  const [student2, setStudent2] = useState({ nom: '', prenom: '', email: '', telephone: '', universite: '', filiere: '', niveau: '' });
  const [cvFile, setCvFile] = useState(null);
  const [cvValid, setCvValid] = useState(false);

  const setSectorAndModality = useCallback((s, l) => {
    setSector(s);
    setLevel(l);
    setIsPair(l === 'Licence');
  }, []);

  const resetApplication = useCallback(() => {
    setSector(null);
    setLevel('');
    setIsPair(false);
    setStudent1({ nom: '', prenom: '', email: '', telephone: '', universite: '', filiere: '', niveau: '' });
    setStudent2({ nom: '', prenom: '', email: '', telephone: '', universite: '', filiere: '', niveau: '' });
    setCvFile(null);
    setCvValid(false);
  }, []);

  const value = {
    sector,
    level,
    isPair,
    setSectorAndModality,
    student1,
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
