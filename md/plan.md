# The plan

One fixed list of sentences, written in order. You walk down it one card at a
time. Each card is built only from the cards before it, following
[rules.md](rules.md). The list itself lives in [sentences.md](sentences.md), and
the block-by-block route through it is [roadmap.md](roadmap.md).

## The medium

The sentence plays as audio, one word is missing, and you pick that word from
four written options.

Both halves matter, and they pull in different directions:

- **You hear real spoken French.** Reductions are on by default — `chuis` for
  *je suis*, `j'mange` for *je mange*, `ne` gone from `ne … pas`. The ear trains
  on what people say, not on a careful reading voice.
- **You choose between written forms.** So spelling that the ear cannot separate
  is still a real choice. `veux` and `veut` sound the same and are still two
  cards. This is why verb forms are never free (see [rules.md](rules.md)).

The blank is the one new thing on the card. Everything else must already be
known, or there is nothing to reason from.

## How far it goes

Everyday fluency — roughly **A2–B1**, about **1,200 cards** across 30 blocks.
Present, past (passé composé and imparfait), future, conditional, commands,
object and relative pronouns, comparisons, and the common connectors. It stops
before the subjunctive and the literary tenses.

## The two halves of the deck

|                 | Blocks 1–27 (grammar)          | Blocks 28+ (the tail)      |
| --------------- | ------------------------------ | -------------------------- |
| New grammar     | arriving constantly            | essentially none           |
| Ordering        | by hand, card by card          | topic buckets, in volume   |
| Repetition      | hold the frame, drill the form | vary the frame             |
| Risk of drift   | high — the care lives here     | low — the frames are fixed |

## Verb policy

Settled, and the thing the first deck got wrong. In full in
[rules.md](rules.md); the short version:

- A verb enters as a **block**: object on the table → all six forms with the
  object held still → spend it with the persons moving.
- **Every person-form costs a card**, including ones that sound identical.
  Mechanical rules (agreement, plurals, elision) are free and live in the
  explanation.
- A verb is **glossed with its full range on first contact**, so no meaning has
  to be widened later. Widening is a hidden second element — this is what made
  *faire* an i+2 in the first deck.
- Order: **être → avoir → vouloir → pouvoir → devoir → aller → faire.**
  *vouloir* is the hinge; after it, any verb enters at one card.
- Frozen expressions (`il y a`, `ça va`, `il faut`) wait for the verb underneath.

## Writing a block

Work one block of about 40 cards at a time — never more. Continue from the
highest-numbered card in [sentences.md](sentences.md); don't restart. Take the
block's grammar and vocabulary from [roadmap.md](roadmap.md), and check every
word against [vocabulary.md](vocabulary.md) before using it.

Trigger: **"read plan.md and rules.md, then write the next block."**

Then transcribe the block into three files:

- `src/data/elements.ts` — the new learnable units. Data only: surface, gloss,
  and what the unit provides. No prose.
- `src/data/cards.ts` — the sentences.
- `src/data/explanations.ts` — **every word of explanation the learner ever
  sees**, written to the "Explaining" rules in [rules.md](rules.md). This is the
  only place explanation prose lives; nothing else in the app displays it.

Then run the tests: the i+1 validator (`src/engine/i1.ts`) fails if any card
uses a unit that no earlier card taught, and `explanations.test.ts` fails if any
card is missing an explanation or leaves a word of its French unexplained.
