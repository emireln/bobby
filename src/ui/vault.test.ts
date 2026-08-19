// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearVault,
  loadVault,
  parseVaultImport,
  removeFromVault,
  renameInVault,
  reorderVault,
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
      expression: 'heureux'
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
          expression: 'curieux'
        }
      ]
    })
    const parsed = parseVaultImport(raw)
    expect(parsed).toHaveLength(1)
    expect(parsed[0]?.name).toBe('Imported Bot')
    expect(parsed[0]?.shape).toBe('nuage')
    expect(parsed[0]?.color).toBe('ciel')
    expect(parsed[0]?.expression).toBe('curieux')
  })

  it('renames an avatar', () => {
    const { avatar } = saveToVault({
      name: 'Original',
      shape: 'cercle',
      color: 'encre',
      expression: 'neutre'
    })
    renameInVault(avatar.id, 'Renamed Bobby')
    expect(loadVault()[0]?.name).toBe('Renamed Bobby')
  })

  it('reorders avatars in vault', () => {
    saveToVault({ name: 'First', shape: 'cercle', color: 'encre', expression: 'neutre' })
    saveToVault({ name: 'Second', shape: 'cercle', color: 'encre', expression: 'neutre' })
    // In LIFO save, 'Second' is index 0, 'First' is index 1
    expect(loadVault()[0]?.name).toBe('Second')
    expect(loadVault()[1]?.name).toBe('First')

    reorderVault(0, 1)
    expect(loadVault()[0]?.name).toBe('First')
    expect(loadVault()[1]?.name).toBe('Second')
  })

  it('clears all avatars', () => {
    saveToVault({ name: 'A', shape: 'cercle', color: 'encre', expression: 'neutre' })
    saveToVault({ name: 'B', shape: 'cercle', color: 'encre', expression: 'neutre' })
    expect(loadVault()).toHaveLength(2)
    clearVault()
    expect(loadVault()).toHaveLength(0)
  })
})
