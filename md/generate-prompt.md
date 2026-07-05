# Generation trigger prompt

Trigger it in a clean context window with: **"read generate-prompt.md and execute its
contents."** It is self-directing — it continues from wherever the deck currently ends.

---

You are generating the French learning deck for this project. Read these files, in this
order, before writing anything:

1. `md/curriculum.md` — the generation rules: i+1 (one new element per card), the variety
   axes, the grounding requirement, and the two sanctioned bundle exceptions.
2. `md/spine-plan.md` — the full map: the four stages, the everyday-fluency ceiling, and
   the conjugation schedule.
3. `md/sequence-proof.md` — the format sample and the already-built front of Stage A
   (items 1–30). Match this format exactly; these 30 are the start of the deck.
4. `md/vocabulary.md` — the ONLY source of words. Do not invent vocabulary outside it.

**Task:** find the highest-numbered item currently in `md/sentences.md` and continue the
deck from there. Produce the **next band of ~40 cards** (or fewer, if the next stage
boundary in spine-plan.md comes first — stop at that boundary), then stop. Do not restart
from item 1, and do not run past one band.

**Non-negotiables (these are what keep you on the rails):**
- Each item introduces **exactly ONE** new element, and its sentence is buildable from
  **only items 1…N−1** plus that one new element (or one of curriculum.md's bundle
  exceptions). Never assume a word that hasn't been introduced yet.
- **Register: adult daily life.** No childish filler ("the happy dog eats bread").
- **Rotate the variety axes.** No two consecutive cards may share a frame. If two cards
  differ only by their highlighted word, that is a failure — fix it before moving on.
- **Every sentence must be grounded** — a real, sensible thing a person would actually say.
- **Follow the conjugation schedule** in spine-plan.md (anchors + all irregulars full;
  regulars set the pattern then trail to infinitive-only).

**Output:** append to `md/sentences.md` — the single home for the deck — in
sequence-proof.md's exact format:
`N. **French sentence.** — English. — *new element(s)* (gloss) · rationale tag`

**Stop at the stage boundary.** Do not generate more than one band per run — that is what
keeps each batch reviewable and keeps you inside frames already taught.

---

## Why one stage per run

Generating the whole ~1,500-item deck in one pass is exactly what makes an LLM drift. One
band at a time means every card is built on an already-vetted prefix, and you can review
(and regenerate) a band without the rest of the deck moving.
