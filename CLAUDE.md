# Danielle Goldberg portfolio - project map

A personal portfolio built as a single full-page "AI agent" experience: there
is no separate About/Projects page, everything happens inside one chat panel.
The chat is **not powered by an LLM** - it's a local keyword-matching engine,
and the copy deliberately brags about that ("no LLM to blame"). Keep it that
way; adding a real model call would need its own decision, not a silent swap.

Stack: Next.js 16 (Turbopack), Tailwind v4, Framer Motion, TypeScript,
deployed on Vercel from GitHub. `main` is protected - every change goes
through its own branch + PR, even one-line copy fixes.

## Where things live

| Piece | File | What it's for | Safe to change | Be careful |
|---|---|---|---|---|
| Page shell | `app/page.tsx` | Just renders `<Hero />`. Nothing else. | Anything | Don't reintroduce separate page sections below the agent - that was deliberately removed twice already. |
| Layout | `app/layout.tsx` | Fonts, `<MotionConfig reducedMotion="user">` (sitewide reduced-motion support), `<Analytics />`. | Metadata, fonts | Keep `MotionConfig` wrapping everything - it's the only reduced-motion guard in the app. |
| Two-pane shell | `components/portfolio/Hero.tsx` | Desktop: 42% identity rail (name, title, phone) + chat panel. Mobile: chat panel only, no rail. | Copy, spacing, header text | The rail used to have animated gradient blobs - removed on purpose (they read as generic AI-SaaS chrome, fought the "not an LLM" positioning). Don't re-add ambient decorative motion without a real reason. |
| The agent itself | `components/chat/ChatInterface.tsx` | Owns all chat state: messages, thinking state, the auto-playing intro. `think()` is the one shared "pause, then reveal" helper - both the intro and every real reply go through it. `THINKING_DELAY_MS` is the only place that timing lives. | Copy, delay tuning, adding a new `tool` case in `renderTool` | Don't duplicate the thinking-delay/timeout pattern inline again - extend `think()` instead. |
| Response engine | `content/responses.ts` + `lib/match-intent.ts` | `intents[]` is the keyword→response database. `matchIntent()` scores keyword substring matches, picks the highest, falls back to `fallbackResponses`/`fallbackFollowups` below threshold. `ToolName` is the closed set of rich components a reply can trigger. | Add/edit intents, keywords, responses, chips | Adding a new tool component means adding it to `ToolName` *and* to the `switch` in `ChatInterface.renderTool` - TypeScript will error if you forget the switch case, but not if you forget `ToolName`. |
| Portfolio facts | `content/knowledge.ts` | `identity`, `career`, `education`, `caseStudies`, `promptSuggestions`. This is the source of truth for anything factual (name, phone, case study copy, starter chips). | Editing facts, adding a `CaseStudyImage` | **Verify claims against real source material before writing a case study.** An earlier session invented a fictional "Sprout AI" client that didn't exist - it was actually Qlik's own internal design-system name. Don't let content drift into plausible-sounding fiction. |
| Rich reply components | `components/chat/FrameCarousel.tsx`, `SkillsMap.tsx`, `TimelineCard.tsx`, `NDASafeNote.tsx`, `PromptChips.tsx` | Mounted by `renderTool()` when an intent's `tool` field matches. `FrameCarousel` is the case-study walkthrough (Hook → Friction → Pivot → Solution → Impact) and can show a real screenshot per step via `CaseStudyImage`. | Styling, adding steps/fields | Keep every `tool` component's props matching what `toolArgs` actually contains - it's an untyped `Record<string, unknown>` cast at the call site, not checked by the compiler. |
| Case study screenshots | `public/case-studies/**` | Real product screenshots (AWS, Qlik). Referenced by path string from `content/knowledge.ts`. | Adding new images | Only use screens that are safe to publish - no real customer data, no internal ticket/colleague names. The Qlik shots are prototype UI with placeholder data on purpose. |
| Palette/voice | `app/globals.css`, house style | Cream/ink/green/marigold palette (documented at the top of `globals.css`). No em dashes anywhere in copy - a formatter hook enforces this on file edits and has previously over-applied itself and damaged content; if a diff shows dozens of unrelated dash changes, check it before accepting. | Retuning specific hex values | Don't touch the whole palette on a whim - it's been through two rounds of user feedback already (a rejected "glam" terracotta/gold pass, then the current "fresh, hopeful" green/marigold). |

## Known gaps (not fixed yet, don't assume they're handled)

- No test suite. Verification is `tsc --noEmit`, `next build`, and ad hoc
  Playwright screenshot scripts run by hand.
- Basic analytics exist (`@vercel/analytics`, `track()` calls for intro shown,
  question asked, case study opened, phone tapped) but nobody has looked at
  the data yet - treat any conversion assumption as unverified.
- No usability testing with a real outside visitor has been done. Every UI
  decision so far is informed opinion (including a multi-advisor design
  review), not observed behavior.
- Accessibility pass covers `aria-live` on the chat log, `aria-label` on the
  input and phone/mail links, `aria-hidden` on decorative dots, and
  sitewide reduced-motion support - but there's been no real screen-reader or
  keyboard-only walkthrough.
- `app/api/chat/route.ts` is a leftover LLM-backed chat route from an earlier
  direction. It is not called from anywhere in the app. Leave it alone unless
  you're deliberately reviving that direction - don't "helpfully" wire it up.
