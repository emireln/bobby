<script setup lang="ts">
import { computed } from 'vue'
import { langue, LANGUES, t } from '@/i18n'
import { theme, THEMES } from '@/ui/theme'

/** Comptes de l'auteur. */
const AUTHOR_URL = 'https://github.com/emireln'
const GITHUB = 'https://github.com/emireln/bobby'
const SUPPORT_URL = 'https://buymeacoffee.com/emireln'

/**
 * « Cree par Emir Lima Neto » : le nom est un lien, donc la phrase se coupe autour de
 * lui. On ne peut pas la decouper en deux traductions (« Cree par » + le nom) —
 * le chinois met l'auteur AU MILIEU (« 由 X 创作 ») et l'anglais devant le verbe.
 * Le gabarit garde donc `{name}` et c'est ici qu'on separe ce qui vient avant de
 * ce qui vient apres.
 */
const credits = computed(() => {
  const [avant = '', apres = ''] = t('settings.credits').split('{name}')
  return { avant, apres }
})

/**
 * Clavier du groupe de radios.
 *
 * Declarer `role="radiogroup"` PROMET ce comportement, et des `<button>` ne le
 * donnent pas tout seuls : les fleches doivent deplacer le choix, et le groupe
 * entier ne doit compter que pour UN arret de tabulation. D'ou aussi le
 * `tabindex` mobile dans le gabarit — seule l'option cochee est atteignable par
 * Tab, les fleches font le reste, comme dans un groupe de radios natif.
 */
function auClavier(event: KeyboardEvent, index: number) {
  const pas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  if (!pas) return
  event.preventDefault()
  // on tourne en rond, comme un groupe de radios natif
  const cible = LANGUES[(index + pas + LANGUES.length) % LANGUES.length]!
  langue.value = cible.id
  // le focus suit le choix, sinon les fleches suivantes repartent de l'ancien
  const boutons = (event.currentTarget as HTMLElement).parentElement?.children
  const suivant = boutons?.[LANGUES.indexOf(cible)]
  if (suivant instanceof HTMLElement) suivant.focus()
}
</script>

<template>
  <div>
    <h2 class="text-sm font-semibold">{{ t('settings.language') }}</h2>

    <!--
      Un groupe de boutons radio et non un `<select>` : trois choix se montrent
      entierement, et le drapeau ne se lit pas dans une liste deroulante fermee.

      Chaque bouton porte son `aria-label` en clair plutot que de compter sur le
      nom deduit de son contenu : sur un radio reconstruit, ce calcul n'est pas
      rendu de la meme facon partout, et le nom est ce qui rend le choix
      annoncable. Il reprend exactement le texte visible, comme l'exige le
      critere « intitule dans le nom ».

      `lang` est sur le bouton et pas sur le texte : le nom accessible en herite,
      donc la synthese vocale prononce « 简体中文 » en chinois et non avec la voix
      de la langue courante.
    -->
    <div class="mt-2 flex flex-col gap-1" role="radiogroup" :aria-label="t('settings.language')">
      <button
        v-for="(l, i) in LANGUES"
        :key="l.id"
        type="button"
        role="radio"
        :aria-checked="l.id === langue"
        :aria-label="l.nom"
        :lang="l.tag"
        :tabindex="l.id === langue ? 0 : -1"
        @keydown="auClavier($event, i)"
        class="flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition"
        :class="
          l.id === langue
            ? 'border-[var(--ink)] bg-white font-medium'
            : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--ink)]'
        "
        @click="langue = l.id"
      >
        <!-- drapeaux SVG nets pour USA et Bresil (evite le texte "US"/"BR" sous Windows) -->
        <svg
          v-if="l.id === 'en'"
          width="20"
          height="14"
          viewBox="0 0 640 480"
          class="shrink-0 overflow-hidden rounded-[2px] shadow-xs"
          aria-hidden="true"
        >
          <g fill-rule="evenodd">
            <path fill="#bd3d44" d="M0 0h640v480H0z" />
            <path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640" />
            <path fill="#192f5d" d="M0 0h260v258.5H0z" />
            <g fill="#fff" transform="translate(10, 10) scale(0.95)">
              <circle cx="20" cy="20" r="10" /><circle cx="60" cy="20" r="10" /><circle cx="100" cy="20" r="10" /><circle cx="140" cy="20" r="10" /><circle cx="180" cy="20" r="10" /><circle cx="220" cy="20" r="10" />
              <circle cx="40" cy="55" r="10" /><circle cx="80" cy="55" r="10" /><circle cx="120" cy="55" r="10" /><circle cx="160" cy="55" r="10" /><circle cx="200" cy="55" r="10" />
              <circle cx="20" cy="90" r="10" /><circle cx="60" cy="90" r="10" /><circle cx="100" cy="90" r="10" /><circle cx="140" cy="90" r="10" /><circle cx="180" cy="90" r="10" /><circle cx="220" cy="90" r="10" />
              <circle cx="40" cy="125" r="10" /><circle cx="80" cy="125" r="10" /><circle cx="120" cy="125" r="10" /><circle cx="160" cy="125" r="10" /><circle cx="200" cy="125" r="10" />
              <circle cx="20" cy="160" r="10" /><circle cx="60" cy="160" r="10" /><circle cx="100" cy="160" r="10" /><circle cx="140" cy="160" r="10" /><circle cx="180" cy="160" r="10" /><circle cx="220" cy="160" r="10" />
              <circle cx="40" cy="195" r="10" /><circle cx="80" cy="195" r="10" /><circle cx="120" cy="195" r="10" /><circle cx="160" cy="195" r="10" /><circle cx="200" cy="195" r="10" />
              <circle cx="20" cy="230" r="10" /><circle cx="60" cy="230" r="10" /><circle cx="100" cy="230" r="10" /><circle cx="140" cy="230" r="10" /><circle cx="180" cy="230" r="10" /><circle cx="220" cy="230" r="10" />
            </g>
          </g>
        </svg>
        <svg
          v-else-if="l.id === 'pt-br'"
          width="20"
          height="14"
          viewBox="0 0 640 480"
          class="shrink-0 overflow-hidden rounded-[2px] shadow-xs"
          aria-hidden="true"
        >
          <g fill-rule="evenodd">
            <path fill="#009c3b" d="M0 0h640v480H0z" />
            <path fill="#ffdf00" d="M320 40L600 240L320 440L40 240Z" />
            <circle cx="320" cy="240" r="115" fill="#002776" />
            <path fill="#fff" d="M210 245 C 240 205, 390 205, 430 250 C 390 220, 240 220, 210 245 Z" />
          </g>
        </svg>
        <span class="flex-1">{{ l.nom }}</span>
        <svg
          v-if="l.id === langue"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          class="shrink-0"
        >
          <path
            d="M2.5 6.4 4.8 8.7 9.5 3.6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <h2 class="mt-6 text-sm font-semibold">{{ t('settings.theme') }}</h2>
    <div class="mt-2 flex gap-1 rounded-xl border border-[var(--line)] p-1" role="radiogroup" :aria-label="t('settings.theme')">
      <button
        v-for="th in THEMES"
        :key="th.id"
        type="button"
        role="radio"
        :aria-checked="th.id === theme"
        class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 px-2 text-xs font-medium transition"
        :class="
          th.id === theme
            ? 'bg-[var(--ink)] text-[var(--paper)] shadow-sm'
            : 'text-[var(--muted)] hover:text-[var(--ink)]'
        "
        @click="theme = th.id"
      >
        <span>{{ t(`settings.${th.nom}`) }}</span>
      </button>
    </div>

    <h2 class="mt-6 text-sm font-semibold">{{ t('settings.about') }}</h2>

    <!-- `rel="noreferrer"` en plus de `noopener` : rien a apprendre a la cible
         sur la page d'ou vient le clic -->
    <a
      class="mt-2 flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2 text-sm transition hover:border-[var(--muted)]"
      :href="GITHUB"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('settings.githubAria')"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" class="shrink-0">
        <path
          d="M8 .5a7.5 7.5 0 0 0-2.37 14.62c.37.07.5-.16.5-.36v-1.3c-2.09.46-2.53-.99-2.53-.99-.34-.87-.83-1.1-.83-1.1-.68-.47.05-.46.05-.46.75.06 1.15.78 1.15.78.67 1.15 1.76.82 2.19.63.07-.49.26-.83.48-1.02-1.67-.19-3.42-.83-3.42-3.72 0-.82.29-1.5.78-2.02-.08-.19-.34-.96.07-1.99 0 0 .63-.2 2.06.77a7.1 7.1 0 0 1 3.75 0c1.43-.97 2.06-.77 2.06-.77.41 1.03.15 1.8.07 1.99.49.52.78 1.2.78 2.02 0 2.9-1.76 3.53-3.44 3.71.27.23.51.69.51 1.39v2.06c0 .2.13.44.51.36A7.5 7.5 0 0 0 8 .5z"
          fill="currentColor"
        />
      </svg>
      <span class="flex-1">{{ t('settings.github') }}</span>
      <!-- fleche de lien sortant : elle previent que l'onglet va changer -->
      <svg
        width="11"
        height="11"
        viewBox="0 0 12 12"
        aria-hidden="true"
        class="shrink-0 text-[var(--muted)]"
      >
        <path
          d="M4 2h6v6M10 2 3 9"
          fill="none"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>

    <!-- Soutien : Buy Me a Coffee propre, minimaliste, aligne sur l'UI -->
    <a
      class="group mt-2 flex items-center justify-between gap-2.5 rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--muted)]"
      :href="SUPPORT_URL"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="t('settings.support')"
    >
      <div class="flex items-center gap-2.5">
        <span class="inline-block text-base transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-12" aria-hidden="true">☕</span>
        <span>{{ t('settings.support') }}</span>
      </div>
      <span class="text-xs text-[var(--muted)] transition-colors group-hover:text-[var(--ink)]">Buy Me a Coffee ↗</span>
    </a>

    <p class="mt-4 text-xs text-[var(--muted)]">
      {{ credits.avant
      }}<a
        class="font-medium text-[var(--ink)] underline decoration-[var(--line)] underline-offset-2 transition hover:decoration-[var(--ink)]"
        :href="AUTHOR_URL"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="t('settings.creditsAria')"
        >Emir Lima Neto</a
      >{{ credits.apres }}
    </p>
  </div>
</template>
