# Curriculum

## Mission

Language is learned through **comprehensible input**: material almost entirely
understood, with just enough new to grow from. This app applies **i+1** — every card is
a whole sentence introducing exactly **one** new element on top of the known set, so the
learner infers the new piece from everything around it. Cards build cumulatively: known
set + one addition.

Rationale: [thesis.md](thesis.md). A concrete annotated progression:
[sequence-proof.md](sequence-proof.md). The full sequence and grammar ceiling:
[spine-plan.md](spine-plan.md).

## Card generation algorithm

1. **Bootstrap (first 3–4 cards only).** Build one base sentence token by token; fragments
   are allowed here and nowhere else. Prefer a transitive verb + object over a copula +
   adjective — an SVO frame is a far more generative nexus (swap the subject, verb, or
   object; add an adjective; negate; attach a preposition) than "je suis ___".

2. **Steady state — exactly one new element per card**, with two exceptions:
   - **Tightly coupled pairs:** a pronoun + its verb agreement form ("tu" + "as"), or a
     fixed expression ("est-ce que", "j'ai faim"). Neither half means anything alone.
   - **One-time grammatical-category bootstrap:** the first noun needing a new article
     gender, preposition, or possessive to fill a valence slot may bundle with that
     function word once ("une" + "pomme"); every later noun reuses the now-known word.

   **Never** bundle two independently meaningful content words (two verbs, a verb and its
   object). A pairing that feels inseparable but fits neither exception is an idiom — add
   it to vocabulary.md as a Fixed Expression.

   **Free forms** (don't count as the new element):
   - Agreement inflections once the base is known — "contente" ← "content".
   - The homophonic singular of regular **-er** verbs: je / tu / il-elle-on (mange /
     manges / mange) are one sound, so any one unlocks the set. Plurals stay separate
     ("-ons"/"-ez" are distinct; "-ent" rides in with a new pronoun). **-er only** —
     irregular forms differ audibly (veux/veut, fais/fait) and each cost a card.

   Every steady-state card is a complete, natural sentence — never a bare word.

3. **Reach back.** Pull words from several cards back, not just the prior one — a sub-SRS
   that keeps old vocab resurfacing in new combinations.

4. **Front-load glue words.** Question words, conjunctions, and prepositions arrive early
   and deliberately — they multiply the varieties buildable from known content, so they
   aren't a reward gated behind "enough" vocabulary.

5. **Validate each card:** **i+1** (one new element, or one sanctioned exception) ·
   **Varied** (clause type / valence / mood / form / carrier differs from the preceding
   card(s)) · **Grounded** (below).

## Variety axes

Refilling the same blank isn't variety — "C'est bon. / C'est joli. / C'est mauvais." is
one sentence wearing different words. Rotate across axes:

- **Clause type** — simple → verb complement ("Je veux manger.") → subordinate
  ("...parce que...") → relative ("La pomme que je mange..."). Subordinators have flavors:
  temporal (quand), causal (parce que), conditional (si), concessive (bien que),
  purposive (pour que) — a new conjunction only counts if the *relation* is new.
- **Verb valence** — copula, intransitive, transitive, ditransitive.
- **Mood** — declarative, interrogative, imperative, exclamative. Questions and commands
  are their own axis, not vocabulary poured into statement frames.
- **Form** — affirmative/negative (ne...pas), active/passive, emphatic cleft
  ("C'est mon ami qui...").
- **Carrier** — spread a run of same-part-of-speech vocabulary across several known
  frames, not one ("Il est ___." / "Elle est ___.", not all "C'est ___.").

Rule of thumb: if two consecutive cards differ only by their highlighted word, that's a
variety failure.

## Grounded in reality

Connectors must express a genuine relation. "Je mange une pomme, mais je bois un café."
fails — apple vs. coffee isn't a contrast. "Je veux manger une pomme, mais je bois un
café." works — wanting to eat but drinking instead is a real one.

## Dual mandate

1. **Recombination** — a vocabulary base whose items interchange freely, so review is
   recursive input, not a straight line.
2. **Frequency** — teach the highest-utility words first; cut textbook filler (croissant,
   gâteau) for what makes the language usable immediately.
