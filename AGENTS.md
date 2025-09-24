# Repository Guidelines

## Project Structure & Module Organization
- `src/` source code for the Vite + Vue 3 app (TypeScript).
- `src/components/` reusable UI (e.g., `ScaleBox.vue`, `HeaderBar.vue`).
- `src/pages/` routed/top‑level screens (e.g., `Dashboard.vue`).
- `src/styles/` shared SCSS tokens and globals.
- `src/images/` static assets (e.g., `images/bg/bg.png`, `bg@2x.png`).
- `public/` files copied as‑is to the root at build time.
- `dist/` build output (generated).

Recommended placement:
- New reusable parts → `components/`; new screen → `pages/`.
- Helpers → `utils/`; theme vars → `styles/`.

## Build, Test, and Development Commands
```sh
npm run dev       # Start Vite dev server on :5173
npm run build     # Production build to dist/
npm run preview   # Preview the built app locally
```

## Coding Style & Naming Conventions
- Indentation: 2 spaces. Use Vue SFC with `<script setup lang="ts">` and `lang="scss"`.
- Components and pages: PascalCase file names (e.g., `UserCard.vue`, `Dashboard.vue`).
- CSS/SCSS: prefer scoped styles; shared tokens in `src/styles/`.
- Assets: lowercase names grouped by feature (`src/images/<feature>/...`). Provide 1x/2x pairs when relevant (e.g., `bg.png`, `bg@2x.png`). In CSS, reference via relative paths or `image-set()` for retina.

## Testing Guidelines
- No test framework is configured yet. If adding tests, prefer Vitest + Vue Test Utils.
- Location: `src/__tests__/Component.spec.ts` or `Component.test.ts` near the file.
- Aim to cover utility functions and chart data transforms; snapshot UI only when stable.

## Commit & Pull Request Guidelines
- History shows no established convention; use Conventional Commits:
  - `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`
- PRs should include: concise description, linked issue (if any), screenshots/GIFs for UI, and steps to verify.
- Keep PRs focused and small; update docs and examples alongside code.

## Security & Configuration Tips
- Do not commit secrets; use Vite env files (`.env.local`, `.env.development`) for non‑secret configs.
- Large images: optimize before committing; keep under `src/images/` and reference with relative URLs.

There is no need to test and run the packaging by yourself