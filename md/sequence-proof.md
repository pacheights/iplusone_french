# Introduction Sequence — proof slice (items 1–30)

A proof-of-concept for the missing piece: a **numbered spine** the generator walks
down one step at a time, instead of improvising order out of the flat theme-organized
dump in [vocabulary.md](vocabulary.md). Each item is fixed in advance; the generator's
only remaining job is to render one natural, grounded sentence introducing item _N_
using only items 1…_N_. That single constraint is what stops full-LLM generation from
wandering — it no longer chooses _what_ to teach, only _how_ to phrase a fixed next step.

Register target: **adult daily life** (coffee, work, being tired, a car, going to work,
being busy) — no "the happy dog eats bread."

Columns per entry: the card (FR — EN), the **new element(s)**, and the rule + what
_rotated or unlocked_ (so variety is enforced by construction, not hoped for).

Legend for the rationale tag: `domain` = topic rotated · `verb` = new engine verb ·
`mood` = statement/question/etc. · `grammar` = new mechanic · `bundle` = a sanctioned
two-part exception · `reach-back` = reuses an earlier card, not just the prior one.

---

## Bootstrap (fragments allowed, cards 1–3 only)

1. **Je…** — _je_ (I) · bootstrap fragment
2. **J'aime…** — _aime_ (aimer, to like — 1sg) · bootstrap fragment · picks a verb of
   _opinion_ as the nexus: regular -er (cheap pronoun swaps) **and** adult (states a
   preference), unlike childish "manger"
3. **J'aime le café.** — I like coffee. — _le, café_ · bootstrap completes · teaches the
   generic-definite ("le café" = coffee-in-general, the correct French pattern) with the
   first noun · `domain: drink`

## Steady state — one new element each, rotating

4. **J'aime le café chaud.** — I like hot coffee. — _chaud_ · attributive adjective
5. **Tu aimes le café ?** — Do you like coffee? — _tu, aimes_ · `bundle` pronoun + its
   agreement · `mood: question`, `person: 2nd`
6. **Je travaille.** — I work. — _travaille_ (travailler) · `verb`, intransitive ·
   `domain: work` — deliberately rotates off drinks so no anchor forms
7. **Je ne travaille pas.** — I don't work. / I'm not working. — _ne…pas_ · `grammar`
   negation, taught early on a known verb so the _only_ new thing is the mechanic
8. **J'ai le café.** — I have the coffee. — _ai_ (avoir) · `verb`, the #2 French verb,
   debuts on a fully known object
9. **J'ai un café.** — I have a coffee. — _un_ · `grammar` indefinite article, taught by
   direct contrast with the "le" from card 3
10. **J'ai un ami.** — I have a friend. — _ami_ · new noun · `domain: people`
11. **C'est un ami.** — He's a friend. — _c'est_ · fixed presentational expression,
    everyday
12. **C'est un professeur.** — He's a teacher. — _professeur_ · new noun ·
    `domain: work/people`
13. **Il est professeur.** — He's a teacher. — _il, est_ · `bundle` pronoun + agreement ·
    être debuts here, and the card teaches the real French split **"il est professeur"
    (no article) vs. "c'est un professeur"** — a known learner stumbling block, not a
    word-swap
14. **Je suis professeur.** — I'm a teacher. — _suis_ · être 1sg on a known frame
15. **Je suis fatigué.** — I'm tired. — _fatigué_ · new adjective on a known copula ·
    `domain: state`
16. **Je suis fatigué et je travaille.** — I'm tired and I'm working. — _et_ · `grammar`
    coordination · `reach-back` 6 + 15 · grounded: tired yet working is a real pairing
17. **Je travaille, mais je suis fatigué.** — I'm working, but I'm tired. — _mais_ ·
    `grammar` contrast · shown right after _et_ so the two connectors contrast · grounded
18. **Je ne travaille pas parce que je suis fatigué.** — I'm not working because I'm
    tired. — _parce que_ · `grammar` causal subordinate clause · `reach-back` 7 + 15
19. **Je veux un café.** — I want a coffee. — _veux_ (vouloir) · `verb`, transitive ·
    `domain: desire`
20. **Je n'ai pas le temps.** — I don't have time. — _temps_ (le temps) · new noun ·
    reuses avoir + negation; one of the most-said adult sentences · `domain: time`
21. **J'ai une voiture.** — I have a car. — _une, voiture_ · `bundle` first feminine
    article + its noun (one-time grammatical-category exception) · `domain: things`
22. **Le café est là.** — The coffee is there. — _là_ · locative adverb on a known frame
23. **Je vais là.** — I'm going there. — _vais_ (aller) · `verb` · `domain: movement` ·
    debuts aller cheaply on the just-taught "là"
24. **Je vais au travail.** — I'm going to work. — _au, travail_ · `bundle` first
    preposition (à, as the contraction au) filling aller's destination slot + its noun ·
    peak daily life
25. **Je fais un café.** — I'm making a coffee. — _fais_ (faire) · `verb`, the #3 French
    verb, on a known object
26. **Qu'est-ce que tu fais ?** — What are you doing? — _qu'est-ce que_ · fixed
    interrogative · `mood: question` · the single most useful daily-life question
27. **Je veux travailler.** — I want to work. — _travailler_ (infinitive) · a distinct
    card from the conjugated "travaille" (per the curriculum's veux/manger rule); the
    infinitive debuts on the known "veux" so a modal can reuse it next
28. **Je ne peux pas travailler.** — I can't work. — _peux_ (pouvoir) · `verb`, modal +
    the now-known infinitive · reuses negation
29. **Où est le café ?** — Where's the coffee? — _où_ · `grammar` interrogative adverb ·
    `mood: question`, on a known frame
30. **Je suis occupé, je ne peux pas.** — I'm busy, I can't. — _occupé_ · new adjective ·
    elliptical real speech · `reach-back` 14 + 28 · closes the slice on natural adult
    register

---

## What this slice demonstrates (vs. the current 50)

- **8 high-frequency verbs in 30 cards** (aimer, travailler, avoir, être, vouloir, aller,
  faire, pouvoir) vs. the current deck leaning on mid-frequency _manger/boire_. The top
  French verbs lead the spine instead of trailing it (`aller` was card 45 before).
- **No single anchor frame.** The current deck orbits "je mange une pomme" ~11 times;
  here the topic rotates every card or two (drink → work → people → state → desire →
  time → things → movement) so no two consecutive cards read alike.
- **Grammar staged one mechanic at a time, each on already-known words:** negation (7),
  the c'est-un-N / il-est-N split (11–14), coordination vs. contrast vs. cause (16–18),
  modal + infinitive (27–28), questions (5, 26, 29).
- **Adult register throughout** — every sentence is something a working adult actually
  says.

These 30 are the front of **Stage A** of the full spine. The whole thing runs to
~1,500 items across four stages (present-tense core → past/future → imparfait &
conditional → the content tail) — see [spine-plan.md](spine-plan.md) for the full map,
sizing, and conjugation schedule.
