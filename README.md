# bobby

![bobby](public/banner.png)

An SVG recreation of the animated bot avatar: **one filled shape** that morphs
between states, **two shapes** for the eyes that morph independently, with customizer,
timeline editor, and export capabilities. No animation library.

## Running it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5190.

```bash
pnpm test     # vitest
pnpm build    # vue-tsc --noEmit && vite build
```

Vue 3, Vite, TypeScript, Tailwind 4.

## What's in it

The rail switches between three views:
- **Customise**: 16 body shapes, 24 colours and 24 rest expressions, persisted between visits.
- **Animations**: arranged timeline editor to sequence states, durations, and cycles.
- **Settings**: language (English or Portuguese), theme (System / Light / Dark), and author credits.

Anything on screen can be exported: the avatar as SVG, PNG or an animated GIF, and
a whole timeline as GIF or MP4.

## Using the component

```vue
<BobbyBot v-model:block="block" v-model:state="state" v-model:playing="playing" />
<BobbyBot state="orbit" :size="120" :frozen-at="1.2" />
```

`block` is the playback cursor: a montage can play the same state twice, so the
index is what identifies where you are; `state` follows it as an output. Pass
`frozenAt` and the component renders one exact frame with no animation loop, which
is how the thumbnails and the state board are drawn.

Props: `size`, `shape`, `color`, `expression`, `paper`, `frozenAt`, `cycle`,
`follow`, `gaze`. Models: `block`, `state`, `playing`, `elapsed`. See
[BobbyBot.vue](src/components/BobbyBot.vue) for details.

## Support the Project

If you find this project helpful or cool, consider supporting:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/emireln)

## Author & Repository

- Author: **Emir Lima Neto**
- Repository: [https://github.com/emireln/bobby](https://github.com/emireln/bobby)
- Support: [https://buymeacoffee.com/emireln](https://buymeacoffee.com/emireln)

## License

MIT. See [LICENSE](LICENSE).

Not affiliated with, endorsed by or connected to x.ai. It recreates visual
avatar behaviors as an exercise. The MIT licence covers the code in this repository.
