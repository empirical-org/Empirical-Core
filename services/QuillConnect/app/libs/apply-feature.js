import stringHash from 'string-hash';

export function applyFeatureToPercentage(identifier, percentage) {
  if (typeof identifier !== 'string') return false;
  return (stringHash(identifier) % 100 < percentage);
}
