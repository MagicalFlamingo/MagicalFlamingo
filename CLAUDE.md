# Danielle Goldberg portfolio - project map

A personal portfolio built as a single full-page "AI agent" experience: there
is no separate About/Projects page or standalone case-study grid - real work
surfaces inline, as part of the chat conversation itself (see `ChatInterface`'s
empty-state block / `HeroCaseStudyBlock`), not on a page you scroll past to
reach the chat.

**The chat calls a real LLM** (`app/api/chat/route.ts`, Anthropic Claude via
the Vercel AI SDK's `streamText`/`useChat`) - this was a deliberate,
confirmed pivot away from an earlier "no LLM to blame" local keyword-matching
engine. That old engine (`lib/match-intent.ts`, the `intents[]` array in
`content/responses.ts`) is left in the repo, untouched, as a rollback path -
it is not imported by the live chat. Only `content/responses.ts`'s
personality-phrase pools (`thinkingPhrases`, `firstMessagePhrase`, `pick`)
are still live, reused regardless of which engine answers. If you change
which engine is live, update this paragraph in the same PR - it drifted out
of sync with the code once already (round 25 caught and fixed it).

Stack: Next.js 16 (Turbopack), Tailwind v4, Framer Motion, TypeScript,
deployed on Vercel from GitHub. `main` is protected - every change goes
through its own branch + PR, even one-line copy fixes.

## Where things live

| Piece | File | What it's for | Safe to change | Be careful |
|---|---|---|---|---|
| Page shell | `app/page.tsx` | Renders `<Hero />` (identity plaque) → `<ChatSection>` (fills the rest of the viewport) → `<CaseStudyModal>`. Owns the shared state between the chat's inline case-study cards, the modal they open, and the modal's "ask about this project" handoff back into the chat. | Anything | Don't reintroduce a standalone hero/case-study-grid *section* above the chat - that shape was deliberately removed in round 25 after 24 rounds of repainting it never registered as a real change; case studies belong inline in the conversation now. |
| Layout | `app/layout.tsx` | Fonts, `<MotionConfig reducedMotion="user">` (sitewide reduced-motion support), `<Analytics />`. | Metadata, fonts | Keep `MotionConfig` wrapping everything - it's the only reduced-motion guard in the app. |
| Identity plaque | `components/portfolio/Hero.tsx` | A compact, persistent header (name, title, email/LinkedIn, real company names) - not a full-viewport hero. Shares the same `max-w-[1160px]` outer container as `ChatInterface.tsx` so its left edge always lines up with the case-study gallery below it - they used to use different padding structures (header-level padding outside the max-width vs. inner padding inside it) and landed 24px apart on wide screens, a real measured bug, not a taste call. No phone number anywhere in public copy. | Copy, spacing | Keep it compact - it fed a full-viewport hero + a screenshot preview for many rounds and that was explicitly identified as part of the "looks the same" problem. Don't grow it back into a section, and don't let its container width drift from `ChatInterface.tsx`'s again. |
| Chat stage | `components/portfolio/ChatSection.tsx` | Thin wrapper that just places `ChatInterface` on the page - no wrapping "stage," no floating panel. Round 24/25 gave this a dark ink stage behind a shadowed cream panel; round 26 (full pivot to a real reference site the user pointed at) flattened that away - the whole site is one plain cream plane now, no boxes inside boxes. | Styling | Don't reintroduce a distinct background/shadow here - that's exactly the nested-box chrome round 26 removed. |
| The agent itself | `components/chat/ChatInterface.tsx` | Owns all chat state via `@ai-sdk/react`'s `useChat`. When `messages.length === 0`, shows a scripted opening line (Danielle's real `identity.oneLiner`) + `HeroCaseStudyBlock` (one real case study told as a story, plus two demoted text links) - all inside the same accessible `role="log"` region except the empty-state block itself, which is deliberately outside `role="log"` (it's static content, not chat traffic). No starter chips on cold load anymore - they only appear mid-conversation via the LLM's own `showPromptChips` tool call, once there's real context. Uses two width measures: a wide outer container (`max-w-[1160px]`, shared with `Hero.tsx`) for the case-study block, and a narrower `max-w-[720px]` for the headline/prose/input, left-aligned to the same edge rather than independently centered. | Copy, delay tuning, adding a new `tool-*` case in `renderToolPart` | Adding a new tool means adding it to the server's `tools` object in `app/api/chat/route.ts` *and* to the `switch` in `renderToolPart` here - TypeScript won't catch a missed switch case since `part.type` is a loosely-typed string. Don't reintroduce a single shared max-width for both prose and the gallery - that's the exact bug a design council traced "it feels very condensed" to (round 2 of council review, post-PR-#35). Don't bring back all 3 case studies as equal-weight tiles on cold load either - round 3's council (independently, 3 of 5 advisors, then confirmed by peer review) traced "hard to understand the layout" to too many equal-weight competing invitations, not text length. |
| Real LLM route | `app/api/chat/route.ts` | `streamText` + 6 `tool()` defs (`showCaseStudyBeat`, `showSkillsMap`, `showTimelineCard`, `showQuoteCard`, `showStatCard`, `showNDASafeNote`, `showPromptChips`), full `knowledge` object serialized into the system prompt, plus a detailed voice guide (no sycophantic openers, no filler, first-person as Danielle). | Prompt wording, adding a tool | Never let the system prompt imply metrics/quotes/projects beyond what's in `content/knowledge.ts` - the prompt itself says so, but a new tool needs the same discipline. |
| Portfolio facts | `content/knowledge.ts` | `identity`, `career`, `education`, `caseStudies`, `promptSuggestions`, `systemPromptInstructions`. Source of truth for anything factual - name, case study copy, starter chips, the exact voice rules the live LLM is instructed with. | Editing facts, adding a `CaseStudyImage` | **Verify claims against real source material before writing a case study.** An earlier session invented a fictional "Sprout AI" client - it was actually Qlik's own internal design-system name. Don't let content drift into plausible-sounding fiction. No phone number field is surfaced anywhere public. |
| Case-study story block | `components/chat/HeroCaseStudyBlock.tsx` | Round 25: replaced the standalone case-study grid - real case studies render inside the chat's opening instead. Round 26 stripped card chrome. Round 3 of council review retired the equal-weight 3-up grid entirely (`CaseStudyIntroCard.tsx`/`CaseStudyIntroDeck.tsx`, deleted): three tiles asserted a parity the real material doesn't have (only AWS is `impact.status: "Shipped"`) and gave a hiring manager four+ competing invitations with no signal of which mattered. Now: one full-width AWS story (real `hook.headline` + `solution.headline` from `content/knowledge.ts`, verbatim, not paraphrased) plus one quiet line of real text links for Qlik and Sprout - clicking any of the three still opens the same `CaseStudyModal` with the same real `?case=` deep link. Every open (hero or secondary) fires `track("case_study_opened", { project, source })` - the old grid had no click tracking at all, a real, verified gap a peer review caught. | Styling | Keep the AWS visual honest - it's a real data diagram (a real 67/100 breakdown), not a product screenshot; don't relabel it as one. Only use real screenshots (Qlik) or honest diagrams (Sprout's swatches, inside the modal) - never fabricate a photo. |
| Case-study deep dive | `components/portfolio/CaseStudyModal.tsx` | Full-screen modal, 5 real beats (Hook/Friction/Pivot/Solution/Impact - fewer if a project has no content for one, e.g. Sprout has no `pivot`). Reuses `buildBeat()`/`renderVisual()` from `CaseStudyBeat.tsx` directly. Light cream shell, ink text, marigold accents used sparingly - round 24/25 gave this a deliberate dark "focus mode" shell; round 26 flipped it back to light so it matches the rest of the now-all-light site instead of being the one inconsistent dark surface left. | Styling, adding beats | Any real screenshot/diagram inside a frame keeps its own existing light chrome, unrelated to this shell's own color. |
| Other rich reply components | `components/chat/CaseStudyBeat.tsx`, `SkillsMap.tsx`, `TimelineCard.tsx`, `NDASafeNote.tsx`, `PromptChips.tsx`, `QuoteCard.tsx`, `StatCard.tsx` | Mounted by `renderToolPart()` in `ChatInterface.tsx` when a `tool-*` part matches. | Styling, adding fields | These already lived on a light/cream surface and didn't need re-theming for round 26's light pivot - they did need `font-serif` stripped from their headlines/numbers (round 26 dropped Lora app-wide; Inter is now the only typeface). |
| Case study screenshots | `public/case-studies/**` | Real product screenshots (AWS has none usable - see comments in `content/knowledge.ts` about baked-in annotation marks; Qlik has two). Referenced by path string from `content/knowledge.ts`. | Adding new images | Only use screens safe to publish - no real customer data, no internal ticket/colleague names. The Qlik shots are prototype UI with placeholder data on purpose. |
| Palette/voice | `app/globals.css`, house style | Current palette (v5, full pivot to a real reference site the user pointed at): cream `#FAF3E7` is the page's primary background everywhere (again - round 24's ink-primary flip is reversed), ink `#211D1D` is primary text, marigold `#F2A93C` is the one accent, used sparingly on a single word/line rather than as a bold fill/border/glow. No grain/texture overlay anymore - the reference is completely flat. Typography is Inter only now - `.font-serif`/Lora is gone app-wide, dropped from `app/layout.tsx`'s font link too. Full history documented at the top of `globals.css`. No em dashes anywhere in copy - a formatter hook enforces this and has previously over-applied itself; check any diff with dozens of unrelated dash changes before accepting. | Retuning specific hex values | This palette has been through several real rounds of user feedback (a rejected "glam" terracotta/gold pass, a "fresh hopeful" cream/green/marigold pass, an ink-primary "dark gallery" pass, now this light/flat pass explicitly modeled on a real site the user chose). Don't revert it on a whim - each swing was a direct, confirmed response to real feedback, not a unilateral guess. |

## Layout non-negotiable (density)

After merging PR #35, the user reported "it feels very condensed." A second
design-council round (5 advisors, unanimous) traced this to a real,
mechanical cause: the empty-state content was capped at the same
`max-w-[800px]` at every viewport, so it looked identical at 1440px and
1920px - a scale-invariance bug, not a taste question. The Authorship
advisor's proposed fix for *this specific pattern recurring* rather than
being re-litigated by feel every round:

**At every viewport from 1200px to 2560px wide, the chat's empty-state
content (headline through input) must cover at least 70% of viewport
height and at least 55% of viewport width. Below 1200px, the narrower
measure (`max-w-[720px]`/`max-w-[800px]`) holds as-is.**

This is meant to be checkable, not vibes - if a future round wants a
different number, change the number and re-verify it with a real
Playwright measurement (`getBoundingClientRect()` on the empty-state
wrapper vs. viewport dimensions at 1280/1440/1920), not a screenshot
glance. No CI enforces this yet (no test suite exists - see below); it's
a documented bar to check by hand before shipping a layout change here.

## Known gaps (not fixed yet, don't assume they're handled)

- No test suite. Verification is `tsc --noEmit`, `next build`, and ad hoc
  Playwright screenshot scripts run by hand.
- Requires a real `ANTHROPIC_API_KEY` in Vercel's project env vars for the
  live chat to actually answer - without one, the UI still builds/typechecks
  but the chat shows an inline "Something went wrong" error state, not a
  silent fallback to the old local matcher.
- Basic analytics exist (`@vercel/analytics`, `track()` calls for questions
  asked, case studies opened, email/LinkedIn taps) but nobody has looked at
  the data yet - treat any conversion assumption as unverified.
- No usability testing with a real outside visitor has been done. Every UI
  decision so far is informed opinion (including a multi-advisor design
  review), not observed behavior. Round 25's structural rewrite (case
  studies inline in the chat instead of a separate grid) is a real, sizable
  bet on that visitor typing/scrolling into the conversation rather than
  skimming a static grid - worth testing with real people before assuming
  it's actually better, not just different.
- Accessibility pass covers `role="log"`/`aria-live` on the chat, `aria-label`
  on inputs and email/LinkedIn links, `aria-hidden` on decorative dots, and
  sitewide reduced-motion support - but there's been no real screen-reader or
  keyboard-only walkthrough.
- "Memorable" and "different" (round 3 of council review) are explicitly not
  verifiable by another design-council round or another AI-authored guess -
  the council's own Authorship advisor said so, and the point stands. The
  checkable part (item count, redundancy, one clear story instead of four
  competing invitations) is fixed; whether it's actually memorable requires
  a handful of real outside people looking at the page cold and being asked
  what they remember, not another round of screenshots.
