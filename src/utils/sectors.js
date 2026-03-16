const DOMAIN_KEYWORDS = {
  tech: ['informatique', 'developpement', 'numerique', 'tech', 'digital'],
  finance: ['finance', 'comptabilite', 'banque'],
  sante: ['sante', 'medical', 'soin'],
  droit: ['droit', 'juridique', 'notaire'],
  marketing: ['marketing', 'communication', 'pub'],
  industrie: ['industrie', 'ingenierie', 'btp', 'construction'],
};

const DOMAIN_LABELS = {
  tech: 'Tech & Numérique',
  finance: 'Finance',
  sante: 'Santé',
  droit: 'Droit',
  marketing: 'Marketing',
  industrie: 'Industrie',
};

export const stripAccents = (value = '') =>
  String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function slugify(value = '') {
  return stripAccents(String(value))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeLevelValue(value) {
  const normalized = stripAccents(String(value ?? ''));
  if (!normalized) return null;
  if (normalized.includes('licence') || normalized.includes('license') || normalized.includes('bachelor')) return 'Licence';
  if (normalized.includes('master')) return 'Master';
  return null;
}

export function normalizeStatusValue(value) {
  const normalized = stripAccents(String(value ?? ''));
  if (!normalized) return null;
  if (normalized.includes('complet') || normalized.includes('complete') || normalized.includes('full') || normalized.includes('closed') || normalized.includes('ferme')) return 'complet';
  if (normalized.includes('urgent') || normalized.includes('limited') || normalized.includes('bientot')) return 'urgent';
  if (normalized.includes('disponible') || normalized.includes('available') || normalized.includes('open') || normalized.includes('ouvert')) return 'disponible';
  return null;
}

function inferDomainKey(...values) {
  for (const value of values) {
    const normalized = stripAccents(String(value ?? ''));
    if (!normalized) continue;

    for (const [key, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      if (keywords.some((keyword) => normalized.includes(keyword))) {
        return key;
      }
    }
  }

  return slugify(values.find(Boolean) ?? '');
}

function toDomainLabel(domainKey, rawLabel) {
  if (rawLabel) return String(rawLabel);
  if (DOMAIN_LABELS[domainKey]) return DOMAIN_LABELS[domainKey];
  const fallback = String(domainKey ?? '').replace(/[-_]+/g, ' ').trim();
  return fallback ? fallback.charAt(0).toUpperCase() + fallback.slice(1) : 'Autre';
}

export function normalizeSector(item) {
  const total = toNumber(
    item?.total_slots ??
    item?.total ??
    item?.slots_total ??
    item?.places_total ??
    item?.capacity
  ) ?? 0;

  const remainingFromApi = toNumber(
    item?.available_slots ??
    item?.remaining ??
    item?.remaining_slots ??
    item?.places_restantes ??
    item?.places_disponibles ??
    item?.available
  );

  const rawDomainSource =
    item?.domain?.name ??
    item?.domain?.label ??
    item?.domaine?.name ??
    item?.domaine?.label ??
    item?.domain_name ??
    item?.domaine_name ??
    item?.domain ??
    item?.domaine ??
    item?.category?.name ??
    item?.category?.label ??
    item?.category ??
    '';

  const rawDomain = typeof rawDomainSource === 'string'
    ? rawDomainSource
    : (rawDomainSource?.label ?? rawDomainSource?.title ?? '');

  const domainKey = inferDomainKey(rawDomain, item?.name);
  const levels = [
    ...toArray(item?.level),
    ...toArray(item?.niveau),
    ...toArray(item?.levels),
    ...toArray(item?.niveaux),
    ...toArray(item?.allowed_levels),
    ...toArray(item?.eligible_levels),
  ]
    .map((entry) => normalizeLevelValue(entry?.name ?? entry?.label ?? entry))
    .filter(Boolean);

  const uniqueLevels = [...new Set(levels)];
  const explicitStatus = normalizeStatusValue(
    item?.status ??
    item?.statut ??
    item?.state ??
    item?.availability_status
  );

  const remaining = remainingFromApi ?? (
    explicitStatus === 'complet' ? 0 : total
  );

  const statusKey = explicitStatus ?? (
    remaining <= 0 ? 'complet' : remaining <= 3 ? 'urgent' : 'disponible'
  );

  return {
    id: item?.id ?? item?._id ?? null,
    _id: item?._id ?? item?.id ?? null,
    name: item?.name ?? item?.title ?? 'Secteur',
    description: item?.description ?? item?.summary ?? '',
    domain: rawDomain || item?.name || '',
    domainKey,
    domainLabel: toDomainLabel(domainKey, rawDomain),
    levels: uniqueLevels,
    statusKey,
    remaining,
    total,
  };
}

export function matchStatus(sector, statuses = []) {
  if (!statuses.length) return true;
  const status = sector.statusKey ?? normalizeStatusValue(sector.status) ?? null;
  if (status) return statuses.includes(status);

  const remaining = sector.remaining ?? 0;
  if (remaining <= 0) return statuses.includes('complet');
  if (remaining <= 3) return statuses.includes('urgent') || statuses.includes('disponible');
  return statuses.includes('disponible');
}

export function matchDomain(sector, domains = []) {
  if (!domains.length) return true;
  const domainKey = slugify(sector.domainKey ?? '');
  if (domainKey && domains.includes(domainKey)) return true;

  const haystack = [
    sector.domainLabel,
    sector.domain,
    sector.name,
    sector.description,
  ]
    .map((value) => stripAccents(value ?? ''))
    .join(' ');

  return domains.some((domain) => {
    if (slugify(domain) === domainKey) return true;
    return (DOMAIN_KEYWORDS[domain] ?? []).some((keyword) => haystack.includes(keyword));
  });
}
