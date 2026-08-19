// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadVault,
  parseVaultImport,
  removeFromVault,
  saveToVault
} from './vault'

describe('Avatar Vault', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('charges empty array when no storage', () => {
    expect(loadVault()).toEqual([])
  })

  it('saves and loads avatar correctly', () => {
    const { avatar, vault } = saveToVault({
      name: 'Super Bobby',
      shape: 'coeur',
      color: 'menthe',
      expression: 'heureux',
      bubble: 'Hello!'
    })

    expect(avatar.name).toBe('Super Bobby')
    expect(avatar.id).toBeDefined()
    expect(vault).toHaveLength(1)
    expect(loadVault()).toHaveLength(1)
    expect(loadVault()[0]?.name).toBe('Super Bobby')
  })

  it('removes avatar by id', () => {
    const { avatar } = saveToVault({
      name: 'Bobby 1',
      shape: 'nuage',
      color: 'encre',
      expression: 'neutre'
    })
    saveToVault({
      name: 'Bobby 2',
      shape: 'etoile',
      color: 'ambre',
      expression: 'etoile'
    })

    expect(loadVault()).toHaveLength(2)
    const updated = removeFromVault(avatar.id)
    expect(updated).toHaveLength(1)
    expect(loadVault()).toHaveLength(1)
    expect(loadVault()[0]?.name).toBe('Bobby 2')
  })

  it('parses valid json import and sanitizes invalid fields', () => {
    const raw = JSON.stringify({
      version: 1,
      avatars: [
        {
          name: 'Imported Bot',
          shape: 'non-existent',
          color: 'ciel',
          expression: 'curieux',
          bubble: 'Nice!'
        }
      ]
    })

    const parsed = parseVaultImport(raw)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]?.name).toBe('Imported Bot')
    // fallback to valid default shape
    expect(parsed[0]?.shape).toBe('nuage')
    expect(parsed[0]?.color).toBe('ciel')
    expect(parsed[0]?.expression).toBe('curieux')
    expect(parsed[0]?.bubble).toBe('Nice!')
  })
})
