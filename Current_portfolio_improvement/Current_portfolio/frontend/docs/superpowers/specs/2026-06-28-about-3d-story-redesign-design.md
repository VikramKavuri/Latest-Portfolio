# About Section — 3D Story Redesign

**Date:** 2026-06-28
**Status:** Approved (design)
**Scope:** Replace the 3 weak About 3D models with a 6-model cinematic sequence that conveys the full story visually — readable with zero text. Split the chapter text to match.

## Problem

The current About section pairs 3 chapters with 3 procedural 3D icons:

| Beat | Story | Current model | Failure |
|------|-------|---------------|---------|
| The person | analyst → engineer; decision-first; quiet until the number must be right | Laptop | Reads as "any office worker." No journey, no character. |
| What I do best | EHR + ERP + HR that fight → one trusted source → fast, accurate, audit-proof | Single database stack | Reads as "a database." The core idea (many messy systems → one) is absent. The beat is also overloaded — it carries unify + speed + trust at once, so no single object can represent it. |
| Why me | tools are cheap, judgment isn't; find the insight, refuse "works" when "optimal" exists | Lightbulb | Generic "an idea." Doesn't convey judgment or optimal-vs-works. |

A viewer who reads no text learns almost nothing from the models. Goal: every model is self-explanatory, and the overloaded middle beat is decomposed.

## Decision

Expand to a **6-model cinematic sequence**, one unambiguous idea per model, with the chapter text re-split to match. Confirmed with user: 6 models; globe opener.

### The sequence

| # | id | Model | Reads (no text) | Disc |
|---|-----|-------|-----------------|------|
| 1 | `journey` | **Globe + flight arc** — navy wireframe globe, two gold pins, gold parabola with a travelling dot | Came across the world; global trajectory (Bangalore → Buffalo) | gold |
| 2 | `chaos` | **Clashing systems** — 3 mismatched objects (health cross, ERP box, HR badge) floating apart, jittering, broken red connectors | Separate systems that fight / don't talk — the problem | navy |
| 3 | `convergence` | **Convergence** — the 3 dissolve into particle streams flowing into one glowing unified core | Many → one source of truth — the transformation | gold |
| 4 | `speed` | **Speed** — unified core on a conduit, gold data packets racing through, fast sweep | Fast | navy |
| 5 | `trust` | **Shield** — steady gold shield with a check enclosing the core (calm, not spinning) | Accurate, safe, audit-proof, zero findings | navy |
| 6 | `insight` | **Insight gem** — from a field of dull raw points, ONE gold faceted gem rises and lights up | Judgment finds the ONE insight; optimal, not just "works" | gold |

The arc literally narrates the story in pictures: traveled the world → found systems in chaos → unified them → made it fast → made it trustworthy → extracted the decisive insight.

### Text re-split (`src/data/about.js`)

Six chapters replace the current three. Voice unchanged (conversational, crisp, character-driven).

1. **journey** — kicker "The person" — headline *"Hi, I'm Vikram."*
   - Started as a business analyst in Bangalore, now a data engineer in Buffalo. Same instinct the whole way: get the decision right first, then build what makes it possible.
   - I'm the quiet one on the call — right up until the number has to be right.
   - quote: "This guy must be senior level — even though he was a fresher." — Technical Lead, The Arc Erie County

2. **chaos** — kicker "The problem" — headline *"Most data is a mess."*
   - An EHR here, an ERP there, an HR tool that argues with both. Three systems, three versions of the truth.

3. **convergence** — kicker "What I do best" — headline *"I make them tell one story."*
   - I pull them into one source you can actually trust — one place the whole business can point to.

4. **speed** — kicker "Fast" — headline *"Then I make it fast."*
   - Reports that took four hours now take forty-five minutes. Queries 85% faster.
   - proof: `85%` Faster queries · `4h→45m` Report runtime

5. **trust** — kicker "Bet-the-business reliable" — headline *"Fast isn't enough — it has to hold up."*
   - Accurate, audit-proof, the kind of number you can stake a decision on.
   - proof: `87%` ML accuracy, in production · `0` Audit findings · `40%` Billing backlog cut

6. **insight** — kicker "Why me" — headline *"Tools are cheap. Judgment isn't."*
   - Anyone can stand up a pipeline. I find the insight that actually moves the needle — and I won't settle for "it works" when "optimal" is still on the table.

Opening line and close are unchanged:
- opening: "Look — there are thousands of data engineers. I'm the one you actually want when the decision matters."
- close: "Optimal insights. Nothing less." / "Keep scrolling — the work speaks next."

(Proof stats are redistributed across beats 4–5 instead of one strip; the 5 existing stats all still appear.)

## Architecture

Follows the existing pattern in `src/components/about/`. No new dependencies.

- **`AboutScene3D.jsx`** — the one persistent R3F canvas. Replace the 3 procedural components (`Laptop`, `Database`, `Lightbulb`) with 6 (`Globe`, `ClashingSystems`, `Convergence`, `Speed`, `Shield`, `InsightGem`). Keep `useSwap` (scale cross-fade + spin), `ModelSlot`, `ModelErrorBoundary`, and `LoadedModel` exactly as-is. Wire 6 `ModelSlot`s with `active === 0..5` and `.glb` urls `/models/{journey,chaos,convergence,speed,trust,insight}.glb`.
  - `Convergence` reuses the streams-into-core concept noted in prior memory (many navy source nodes → gold particles → central pulsing gold core).
  - Steady models (Shield) use `spin = 0` or very low; chaos jitters; gem rises on activation.
- **`AboutStory.jsx`** — `CAPTIONS` and `DISC_CLASS` arrays extend from 3 to 6 entries (captions per the "Reads" column; discs per the Disc column). IntersectionObserver logic unchanged — it already keys off `data-chapter` index, so 6 chapters drive `active` 0..5 automatically.
- **`about.js`** — replace `chapters` array with the 6 above; redistribute `proof` into per-chapter `proof` arrays (or keep the single `proof` array and add a `proofSlice` per chapter). Decision: give beats 4 and 5 their own inline `proof` arrays; remove the top-level single-strip dependency. `Chapter.jsx` already renders `chapter.proof` when present — no change needed there beyond it accepting an array on two chapters.
- **`Chapter.jsx`** — no structural change. Already handles kicker/headline/body/quote/proof generically.

### Data flow

`AboutStory` IntersectionObserver → `active` (0..5) → `AboutScene3D active` prop → `ModelSlot` `useSwap` cross-fades the active model in, others out. Disc class + caption switch on `active`. Unchanged mechanism; only the count grows.

### Constraints honored (from prior memory)

- Sticky-scroll, height-bounded inside the About page; must not conflict with the book's auto-advance-on-scroll. 6 chapters = more scroll length but same sticky mechanism.
- `prefers-reduced-motion`: all new models gate spin/jitter/pulse on the existing `prefersReduced` flag (chaos does not jitter, gem does not pulse, etc.).
- Transform/opacity-driven; procedural default ships meaningful; `.glb` auto-upgrade slot retained per model.
- Theme: navy `#2C4A72`/`#161927`, gold `#B8860B`/`#D4A843`, cream, on the existing CSS disc.

## Testing / verification

- Manual: load About on localhost:3000, scroll all 6 beats; confirm each model cross-fades in, disc + caption switch, proof appears on beats 4–5, reduced-motion disables animation, mobile layout holds.
- Visual QA via browse/screenshot per beat.

## Out of scope

- No real `.glb` assets authored here (slots remain; user supplies Sketchfab files later).
- No changes to Hero/Nav/Projects or any non-About code.
- No new libraries.
