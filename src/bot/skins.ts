import { PROFILE_SAMPLES } from './profiles'
import {
  hullOfCircles,
  profileFromPolygon,
  regularPolygonProfile,
  superellipseProfile,
  unionOfCirclesProfile
} from './shape'

/**
 * Formes et couleurs proposees par le personnalisateur du bot.
 *
 * A la difference des silhouettes d'animation (`profiles.ts`), celles-ci ne sont
 * PAS relevees sur la video : elles sont construites analytiquement d'apres la
 * grille du personnalisateur d'origine. Deux sources distinctes, donc, et c'est
 * volontaire — les etats animes doivent rester fideles a la video, les formes de
 * base sont un choix d'utilisateur.
 */

/**
 * Les identifiants sont enumeres plutot que deduits du tableau : c'est ce qui
 * permet a la couche i18n de verifier A LA COMPILATION que chaque forme a bien
 * sa traduction dans les trois langues (`t(\`shapes.${id}\`)` ne compile que si
 * la cle existe). Un `as const` sur le tableau aurait le meme effet mais
 * rendrait `radii` en lecture seule, alors que le moteur le passe tel quel.
 */
export type ShapeId =
  | 'cercle'
  | 'galet'
  | 'squircle'
  | 'capsule'
  | 'triangle'
  | 'hexagone'
  | 'nuage'
  | 'goutte'
  | 'diamant'
  | 'coeur'
  | 'etoile'
  | 'poire'
  | 'cacahuete'
  | 'fleur'
  | 'bouclier'
  | 'octogone'

export interface BotShape {
  id: ShapeId
  radii: number[]
}

/** Ramene le rayon maximal a `max` pour que toutes les formes pesent pareil a l'oeil. */
export function normalize(radii: number[], max = 1): number[] {
  const peak = Math.max(...radii)
  if (peak <= 0) return radii
  const k = max / peak
  return radii.map((r) => r * k)
}

const ANGLES = Array.from({ length: PROFILE_SAMPLES }, (_, i) => (i / PROFILE_SAMPLES) * Math.PI * 2)

/** Galet : cercle deforme par deux harmoniques basses, donc irregulier mais lisse. */
const pebble = normalize(
  ANGLES.map((a) => 1 + 0.075 * Math.cos(2 * a + 0.5) + 0.035 * Math.cos(3 * a + 2.1)),
  1.02
)

/** Nuage : union de bosses, large en bas, deux lobes en haut. */
const cloud = normalize(
  unionOfCirclesProfile([
    { x: -0.44, y: 0.2, r: 0.54 },
    { x: 0.46, y: 0.2, r: 0.5 },
    { x: 0.02, y: 0.3, r: 0.6 },
    { x: -0.24, y: -0.3, r: 0.48 },
    { x: 0.3, y: -0.24, r: 0.44 }
  ]),
  1.02
)

/** Goutte : gros disque en bas, pointe effilee en haut. */
const droplet = normalize(
  profileFromPolygon(hullOfCircles(0, 0.28, 0.66, 0, -0.96, 0.05), 0, 0),
  1.04
)

/** Capsule couchee : enveloppe de deux disques cote a cote. */
const capsule = profileFromPolygon(hullOfCircles(-0.42, 0, 0.62, 0.42, 0, 0.62), 0, 0)

/** Coeur : deux lobes superieurs bien dessines, flancs en V sans renflement et pointe douce en bas. */
const heart = normalize(
  unionOfCirclesProfile([
    { x: -0.33, y: -0.26, r: 0.52 },
    { x: 0.33, y: -0.26, r: 0.52 },
    { x: 0, y: -0.18, r: 0.66 },
    { x: -0.20, y: 0.05, r: 0.52 },
    { x: 0.20, y: 0.05, r: 0.52 },
    { x: 0, y: 0.05, r: 0.60 },
    { x: -0.10, y: 0.25, r: 0.44 },
    { x: 0.10, y: 0.25, r: 0.44 },
    { x: 0, y: 0.25, r: 0.48 },
    { x: 0, y: 0.48, r: 0.32 },
    { x: 0, y: 0.62, r: 0.18 }
  ]),
  1.05
)

/** Etoile : 5 branches doucement arrondies. */
const star = normalize(
  ANGLES.map((a) => 1 + 0.16 * Math.cos(5 * (a + Math.PI / 2))),
  1.06
)

/** Poire : bulbe large en bas, arrondi affine en haut. */
const pear = normalize(
  profileFromPolygon(hullOfCircles(0, 0.22, 0.72, 0, -0.44, 0.44), 0, 0),
  1.04
)

/** Cacahuete : silhouette cintree au centre. */
const peanut = normalize(
  ANGLES.map((a) => 1 - 0.18 * Math.abs(Math.cos(a))),
  1.08
)

/** Fleur : 6 petales reguliers et doux. */
const flower = normalize(
  ANGLES.map((a) => 1 + 0.13 * Math.cos(6 * a)),
  1.05
)

/** Bouclier : epaules douces en haut, flancs droits et ogive gothique continue vers la pointe. */
const shield = normalize(
  unionOfCirclesProfile([
    { x: -0.32, y: -0.35, r: 0.50 },
    { x: 0.32, y: -0.35, r: 0.50 },
    { x: 0, y: -0.32, r: 0.62 },
    { x: -0.30, y: -0.10, r: 0.52 },
    { x: 0.30, y: -0.10, r: 0.52 },
    { x: 0, y: -0.10, r: 0.62 },
    { x: -0.22, y: 0.15, r: 0.50 },
    { x: 0.22, y: 0.15, r: 0.50 },
    { x: 0, y: 0.15, r: 0.56 },
    { x: -0.12, y: 0.35, r: 0.42 },
    { x: 0.12, y: 0.35, r: 0.42 },
    { x: 0, y: 0.35, r: 0.46 },
    { x: 0, y: 0.55, r: 0.32 },
    { x: 0, y: 0.70, r: 0.18 }
  ]),
  1.05
)

export const SHAPES: BotShape[] = [
  { id: 'cercle', radii: new Array(PROFILE_SAMPLES).fill(1) },
  { id: 'galet', radii: pebble },
  // 1.15 et pas 1.02 : sur une superellipse le rayon maximal est la diagonale,
  // donc normaliser dessus donne une forme qui parait plus petite que le cercle.
  { id: 'squircle', radii: normalize(superellipseProfile(4.2), 1.15) },
  { id: 'capsule', radii: capsule },
  // -90deg : un sommet vers le haut de l'ecran (y est oriente vers le bas)
  { id: 'triangle', radii: regularPolygonProfile(3, 1.12, 0.34, -90) },
  // 0deg : sommets a gauche et a droite, donc aretes du haut et du bas plates
  { id: 'hexagone', radii: regularPolygonProfile(6, 1.04, 0.26, 0) },
  { id: 'nuage', radii: cloud },
  { id: 'goutte', radii: droplet },
  // 0deg : pointes en haut/bas et gauche/droite
  { id: 'diamant', radii: regularPolygonProfile(4, 1.14, 0.32, 0) },
  { id: 'coeur', radii: heart },
  { id: 'etoile', radii: star },
  { id: 'poire', radii: pear },
  { id: 'cacahuete', radii: peanut },
  { id: 'fleur', radii: flower },
  { id: 'bouclier', radii: shield },
  { id: 'octogone', radii: regularPolygonProfile(8, 1.05, 0.22, 22.5) }
]

// Map indexee par `string` et non par `ShapeId` : les appelants interrogent avec
// une valeur relue du localStorage ou d'une prop, donc non validee.
export const SHAPE_BY_ID = new Map<string, BotShape>(SHAPES.map((s) => [s.id, s]))
export const DEFAULT_SHAPE = 'cercle'

export type ColorId =
  | 'encre'
  | 'creme'
  | 'brun'
  | 'rouge'
  | 'orange'
  | 'ambre'
  | 'vert'
  | 'turquoise'
  | 'bleu'
  | 'violet'
  | 'rose'
  | 'gris'
  | 'menthe'
  | 'corail'
  | 'peche'
  | 'lavande'
  | 'lime'
  | 'ciel'
  | 'bordeaux'
  | 'or'
  | 'sable'
  | 'indigo'
  | 'prune'
  | 'charbon'

export interface BotColor {
  id: ColorId
  hex: string
}

/** Palette du personnalisateur. */
export const COLORS: BotColor[] = [
  { id: 'encre', hex: '#0a0a0c' },
  { id: 'brun', hex: '#8b5e3c' },
  { id: 'rouge', hex: '#e8483f' },
  { id: 'orange', hex: '#f08a24' },
  { id: 'ambre', hex: '#f0b429' },
  { id: 'vert', hex: '#3ecf8e' },
  { id: 'turquoise', hex: '#2fbfa0' },
  { id: 'bleu', hex: '#3b93f0' },
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'rose', hex: '#e152b0' },
  { id: 'gris', hex: '#a3a3a3' },
  { id: 'creme', hex: '#f1efe9' },
  { id: 'menthe', hex: '#2dd4bf' },
  { id: 'corail', hex: '#f87171' },
  { id: 'peche', hex: '#fb923c' },
  { id: 'lavande', hex: '#a78bfa' },
  { id: 'lime', hex: '#84cc16' },
  { id: 'ciel', hex: '#38bdf8' },
  { id: 'bordeaux', hex: '#9f1239' },
  { id: 'or', hex: '#eab308' },
  { id: 'sable', hex: '#d97706' },
  { id: 'indigo', hex: '#4338ca' },
  { id: 'prune', hex: '#701a75' },
  { id: 'charbon', hex: '#334155' }
]

export const COLOR_BY_ID = new Map<string, BotColor>(COLORS.map((c) => [c.id, c]))
export const DEFAULT_COLOR = 'encre'

/** Melange deux couleurs hex. Sert a la brume de profondeur des particules. */
export function mixHex(from: string, to: string, t: number): string {
  const parse = (h: string) => {
    const v = parseInt(h.slice(1), 16)
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
  }
  const a = parse(from)
  const b = parse(to)
  const c = a.map((x, i) => Math.round(x + (b[i]! - x) * t))
  return `#${c.map((x) => x.toString(16).padStart(2, '0')).join('')}`
}
