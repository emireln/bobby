import { COLOR_BY_ID, SHAPE_BY_ID } from '@/bot/skins'
import { EXPRESSION_BY_ID } from '@/bot/expressions'
import { ecris, lis } from './stockage'

export interface SavedAvatar {
  id: string
  name: string
  shape: string
  color: string
  expression: string
  createdAt: number
}

const DEFAULT_VAULT: SavedAvatar[] = []

/** Lit les avatars sauvegardes depuis le stockage local. */
export function loadVault(): SavedAvatar[] {
  const raw = lis('coffre')
  if (!raw) return DEFAULT_VAULT
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_VAULT
    return parsed.filter(isValidAvatar)
  } catch {
    return DEFAULT_VAULT
  }
}

/** Verifie qu'un avatar a des champs valides. */
export function isValidAvatar(item: unknown): item is SavedAvatar {
  if (!item || typeof item !== 'object') return false
  const a = item as Partial<SavedAvatar>
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.shape === 'string' &&
    typeof a.color === 'string' &&
    typeof a.expression === 'string'
  )
}

/** Enregistre la liste complete dans le stockage local. */
export function persistVault(vault: SavedAvatar[]): void {
  ecris('coffre', JSON.stringify(vault))
}

/** Ajoute un avatar dans le coffre et le persiste. */
export function saveToVault(
  data: Omit<SavedAvatar, 'id' | 'createdAt'>,
  currentVault: SavedAvatar[] = loadVault()
): { avatar: SavedAvatar; vault: SavedAvatar[] } {
  const avatar: SavedAvatar = {
    ...data,
    id: `av_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now()
  }
  const updated = [avatar, ...currentVault.filter((a) => a.id !== avatar.id)]
  persistVault(updated)
  return { avatar, vault: updated }
}

/** Supprime un avatar du coffre. */
export function removeFromVault(id: string, currentVault: SavedAvatar[] = loadVault()): SavedAvatar[] {
  const updated = currentVault.filter((a) => a.id !== id)
  persistVault(updated)
  return updated
}

/** Renomme un avatar du coffre. */
export function renameInVault(
  id: string,
  newName: string,
  currentVault: SavedAvatar[] = loadVault()
): SavedAvatar[] {
  const name = newName.trim().slice(0, 30) || 'Bobby'
  const updated = currentVault.map((a) => (a.id === id ? { ...a, name } : a))
  persistVault(updated)
  return updated
}

/** Deplace un avatar dans le coffre (reorganisation). */
export function reorderVault(
  fromIndex: number,
  toIndex: number,
  currentVault: SavedAvatar[] = loadVault()
): SavedAvatar[] {
  if (
    fromIndex < 0 ||
    fromIndex >= currentVault.length ||
    toIndex < 0 ||
    toIndex >= currentVault.length ||
    fromIndex === toIndex
  ) {
    return currentVault
  }
  const updated = [...currentVault]
  const [moved] = updated.splice(fromIndex, 1)
  if (moved) {
    updated.splice(toIndex, 0, moved)
    persistVault(updated)
  }
  return updated
}

/** Met a jour un avatar existant avec de nouveaux attributs. */
export function updateInVault(
  id: string,
  data: Partial<Omit<SavedAvatar, 'id' | 'createdAt'>>,
  currentVault: SavedAvatar[] = loadVault()
): SavedAvatar[] {
  const updated = currentVault.map((a) => (a.id === id ? { ...a, ...data } : a))
  persistVault(updated)
  return updated
}

/** Vide le coffre. */
export function clearVault(): SavedAvatar[] {
  persistVault([])
  return []
}

/** Exporte le coffre complet sous forme de fichier JSON telechargeable. */
export function exportVaultJson(vault: SavedAvatar[]): void {
  const data = JSON.stringify({ version: 1, bobby: 'vault', avatars: vault }, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `bobby-vault-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** Importe et valide des avatars depuis une chaine JSON. */
export function parseVaultImport(jsonStr: string): SavedAvatar[] {
  const parsed = JSON.parse(jsonStr)
  const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.avatars) ? parsed.avatars : []
  const result: SavedAvatar[] = []

  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const shape = typeof item.shape === 'string' && SHAPE_BY_ID.has(item.shape) ? item.shape : 'nuage'
    const color = typeof item.color === 'string' && COLOR_BY_ID.has(item.color) ? item.color : 'encre'
    const expression =
      typeof item.expression === 'string' && EXPRESSION_BY_ID.has(item.expression)
        ? item.expression
        : 'neutre'
    const name =
      typeof item.name === 'string' && item.name.trim() ? item.name.trim().slice(0, 30) : 'Bobby'

    result.push({
      id: typeof item.id === 'string' ? item.id : `av_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      shape,
      color,
      expression,
      createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now()
    })
  }

  return result
}
