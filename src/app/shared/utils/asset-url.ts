/**
 * Construit une URL finale d’asset à partir d’un path renvoyé par le backend.
 *
 * - DEV: baseUrl = '/assets'           => '/assets/spc/SPC001.png'
 * - PROD: baseUrl = 'https://assets.sopikeur.sn' => 'https://assets.sopikeur.sn/spc/SPC001.png'
 *
 * Supporte aussi les anciens paths qui commencent par 'assets/' ou '/assets/'.
 */
export function assetUrl(input: string | null | undefined, baseUrl: string): string {
  if (!input?.trim()) return '';

  const trimmed = input.trim();

  // Si déjà une URL absolue, on ne touche pas.
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Normalise le baseUrl (retire les / finaux)
  let normalizedBaseUrl = (baseUrl || '').trim().replace(/\/+$/, '');

  // Si on te donne "assets.sopikeur.sn" sans schéma, on force https
  if (normalizedBaseUrl && !normalizedBaseUrl.startsWith('/') && !/^https?:\/\//i.test(normalizedBaseUrl)) {
    normalizedBaseUrl = `https://${normalizedBaseUrl}`;
  }

  // Normalise le path: enlève les slash initiaux
  let path = trimmed.replace(/^\/+/, '');

  // Retire le préfixe legacy "assets/" partout (DEV et PROD)
  if (path.startsWith('assets/')) {
    path = path.slice('assets/'.length);
  }

  // encode légère (garde les /)
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  // Si baseUrl est vide (cas rare), on renvoie un chemin relatif
  if (!normalizedBaseUrl) return `/${encodedPath}`;

  return `${normalizedBaseUrl}/${encodedPath}`;
}
