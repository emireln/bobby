import { describe, expect, it } from 'vitest'
import { EXPRESSIONS } from '@/bot/expressions'
import { COLORS, SHAPES } from '@/bot/skins'
import { STATES } from '@/bot/states'
import { formePlurielle, interpoler } from './format'
import { choisirLangue, LANGUES, tagDe } from './langues'
import en from './locales/en'
import ptBr from './locales/pt-br'

/**
 * On importe les dictionnaires et les modules purs, jamais `./index` : celui-ci
 * lit `localStorage`, `navigator` et `document` a l'import.
 */
const DICTIONNAIRES = { en, 'pt-br': ptBr }

describe('choix de la langue au demarrage', () => {
  it('respecte le choix memorise, quelles que soient les preferences du navigateur', () => {
    expect(choisirLangue('en', ['pt-BR', 'pt'])).toBe('en')
    expect(choisirLangue('pt-br', ['en-US'])).toBe('pt-br')
  })

  it('ignore un choix memorise qui n est pas une langue connue', () => {
    expect(choisirLangue('de', ['en-GB'])).toBe('en')
    expect(choisirLangue('', ['en-GB'])).toBe('en')
  })

  it('suit l ordre des preferences du navigateur, pas leur simple presence', () => {
    expect(choisirLangue(null, ['pt-BR', 'en-US'])).toBe('pt-br')
    expect(choisirLangue(null, ['en-US', 'pt-BR'])).toBe('en')
  })

  it('reduit une etiquette complete a sa langue', () => {
    expect(choisirLangue(null, ['pt-BR'])).toBe('pt-br')
    expect(choisirLangue(null, ['en-GB-oxendict'])).toBe('en')
  })

  it('saute les langues qu on ne parle pas et les etiquettes invalides', () => {
    expect(choisirLangue(null, ['de-DE', 'ja', 'pt-BR'])).toBe('pt-br')
    expect(choisirLangue(null, ['pas une etiquette', 'en'])).toBe('en')
  })

  it('retombe sur l anglais quand rien ne correspond', () => {
    expect(choisirLangue(null, ['de-DE', 'ja-JP'])).toBe('en')
    expect(choisirLangue(null, [])).toBe('en')
  })
})

describe('completude des dictionnaires', () => {
  function feuilles(objet: object, prefixe = ''): Array<[string, string]> {
    return Object.entries(objet).flatMap(([cle, valeur]) =>
      typeof valeur === 'string'
        ? [[`${prefixe}${cle}`, valeur] as [string, string]]
        : feuilles(valeur as object, `${prefixe}${cle}.`)
    )
  }

  it('n a aucune valeur vide, dans aucune langue', () => {
    for (const [langue, dico] of Object.entries(DICTIONNAIRES)) {
      for (const [cle, valeur] of feuilles(dico)) {
        expect(valeur.trim(), `${langue}.${cle}`).not.toBe('')
      }
    }
  })

  it('traduit les libelles des catalogues vers le portugais', () => {
    for (const famille of ['states', 'shapes', 'colors', 'expressions'] as const) {
      for (const [cle] of feuilles(en[famille])) {
        const ptVal = feuilles(ptBr[famille]).find(([k]) => k === cle)![1]
        expect(ptVal.length, `pt-br ${famille}.${cle}`).toBeGreaterThan(0)
      }
    }
  })

  it('couvre les quatre catalogues du bot, entree par entree', () => {
    const cles = (famille: object) => feuilles(famille).map(([k]) => k)
    expect(cles(en.states).sort()).toEqual(STATES.map((s) => s.id).sort())
    expect(cles(en.shapes).sort()).toEqual(SHAPES.map((s) => s.id).sort())
    expect(cles(en.colors).sort()).toEqual(COLORS.map((c) => c.id).sort())
    expect(cles(en.expressions).sort()).toEqual(EXPRESSIONS.map((e) => e.id).sort())
  })
})

describe('substitution', () => {
  it('remplace toutes les occurrences d un parametre', () => {
    expect(interpoler('{a} et {a}', { a: 'x' })).toBe('x et x')
  })

  it('accepte les nombres et plusieurs parametres', () => {
    expect(interpoler('{etat}, {duree}', { etat: 'Idle', duree: 2 })).toBe('Idle, 2')
  })

  it('laisse visible un parametre sans valeur, plutot que de le vider', () => {
    expect(interpoler('Delete {name}?', {})).toBe('Delete {name}?')
  })
})

describe('pluriel', () => {
  it('distingue singulier et pluriel', () => {
    const gabarit = 'one | many'
    expect(formePlurielle(gabarit, 1, 'en')).toBe('one')
    expect(formePlurielle(gabarit, 2, 'en')).toBe('many')
    expect(formePlurielle(gabarit, 1, 'pt-BR')).toBe('one')
    expect(formePlurielle(gabarit, 2, 'pt-BR')).toBe('many')
  })

  it('donne a l anglais et au portugais deux formes de suppression', () => {
    expect(en.dialog.removeDetail.split(' | ')).toHaveLength(2)
    expect(ptBr.dialog.removeDetail.split(' | ')).toHaveLength(2)
  })
})

describe('catalogue des langues', () => {
  it('propose les deux langues, avec un drapeau et un endonyme', () => {
    expect(LANGUES.map((l) => l.id)).toEqual(['en', 'pt-br'])
    for (const l of LANGUES) {
      expect(l.emoji.length, l.id).toBeGreaterThan(0)
      expect(l.nom.trim(), l.id).not.toBe('')
    }
  })

  it('donne une etiquette BCP 47 que `Intl` sait lire', () => {
    for (const l of LANGUES) {
      const tag = tagDe(l.id)
      expect(new Intl.Locale(tag).language).toBe(l.id === 'pt-br' ? 'pt' : l.id)
      expect(new Intl.NumberFormat(tag).format(2.4), l.id).toMatch(/2[.,]4/)
    }
  })
})
