# Rules for writing a card

A card is one whole French sentence. The learner already knows every part except
one, so they work that one out from the rest. Never a bare word. Never a drill.

Only the very first sentence is built up a word at a time — `Je` → `Je suis` →
`Je suis fatigué`. Fragments are allowed there and nowhere else.

## 1. One new thing

Use only what has been taught, plus exactly one new element.

- Count against everything taught so far, not just the last card.
- Never two new content words on one card.
- A **new meaning** of a known word is a new element. The way to avoid paying
  twice is to gloss a word with its full everyday range on first contact:
  *faire* enters as **"to do / to make"**, not as "to make" that quietly widens
  later. A gloss that has to be widened is a hidden second element.
- Genuinely idiomatic senses are the exception and do get their own card:
  *prendre* = to take, but `prendre un café` = to *have* a coffee.

### What is free, and what is never free

**Free** — a mechanical rule that, once taught, applies everywhere forever. It
rides in the explanation and never costs a card again:

- adjective agreement — `fatigué` → `fatiguée`, `fatigués`, `fatiguées`
- noun plurals — `ami` → `amis`
- elision before a vowel — `j'`, `n'`, `qu'`, `d'`, `c'`
- the ***-er* endings**, once installed — see below

**Never free** — every person-form of an *irregular* verb, earned one card at a
time, *including forms that sound identical*. `veux` and `veut` are the same
sound but different words, and the learner is choosing between written options —
so the choice is real. This is the mistake the first deck made.

The line: agreement is **one rule covering every word in the language**. An
irregular verb form is **one fact about one verb**.

### The *-er* endings

`-e, -es, -e, -ons, -ez, -ent` is one rule covering most verbs in the language,
so it passes the test above and goes free — but only after it has been installed
in full. Two verbs pay for it:

1. **`parler` pays per form.** Five elements, one card each, the way an
   irregular verb enters. This is where the pattern is seen, not stated.
2. **`regarder` pays once and proves it.** One element, five forms riding on
   `free`, and cards for all of them — the transfer is the lesson, so it is
   shown rather than asserted.
3. **Every regular *-er* verb after that costs one element.** Its six forms and
   its infinitive arrive together.

Free means *uncharged*, not *unseen*. A form that costs no element still earns
cards: `nous`, `vous` and `ils` are the persons that go dark first, and a verb
whose plural forms never appear on a card has not been taught, only mentioned.

**The infinitive arrives with the forms here, not before them.** The rule under
"How a verb enters" — that a verb's name comes before its paradigm — holds where
the infinitive cannot be guessed from a form. For a regular *-er* verb it can:
`j'écoute` gives `écouter` mechanically. The panel names it, and the card is
spent on use instead.

**The exceptions are facts and are never free.** A verb whose stem moves is not
in the class, however it ends:

- `manger` → *nous mangeons* (the e stays to keep the g soft)
- `commencer` → *nous commençons* (the cedilla, same reason)
- `appeler` → *j'appelle* (doubled l in four forms of six)
- `préférer` → *je préfère* (the accent flips)
- `payer` → *je paie* or *je paye*, both accepted
- `aller` is not regular at all, whatever its ending says

`manger`, `payer` and `appeler` are already in the deck as infinitives. Each owes
a card of its own before its forms may be used.

### A verb costs one element and earns several cards

Charging once for a verb is about the *ending*, not about the word. A meaning is
learned by meeting it in different sentences, so a new verb wants three or four
uses across the block — different persons, a question, a negative, a different
object — not one card and a note. One card per verb is the floor on cost, never
the ceiling on practice.

## 2. A small step from the last card

Each card is one nameable move from the card before it — insert a word, swap a
word, change the person, add to the end. If you can't name the move, the step is
too big.

Rule 1 asks *one new thing vs. everything known*. Rule 2 asks *how far from the
previous card*. Both must hold.

## 3. Clarity beats variety

Teaching a form clearly is worth more than an interesting sentence. During a
paradigm drill the object is held **deliberately still** so the only thing moving
is the person — that is the lesson, not laziness.

A card that teaches nothing (`[rest]`) is allowed when it drills a form just
taught, or sets up the next card. Swapping vocabulary inside an unchanged frame
while teaching nothing is not a card: not `J'ai faim` / `J'ai soif` back to back.

## 4. Bring old words back

When a card has an open slot, the default filler is the **stalest word that
fits** — the one silent longest — not the handiest one. Override only when the
stale word would make a sentence nobody would say.

Left as *"sometimes"*, this inverts. Across blocks 1–5 the share of elements that
ever reappeared in a **later** block fell 83% → 55% → 47% → 33%, while the same
twenty-odd scaffolding words (`je`, `est-ce que`, `ne … pas`, `ici`, `on`,
`c'est`, `manger`) were reached for in every block. The capacity was never
missing — each block already touches about 40% of the inventory. It was spent on
the same half twice.

`npm run reuse` prints the ledger, longest-silent first. Read it before writing a
block; the top of the list is what that block's open slots are for.

### What the SRS covers, and what it can't

FSRS schedules **cards, not words** ([srs.ts](../src/engine/srs.ts)). A word
living in one card rides that card's interval out to months, and the blank never
moves — so the learner ends up able to complete one sentence rather than able to
use the word.

That is enough where the whole skill is **recall**: `content`, `libre`, `boire`,
`deux`, `merci`. Let the scheduler have them. They cost no cards.

It is not enough where the skill is **choice**, because a choice is only
exercised against alternatives and one card offers none. Four classes, and they
are the four that actually died:

- **verb person-forms** — the skill is picking `ont` over `sont` over `a`.
  Recognising `ont` is worth nothing. `nous` and `ils` are the casualties, alive
  only inside their own paradigm drill.
- **articles** — `des` / `du` / `de` is decided again on every noun. `des` last
  appeared on card 59; the partitive once in the last seventy cards.
- **constructions** — `avoir besoin de`, `il y a`, `un peu de`, `pour` +
  infinitive. The surface may be an ordinary noun, but the skill is assembly:
  choose `avoir`, keep the `de` that never drops, collapse the partitive behind
  it.
- **connectors** — `et`, `ou`, `mais` exist to join something *new*, so a
  connector inside a frozen sentence is not functioning as one.

The test is **retrieve or assemble**. Retrieved words are the scheduler's.
Assembled ones are the deck's, and only those go on the clock — putting all
vocabulary on it would make the deck unwritable by block 12.

An assembled element is marked `clock` in [elements.ts](../src/data/elements.ts)
as it is written. Conjugated forms need no mark; they are recognised from their
gloss.

### The quotas

Every block from 6 on, enforced by [reuse.ts](../src/engine/reuse.ts):

- **two earlier verbs** re-conjugated at `nous` / `vous` / `ils`
- **one `des`, one partitive, one `de` under `ne … pas`**
- **`et`, `ou`, `mais`** each at least once

None of these asks for a contrived sentence — they ask that slots you were
filling anyway take the stale word instead of the fresh one. Blocks 1–5 are
grandfathered; the deck is not rewritten backwards.

The verb quota is general: a form is recognised from its gloss, so every verb
joins the clock as it is taught, and `allons` / `prenons` need no entry here. The
article and connector quotas are literal lists — articles because that system is
closed, connectors because it is not: `donc`, `alors`, `si` and the
`ne … plus / jamais / rien` family arrive in blocks 24–25 and will need adding.

**Constructions are on the clock but not yet under a quota.** Marked `clock`,
they surface in `npm run reuse`; there is no hard check until the marked set is
large enough to be worth one. `avoir besoin de` is the writer's obligation, not
the validator's.

## How a verb enters

Every verb gets a **block**, always the same shape:

1. **Put the object on the table.** One card introducing whatever noun or
   adjective the drill needs, built with a verb already known.
2. **The six forms, object held still.** Nine cards — one per subject pronoun,
   since *il/elle* and *ils/elles* share a form but not a pronoun. `on` is
   always included.
3. **Spend it.** Real sentences with the persons and objects both moving,
   plus negation and questions on the new verb.

Order of the essential verbs: **être → avoir → vouloir → pouvoir → devoir →
aller → faire.** *vouloir* is the hinge — once `Je veux + infinitive` exists,
every remaining verb in French enters at one card each.

**The infinitive comes before the forms.** It is the name of the verb — what the
panel calls the conjugated form by, and what a dictionary lists — so a card
teaching `vais` should not be the learner's first sight of *aller*. Where a verb
needs both, the infinitive goes on a setup card behind a conjugated verb already
known (`Je veux aller au travail`), and the paradigm follows. Most verbs never
need the second half here: the fifteen infinitives of blocks 3–5 wait for their
conjugation until blocks 8–12, and *être, avoir, vouloir, pouvoir, devoir* are
so far only ever conjugated.

"Auxiliary" is reserved for **être and avoir** in compound tenses. *aller* is a
semi-auxiliary, *vouloir / pouvoir / devoir* are modals, *faire* is neither.
Call the group the **essential verbs**.

## Frozen expressions wait for their verb

`ça va`, `il y a`, `il faut`, `je voudrais` are learned whole, not taken apart.
But a frozen expression only enters **after the verb underneath it has been
taught**, so it lands as a shortcut rather than an opaque blob — `il y a` comes
after avoir, `ça va` after aller.

## Questions

- ***Est-ce que* is the default** and carries most questions. It is a prefix: it
  turns any known statement into a question and changes nothing else.
- **Intonation** — the statement with a rise, `Vous êtes occupé ?`. Costs
  nothing after the first one, so use it freely.
- **Inversion** — only where it is genuinely how the question is asked:
  `Où est … ?` · `Comment allez-vous ?` · `Quelle heure est-il ?` ·
  `Pouvez-vous …?` Never invent one to drill the pattern.

Aim for about a quarter of each block to ask something.

## Keep the persons moving

- ***je* under about a quarter of a block.**
- ***on* is a focus.** It is what French speakers actually say for "we", so it
  earns cards in every block, not an occasional appearance.
- *tu* and *vous* both belong. Choose per sentence and hold it; never mix the two
  inside one card.

### Not everything doing a verb is a person

**A quarter of every block, at least, opens on something that is not a person —
and at least four of those cards on a plain noun.** Enforced from block 11 by
[reuse.ts](../src/engine/reuse.ts); `npm run reuse` prints the mix per block.

Two kinds count:

- **impersonal** — `c'est`, `ça`, `il y a`, `il faut`, `il fait` of the weather.
  The `il` in the last three stands for nobody.
- **a plain noun** — `le bus est en retard`, `le café est chaud`, `mon ami va à
  l'école`. This is the one that goes missing.

Left as "a real share" this inverted, exactly as rule 4 did. Across blocks 1–10
the non-person share ran 23% · 15% · 3% · 17% · 34% · 28% · 30% · 13% · 5% · 0%,
and nine cards in three hundred and seventy-five opened on a plain noun — three
of them the same bus.

A paradigm block explains some of that: nine persons past one held-still object
is nine pronouns by construction. It does not explain the free slots, which went
to pronouns too. The habit being missed is putting a thing in front of a verb,
and a learner who has only ever said `je` and `il` has to build it later against
everything the deck taught them.

## Explaining

Every card has an explain button: any word on it can be looked up, and a
conjugated verb always shows its infinitive.

- **The card stays clean; the panel carries the load.** The sentence teaches one
  form; the panel shows the whole written paradigm.
- **Explain in isolation.** No "you already know" and no "you'll meet this
  later" — the note has to stand on its own.
- **Name the verb.** If a form belongs to a verb, the note says which.
- **Name the part, then explain it.** Every note opens with what kind of word
  this is and what it means in English — *"This is a possessive adjective
  meaning your"* — and then says how it behaves in French. Labels stay ordinary
  (subject pronoun, noun, adjective, infinitive, conjunction, preposition);
  never *second person singular present indicative*.
- **Put it in English terms, but only where it earns its place.** The reader is
  an English speaker, so name the English habit that would otherwise produce a
  mistake: English drops a word French keeps (`des amis` → "friends"), English
  needs an extra verb French does without (`tu as … ?` → "do you have …?"),
  English leaves to context what French has to choose (`du café` / `un café`).
  Where the two agree, say nothing — *"exactly as in English"* is not a fact
  about French. And never make the same point twice on one card.

## The English line

The English is the prompt the learner builds the French from, so it should be
the **closest natural English** — as near word-for-word as it can get without
sounding stilted. Match the French word count wherever English allows it.

- **Contract exactly where the French contracts.** `c'est` folds *ce* and *est*
  into one token, so the English folds the same two words: *It's here*,
  *That's it*. Where the French stays open, so does the English — `On est ici`
  is *We are here*, not *We're here*, three words to three with `est` sitting
  under `are`. This also keeps the highlight whole: the English counterpart of
  the new element has to be a word, and `We're` can't be cut in half.
  - The negative un-contracts in both languages at once: French says
    `ce n'est pas`, not *c'n'est pas*, so the English is *It is not here*.
  - `j'ai` is the one exception: English has no natural contraction for
    possession (*I've a car* is not English), so `J'ai une voiture` stays
    *I have a car*.
- **Contract what French does not say at all.** The rule above is about French
  words; this one is about the English word that has none. `Je vais au travail`
  is *I'm going to work*: `vais` alone carries *am going*, so nothing is left to
  sit under a standing-alone *am*, and it folds onto the subject — four words to
  four. Where a French word does sit under it, the English stays
  open: `Je suis fatigué` is *I am tired*, and `Je vais bien` is *I am well*,
  because there `vais` is exactly what *am* translates.
  - The contraction swallows the auxiliary, so the highlight lands on what is
    left of the counterpart: *going*, not *am going*.
  - A noun subject stays open. *My friend's going to school* reads as a
    possessive on the page, so `Mon ami va à l'école` is *My friend is going to
    school* even though nothing sits under *is*.
  - An inverted question has nothing to contract onto: `Est-ce que tu vas à la
    maison ?` is *Are you going home?*
- **The *to* in front of an infinitive belongs to the infinitive**, unless the
  word in front of it has already claimed it. `Je veux manger` is *I want
  **to eat***, and `Je vais manger` is *I'm **going** to eat*: `vais` is
  *going*, and the *to* is what makes *eat* an infinitive.
  - It is claimed when the French word is itself glossed with a *to*. `dois` is
    *have to*, so `Je dois travailler` bolds *I have to **work***; likewise
    `il faut` (*one has to*) and `pour` (*in order to*).
  - After `pouvoir` the question doesn't arise — English says *I can **work***,
    with no *to* anywhere.
- **Leave *don't* / *doesn't* alone.** English do-support has no French
  counterpart, so there is no word to align it to, and *I do not have a car*
  reads as emphasis rather than a plain statement.
- **Translate the partitive only when it is the answer.** `du / de la / de l'`,
  and the `de` a negative collapses them into, are compulsory in French and
  optional in English. *We want some bread* teaches the opposite: it makes the
  French word look droppable when English is the language doing the dropping.
  The card says what English says — *We want bread* — and the French carries a
  word the English does not account for.
  - The exception is the card whose gap **is** that article, where the prompt
    has to stay answerable: nothing else would tell the learner to write
    `du café` rather than `un café`. There *some* stays and is set in italics
    (`gi` in [cards.ts](../src/data/cards.ts)), and the italics say the one
    thing that is true of it — French makes you say this word. Cards 58, 88, 91,
    92 and 261 are the five that carry it today; any later card that blanks an
    article carries it too.
- **Stop where the languages genuinely part.** `Il a faim` is *He is hungry*;
  there is no closer English, and *He has hunger* is not English. Alignment is
  the goal only up to the point where it costs grammar.

The panel is where the mismatch gets named. The card line stays plain English.

## What the voice says is not what the screen shows

The learner always **reads** standard written French, and **hears** what a French
speaker actually says: `Je suis fatigué` is spoken *chuis fatigué*, `Je mange` is
*j'mange*, and `ne` disappears from `ne … pas`. The reductions are derived
automatically ([speech.ts](../src/engine/speech.ts)); a card can override them
with its own `speech` field.

Write sentences that survive this. If a card's whole teaching point vanishes in
the spoken form, it is the wrong card.

## And always

- **Adult and real** — a grown-up's everyday life, not a children's book. That's
  a register, not a filter: never skip a common word because it isn't "adult".
- **Something a person would actually say.** A connector has to mean something:
  "I want to eat but I'm drinking coffee" is a real contrast; "I ate bread
  because I drive a car" is not.
- **Known words only** — every word from [vocabulary.md](vocabulary.md), none
  invented.

## The whole check, in one line

Per card: one new thing · one nameable step · repetition that earns its place ·
old words pulled back in · real adult French · known words plus one.

Per block: object on the table, six forms held still, then spent · a quarter of
the cards ask · *est-ce que* carries them · *je* under a quarter · *on* present ·
a quarter not a person, four of them plain nouns · two earlier verbs at
*nous/vous/ils* · `des`, a partitive, `de` under negation · `et`, `ou`, `mais`.
