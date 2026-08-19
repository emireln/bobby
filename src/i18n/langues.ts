/**
 * Langues proposees et regle de choix (EN et PT-BR).
 */

/**
 * `tag` est l'etiquette BCP 47, pas l'identifiant : elle sert a `Intl` et a
 * l'attribut `lang` du document.
 *
 * `nom` est l'endonyme — le nom de la langue DANS cette langue.
 */
export const LANGUES = [
  { id: 'en', tag: 'en', emoji: '🇺🇸', nom: 'English' },
  { id: 'pt-br', tag: 'pt-BR', emoji: '🇧🇷', nom: 'Português (Brasil)' }
] as const

export type Langue = (typeof LANGUES)[number]['id']

export const LANGUE_PAR_DEFAUT: Langue = 'en'

export function estLangue(valeur: string | null | undefined): valeur is Langue {
  return LANGUES.some((l) => l.id === valeur)
}

export function tagDe(langue: Langue): string {
  return LANGUES.find((l) => l.id === langue)!.tag
}

/**
 * Langue a afficher au demarrage.
 *
 * Un choix explicite gagne toujours. Sinon on parcourt les preferences du navigateur
 * DANS L'ORDRE et on retient la premiere qu'on sait parler (EN ou PT-BR).
 */
export function choisirLangue(memorisee: string | null, preferences: readonly string[]): Langue {
  if (estLangue(memorisee)) return memorisee
  for (const tag of preferences) {
    if (!tag) continue
    const lower = tag.toLowerCase()
    if (lower.startsWith('pt')) return 'pt-br'
    if (lower.startsWith('en')) return 'en'
    let base: string
    try {
      base = new Intl.Locale(tag).language.toLowerCase()
    } catch {
      continue
    }
    if (base === 'pt') return 'pt-br'
    if (base === 'en') return 'en'
  }
  return LANGUE_PAR_DEFAUT
}
