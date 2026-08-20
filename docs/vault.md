# Avatar Vault Architecture

The **Avatar Vault** (`src/ui/vault.ts`, `src/components/VaultView.vue`) manages user-saved custom avatars with persistent storage and portable JSON export/import.

## Data Structure

```ts
export interface SavedAvatar {
  id: string
  name: string
  shape: string
  color: string
  expression: string
  eyeColor?: string
  bubble?: string
  createdAt: number
}
```

## Storage & Persistence

- Saved to `localStorage` under `bobby:coffre`.
- Supports reordering, renaming inline, updating avatars with current look, and deletion.
- Supports bulk export/import as JSON files (`exportAvatarJson`, `exportVaultJson`, `parseVaultImport`).
