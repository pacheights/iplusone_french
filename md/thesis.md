# Thesis

## Core idea

Language is best learned through **comprehensible input**: input that is almost
entirely understandable, with just enough new material to grow from. This app
applies that idea to flashcards using the **i+1** principle — each card
introduces exactly **one** unknown element on top of what the learner already
knows.

## Why sentences, not words

Flashcards traditionally drill isolated words. Isolated words are easy to
memorize but hard to use — they strip away the grammar, word order, and
context that make a language usable. Every card in this app is a **whole
sentence**, with one narrow exception: the very first two cards of the deck
build up to the first complete sentence one token at a time ("je" → "je
suis" → "Je suis fatiguée."). Past that bootstrap, no card is ever a bare
word — the learner is never asked to translate a word in a vacuum; they are
always reading (and hearing) language in the form it's actually used.

## i+1: one new thing per card

Every sentence a learner sees should be **i+1**: comprehensible except for
one new piece — a word, a conjugation, an ending, a function word. Because
only one element is new, the learner can lean on everything else in the
sentence to infer its meaning. This is what turns a flashcard into
comprehensible input rather than a memorization drill.

In practice this means cards build on each other cumulatively. A learner's
known vocabulary only grows by one element at a time, and every new card is
constructed from that known set plus exactly one addition.

Example progression (French):

```
card 1: je
card 2: je suis
card 3: je suis fatiguée
```

By card 3, "je" and "suis" are already known, so "fatiguée" is the only
unknown element — and the whole thing is still a real, usable sentence.

## Spaced repetition

Like any good flashcard system, review is scheduled with **spaced
repetition** (SRS): cards you know well are shown less often, cards you
struggle with come back sooner. This applies at the level of the whole
sentence — repetition reinforces both the new element and everything learned
so far around it.

## Audio

Every card can be **heard**, not just read. A text-to-speech component reads
the sentence aloud in the target language, so the learner builds listening
comprehension alongside reading, and can associate the written form with
correct pronunciation. The learner can choose their preferred **voice** via a
settings control.

## Scope of v1

- Target language: **French** (the only language being built right now).
- A flashcard engine that models cards as sentences with exactly one new
  element each, sequenced so that every prerequisite element has already
  been introduced by an earlier card.
- The first ten cards, hand-built to validate the i+1 progression end to end.
- Web-based text-to-speech playback per card.
- A settings control to choose the TTS voice.
