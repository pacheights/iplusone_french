/**
 * Written French → what a French speaker actually says.
 *
 * The learner always *sees* standard written French; only the audio reduces, so
 * they train their ear on the real thing rather than on a careful reading voice.
 * `Il y a du pain` is spoken "Y'a du pain"; `Je ne parle pas` is "J'parle pas".
 *
 * These are the everyday reductions of ordinary spoken French — not slang, and
 * not regional. Each rule below is one of them. The output is a phonetic steer
 * for the TTS voice, never shown on screen.
 *
 * A card can override the result entirely with its own `speech` field, which is
 * the escape hatch for anything these rules don't cover (e.g. the silent plural
 * `-ent` in "Ils parlent" → "I parle", which needs verb morphology to spot).
 */

/** Letters that count as consonants for elision/reduction purposes. */
const CONSONANTS = 'bcdfgjklmnpqrstvwxz'

/** A negation word whose presence means the `ne` in front of the verb is dropped. */
const NEGATION = /\b(pas|rien|jamais|plus|personne)\b/i

/** Guard so `s'il`, `qu'il` are never reduced — only a standalone subject pronoun is. */
const notAfterApostrophe = "(?<!['’])"

export function spokenForm(written: string): string {
  let out = written

  // 1. Dropped `ne`. Spoken French keeps only the second half of the negation:
  //    "je ne sais pas" → "je sais pas". Applied per clause so a sentence with a
  //    negated half and a plain half only loses the `ne` in the negated one.
  out = out
    .split(/([,;.!?])/)
    .map((clause) =>
      NEGATION.test(clause) ? clause.replace(/\bne /gi, '').replace(/\bn'/gi, '') : clause,
    )
    .join('')

  // 2. `il y a` loses its subject entirely — the single most common reduction.
  out = out.replace(/\bil y en a/gi, "y'en a").replace(/\bil y a/gi, "y'a")

  // 3. Impersonal `il faut` likewise drops the `il`.
  out = out.replace(/\bil faut\b/gi, 'faut')

  // 4. `je suis` / `je sais` collapse to one syllable. These two are lexicalised
  //    ("chuis", "chais") rather than a plain schwa drop, so they come first.
  out = out.replace(/\bje suis\b/gi, 'chuis').replace(/\bje sais\b/gi, 'chais')

  // 5. Elision. Before a vowel this is just standard written elision that the
  //    dropped `ne` above re-exposed ("je n'en veux pas" → "je en" → "j'en");
  //    before a consonant it's the spoken schwa drop ("je parle" → "j'parle").
  //    Both land on the same form, so one rule covers them.
  out = out.replace(/\bje (?=\S)/gi, "j'")
  out = out.replace(/\bce (?=[aeéèêiouy])/gi, "c'")
  out = out.replace(/\btu (?=[aeéèêiouyh])/gi, "t'")

  // 6. Subject `il`/`ils` lose their l before a consonant: "il parle" → "i parle".
  out = out.replace(new RegExp(`${notAfterApostrophe}\\bils? (?=[${CONSONANTS}])`, 'gi'), 'i ')

  // 7. `elle`/`elles` reduce to a bare vowel the same way.
  out = out.replace(new RegExp(`${notAfterApostrophe}\\belles? (?=[${CONSONANTS}])`, 'gi'), 'è ')

  // 8. `il est` keeps its l (the t liaises into nothing) but the vowel opens.
  out = out.replace(/\bil est\b/gi, 'il è')

  // Replacements are written lowercase; restore the sentence's opening capital.
  return out.replace(/^(\s*)(\p{L})/u, (_, space, letter) => space + letter.toUpperCase())
}
