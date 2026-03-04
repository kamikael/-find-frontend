/** Taille max CV : 2 Mo */
const MAX_CV_SIZE_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];

/**
 * Vérifie que le fichier est PDF ou Word et ≤ 2 Mo.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateCvFile(file) {
  if (!file) {
    return { valid: false, error: 'Aucun fichier' };
  }

  // 🔍 récupérer l'extension
  const fileName = file.name || '';
  const extension = fileName.split('.').pop()?.toLowerCase();

  // ❌ extension invalide
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Extension invalide (PDF, DOC ou DOCX uniquement)',
    };
  }

  // ❌ mime invalide (si présent)
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Type de fichier invalide',
    };
  }

  // ❌ taille trop grande
  if (file.size > MAX_CV_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Fichier trop volumineux (max 2 Mo)',
    };
  }

  return { valid: true };
}