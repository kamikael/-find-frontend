/** Taille max CV : 2 Mo */
const MAX_CV_SIZE_BYTES = 2 * 1024 * 1024;
const PDF_MIME = 'application/pdf';

/**
 * Vérifie que le fichier est un PDF et ≤ 2 Mo.
 * @returns { { valid: boolean, error?: string } }
 */
export function validateCvFile(file) {
  if (!file) return { valid: false, error: 'Aucun fichier' };
  if (file.type !== PDF_MIME) return { valid: false, error: 'Format invalide (PDF uniquement)' };
  if (file.size > MAX_CV_SIZE_BYTES) return { valid: false, error: 'Fichier trop volumineux (max 2 Mo)' };
  return { valid: true };
}
