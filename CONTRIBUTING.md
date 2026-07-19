# Contributing

## Before you start

Read [`CLAUDE.md`](./CLAUDE.md) — it's the project's detailed convention reference (design-token rules, ESLint sharp edges, the "landing page is frozen" rule) and applies to human contributors just as much as it does to AI coding agents. Read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the layering convention new features should follow.

## Core rules

- **Reuse before you build.** Check `docs/COMPONENTS.md`/`docs/SERVICES.md` before adding a new component or service — this codebase has been extended 6 times over without a rewrite specifically because each pass reused what already existed rather than duplicating it.
- **Never touch `pages/LandingPage.tsx` or `sections/*`.** Pixel-parity with the original static site is a hard requirement there. If you need a new public-facing page, use `layouts/MarketingLayout.tsx` instead (see `pages/AboutPage.tsx` for the pattern).
- **Follow the existing layer chain** for new dashboard features: `pages/dashboard/XPage.tsx` → `store/useX.ts` → `services/xService.ts` → `types/x.ts`. Don't call a service directly from a page component.
- **Route through `constants/routes.ts`'s `ROUTES` object** — never hardcode a path string.
- **Keep mock data deterministic.** Use `seededRandom`/`hashString` from `services/mockUtils.ts`, not `Math.random()`, for anything that should look stable across reloads.

## Code style

- TypeScript strict mode, `noUncheckedIndexedAccess` — array/object index access returns `T | undefined`; handle it (`??`, a guard, or a non-null assertion only when you can prove it's safe).
- No comments explaining *what* code does — only *why*, when it's genuinely non-obvious (a workaround, a hidden constraint, a subtle invariant).
- Prettier formats on save/via `npm run format` — don't hand-format.
- Tailwind utilities directly in JSX; never introduce a new color/token ad hoc — extend `styles/globals.css`'s `@theme` block if a genuinely new token is needed (rare).

### React 19 / `eslint-plugin-react-hooks` v7 sharp edges

This repo's ESLint config enables strict compiler-aware hook rules. The most common ones you'll hit:

- `react-hooks/set-state-in-effect` — flags `setState` inside effects, including legitimate fetch-on-mount. Put `// eslint-disable-next-line react-hooks/set-state-in-effect` directly above the *specific violating line* — not the outer `useEffect(() => {` line. (A common mistake: putting the disable comment on the wrong line inside a `.then()`/`.finally()` chain, where it silences nothing and leaves the real synchronous `setState` call at the top of the effect unflagged-but-still-erroring. If you see an "unused eslint-disable directive" warning, that's the tell.)
- `react-hooks/use-memo` — `useMemo`/`useCallback` dependency arrays must be literal arrays.
- `react-hooks/refs` — never mutate a ref during render; do it in an effect.
- `react-hooks/immutability` — no reassigning an outer variable inside a render-time `.map()` callback.

See `CLAUDE.md` for the full list with examples.

## Verification checklist (run before opening a PR)

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All three must pass clean. There are 6 known pre-existing `react-refresh/only-export-components` warnings in `src/contexts/*.tsx` (not errors) — don't try to "fix" these as part of an unrelated PR; they're a deliberate, accepted tradeoff of colocating a Context's hook with its Provider.

For UI changes, also do a manual (or Playwright) pass: check both light and dark themes, check mobile/tablet/desktop breakpoints, and confirm no new console errors.

## Commit / PR conventions

- Conventional-ish commit subjects: `feat(scope): …`, `fix(scope): …`, `docs: …`, `chore: …` — not strictly enforced, but appreciated.
- Keep PRs scoped to one feature/fix. This codebase's 6-phase history is entirely additive changes with small, targeted edits to existing files — that pattern is the reason it's stayed maintainable; large, sweeping PRs break it.
- If your change modifies an existing file's behavior (not just adds to it), call that out explicitly in the PR description — reviewers should never have to guess whether a diff is additive or behavior-changing.
