/**
 * Per-card sentence explanations, shown in the "Explain" modal on the reveal
 * side of a flashcard. Static text generated with Claude and baked in — no API
 * call at runtime — keyed by card id.
 *
 * Each value is a small markdown subset the modal renderer understands:
 *   - blank line          → new paragraph
 *   - lines beginning "- " → a bullet list
 *   - **double asterisks** → bold
 *
 * The Explain button only appears for cards that have an entry here, so this map
 * can be filled in incrementally without breaking any card.
 */
export const EXPLANATIONS: Record<string, string> = {
  c1: `**Je** means **"I"** — the first-person singular subject pronoun.

It's how you refer to yourself as the one doing the action. On its own it isn't a full sentence yet — it's the subject, waiting for a verb such as **veux** ("want").`,

  c2: `**"Je veux"** means **"I want."**

- **Je** — "I", the subject pronoun.
- **veux** — "want", the je/tu form of the verb **vouloir** (to want).

French verbs change their ending with the subject. With **je** (and **tu**), **vouloir** becomes **veux**. Subject + verb is already a complete little sentence: "I want."`,

  c3: `**"Je veux un"** means **"I want a…"** — an unfinished sentence building toward a noun.

- **Je** — "I".
- **veux** — "want" (**vouloir**, je form).
- **un** — "a / an", the masculine indefinite article.

**un** goes before a masculine noun and signals one is coming next (like **café**). The feminine form is **une**.`,

  c4: `**"Je veux un café"** means **"I want a coffee."**

- **Je** — "I", the subject.
- **veux** — "want", the je form of **vouloir**.
- **un** — "a", the masculine indefinite article.
- **café** — "coffee", a masculine noun (le café).

The structure is **subject + verb + article + noun**. Because **café** is masculine, its article is **un** rather than **une**.`,

  c5: `**"Je veux boire un café"** means **"I want to drink a coffee."**

- **Je veux** — "I want" (**vouloir**, je form).
- **boire** — "to drink", an infinitive.
- **un café** — "a coffee".

When two verbs meet, the second stays in the infinitive: **je veux boire** = "I want to drink." **boire** isn't conjugated here — **veux** already carries the subject.`,

  c6: `**"Je veux boire quelque chose"** means **"I want to drink something."**

- **Je veux** — "I want".
- **boire** — "to drink" (infinitive).
- **quelque chose** — "something", a fixed two-word phrase.

**quelque chose** always travels together and never changes form. Same infinitive pattern as before: **veux** + **boire**.`,

  c7: `**"Vous voulez boire quelque chose ?"** means **"Do you want to drink something?"**

- **Vous** — "you" (formal, or more than one person).
- **voulez** — "want", the **vous** form of **vouloir**.
- **boire quelque chose** — "to drink something".

With **vous**, **vouloir** takes the **-ez** ending: **vous voulez**. There's no separate word for "do" — the question is made by the question mark and a rising tone. Note the French space before the **?**.`,

  c8: `**"Vous voulez du café ?"** means **"Do you want some coffee?"**

- **Vous voulez** — "you want" (**vouloir**, vous form).
- **du** — "some", the masculine partitive article.
- **café** — "coffee" (masculine).

**du** means "some / an unspecified amount of" a masculine thing: **du café** = "some coffee." It's really **de + le** squeezed together.`,

  c9: `**"Je veux du pain"** means **"I want some bread."**

- **Je veux** — "I want".
- **du** — "some" (masculine partitive).
- **pain** — "bread", a masculine noun (le pain).

Use **du** for an unspecified amount of a masculine noun: **du pain** = "some bread."`,

  c10: `**"J'aime boire"** means **"I like to drink."**

- **J'** — "I". Before a vowel, **je** drops its **e** and joins on: **je aime → j'aime**.
- **aime** — "like / love", the je form of **aimer**.
- **boire** — "to drink" (infinitive).

**aimer** followed by an infinitive expresses liking to do something: **j'aime boire** = "I like to drink."`,

  c11: `**"J'aime manger"** means **"I like to eat."**

- **J'aime** — "I like" (**aimer**, je form, elided before the vowel).
- **manger** — "to eat" (infinitive).

Same pattern as **j'aime boire**: **aimer** + an infinitive = liking to do that action.`,

  c12: `**"J'aime le pain"** means **"I like bread"** (bread in general).

- **J'aime** — "I like".
- **le** — "the", the masculine definite article.
- **pain** — "bread" (masculine).

Here **le** doesn't point to a specific loaf. With **aimer**, the definite article marks the whole category: **j'aime le pain** = "I like bread (in general)." English drops the "the"; French keeps it.`,

  c13: `**"J'aime manger du pain avec du café"** means **"I like to eat bread with coffee."**

- **J'aime** — "I like".
- **manger** — "to eat" (infinitive).
- **du pain** — "some bread" (masculine partitive).
- **avec** — "with".
- **du café** — "some coffee".

**avec** ("with") links the two things. Both **pain** and **café** are masculine, so both take the partitive **du**.`,

  c14: `**"J'aime boire de l'eau"** means **"I like to drink water."**

- **J'aime** — "I like".
- **boire** — "to drink".
- **de l'** — "some", the partitive before a vowel.
- **eau** — "water", a feminine noun (l'eau).

Before a vowel the partitive isn't **du** or **de la** — it becomes **de l'**: **de l'eau** = "some water," gliding straight into **eau**.`,

  c15: `**"J'aime boire du café et de l'eau"** means **"I like to drink coffee and water."**

- **J'aime boire** — "I like to drink".
- **du café** — "some coffee" (masculine).
- **et** — "and".
- **de l'eau** — "some water" (feminine, before a vowel).

**et** ("and") joins the two drinks. Each keeps its own partitive: **du** for masculine **café**, **de l'** for **eau** (vowel start).`,
}
