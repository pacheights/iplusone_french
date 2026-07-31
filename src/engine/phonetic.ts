/**
 * Spoken French → how to say it with English spelling.
 *
 * This is the third line of a card, between the French and the English: what
 * the learner just heard, written so an English reader can say it back. It is
 * derived from the *spoken* form (engine/speech.ts), never from the written
 * one, so the page always agrees with the voice — "Je suis fatigué" is heard
 * "chuis fatigué" and read "shuis fa-tee-gay".
 *
 * Every sound is looked up, not spelled out by rule: French orthography is too
 * far from its pronunciation for a letter-by-letter transcription to be worth
 * reading. The deck is a closed vocabulary, so a table covers it exactly, and
 * phonetic.test.ts fails if a card ever uses a word the table doesn't have.
 *
 * Spelling conventions, chosen so an English reader lands on the right vowel:
 *   ew   the French u  (tu → tew, une → ewn)
 *   zh   the French j  (je → zhuh, manger → mahn-zhay)
 *   ahn / ohn / an / uhn   the four nasal vowels of en, on, pain, un
 * Syllables are hyphenated inside a word; the words themselves stay separate.
 */

interface Sound {
  /** How the word reads on its own. */
  say: string
  /**
   * How it reads when the next word starts with a vowel. French runs the two
   * together — a consonant that is silent alone reappears and attaches to the
   * front of the next word ("vous êtes" → voo-zet) — so this form is written to
   * end in that consonant and is concatenated straight onto what follows.
   */
  beforeVowel?: string
}

/**
 * Keyed by the spoken French, lowercased. A key of several words is matched
 * before its parts, which is how a phrase said as one word gets written as one:
 * "est-ce que" is /ɛskə/, not "est-ce" then "que".
 */
const SOUNDS: Record<string, string | Sound> = {
  a: 'ah',
  aider: 'eh-day',
  ami: 'a-mee',
  amis: 'a-mee',
  aussi: 'oh-see',
  avec: 'a-veck',
  avez: 'a-vay',
  avons: 'a-vohn',
  besoin: 'buh-zwan',
  bien: 'byan',
  boire: 'bwahr',
  bus: 'bews',
  "d'accord": 'da-kor',
  "c'est": { say: 'say', beforeVowel: 'say-t' },
  café: 'ka-fay',
  chose: 'shohz',
  chuis: 'shuis',
  content: 'kohn-tahn',
  "d'eau": 'doh',
  "d'une": 'dewn',
  de: 'duh',
  des: { say: 'day', beforeVowel: 'day-z' },
  deux: { say: 'duh', beforeVowel: 'duh-z' },
  du: 'dew',
  elle: { say: 'ell', beforeVowel: 'e-l' },
  elles: { say: 'ell', beforeVowel: 'ell-z' },
  en: 'ahn',
  ensemble: 'ahn-sahmbl',
  entrer: 'ahn-tray',
  est: { say: 'ay', beforeVowel: 'ay-t' },
  "est-ce que": 'ess-kuh',
  "est-ce qu'elle": { say: 'ess-kell', beforeVowel: 'ess-ke-l' },
  "est-ce qu'il": { say: 'ess-keel', beforeVowel: 'ess-kee-l' },
  "est-ce qu'on": { say: 'ess-kohn', beforeVowel: 'ess-koh-n' },
  "est-ce qu'y'a": 'ess-kya',
  et: 'ay',
  faim: 'fan',
  fatigué: 'fa-tee-gay',
  fatiguée: 'fa-tee-gay',
  fatigués: 'fa-tee-gay',
  fatiguées: 'fa-tee-gay',
  i: 'ee',
  ici: 'ee-see',
  il: { say: 'eel', beforeVowel: 'ee-l' },
  ils: { say: 'eel', beforeVowel: 'eel-z' },
  "j'ai": 'zhay',
  "j'veux": 'zhvuh',
  "j'peux": 'zhpuh',
  je: 'zhuh',
  "l'eau": 'loh',
  la: 'la',
  là: 'la',
  le: 'luh',
  libre: 'leebr',
  ma: 'ma',
  maintenant: 'mant-nahn',
  mais: 'may',
  malade: 'ma-lad',
  malades: 'ma-lad',
  manger: 'mahn-zhay',
  merci: 'mer-see',
  mon: { say: 'mohn', beforeVowel: 'moh-n' },
  nous: { say: 'noo', beforeVowel: 'noo-z' },
  occupé: 'oh-kew-pay',
  occupés: 'oh-kew-pay',
  non: 'nohn',
  oui: 'wee',
  on: { say: 'ohn', beforeVowel: 'oh-n' },
  ont: { say: 'ohn', beforeVowel: 'ohn-t' },
  ou: 'oo',
  où: 'oo',
  pain: 'pan',
  partir: 'par-teer',
  parler: 'par-lay',
  pas: { say: 'pah', beforeVowel: 'pah-z' },
  peu: 'puh',
  peut: { say: 'puh', beforeVowel: 'puh-t' },
  "peut-être": 'puh-tetr',
  peuvent: { say: 'puhv', beforeVowel: 'puhv-t' },
  peux: 'puh',
  pour: 'poor',
  pouvez: { say: 'poo-vay', beforeVowel: 'poo-vay-z' },
  "pouvez-vous": { say: 'poo-vay-voo', beforeVowel: 'poo-vay-voo-z' },
  pouvons: 'poo-vohn',
  problème: 'pro-blem',
  que: 'kuh',
  "qu'elle": 'kell',
  "qu'il": { say: 'keel', beforeVowel: 'kee-l' },
  "qu'on": { say: 'kohn', beforeVowel: 'koh-n' },
  "qu'y'a": 'kya',
  quelque: 'kel-kuh',
  retard: 'ruh-tar',
  regarder: 'ruh-gar-day',
  rester: 'res-tay',
  "s'il vous plaît": 'seel-voo-play',
  sortir: 'sor-teer',
  soif: 'swaf',
  sommes: 'som',
  sont: { say: 'sohn', beforeVowel: 'sohn-t' },
  "t'as": 'ta',
  "t'es": 'tay',
  temps: 'tahn',
  travailler: 'tra-va-yay',
  très: { say: 'tray', beforeVowel: 'tray-z' },
  tu: 'tew',
  un: { say: 'uhn', beforeVowel: 'uh-n' },
  une: 'ewn',
  veulent: 'vuhl',
  veut: 'vuh',
  veux: 'vuh',
  viande: 'vyahnd',
  voiture: 'vwa-tewr',
  voulez: 'voo-lay',
  voulons: 'voo-lohn',
  vous: { say: 'voo', beforeVowel: 'voo-z' },
  "y'a": 'ya',
  ça: 'sa',
  è: 'eh',
  êtes: { say: 'et', beforeVowel: 'et-z' },
}

/** The longest key in the table, i.e. how far ahead a phrase match must look. */
const MAX_PHRASE = Math.max(...Object.keys(SOUNDS).map((k) => k.split(' ').length))

/** A word of the spoken form, with any punctuation hanging off it kept aside. */
interface Word {
  lead: string
  core: string
  trail: string
}

const SPLIT = /^([^\p{L}]*)(.*?)([^\p{L}]*)$/u

/** Which of our spellings count as starting with a vowel, for the liaison rule. */
const VOWEL = /^[aeiou]/

function split(word: string): Word {
  const [, lead = '', core = '', trail = ''] = SPLIT.exec(word) ?? []
  return { lead, core, trail }
}

function sound(key: string): Sound | undefined {
  const entry = SOUNDS[key]
  if (entry === undefined) return undefined
  return typeof entry === 'string' ? { say: entry } : entry
}

/** One resolved unit: a word (or phrase) and the punctuation around it. */
interface Unit extends Word {
  sound: Sound
  /** True when nothing in the table matched — surfaced by the coverage test. */
  unknown?: boolean
}

/** Match the table against the words, longest phrase first. */
function units(words: Word[]): Unit[] {
  const out: Unit[] = []

  for (let i = 0; i < words.length; ) {
    let taken = 0

    for (let n = Math.min(MAX_PHRASE, words.length - i); n >= 1 && !taken; n--) {
      const slice = words.slice(i, i + n)
      // A phrase is only one thing if nothing punctuates its middle.
      if (slice.some((w, k) => (k > 0 && w.lead) || (k < n - 1 && w.trail))) continue
      const found = sound(slice.map((w) => w.core.toLowerCase()).join(' '))
      if (!found) continue
      out.push({ sound: found, lead: slice[0].lead, core: '', trail: slice[n - 1].trail })
      taken = n
    }

    if (!taken) {
      // Unknown word: fall through with the French itself rather than dropping
      // it, so a gap in the table costs the learner a line they can't read
      // rather than a sentence with a hole in it.
      out.push({ ...words[i], sound: { say: words[i].core }, unknown: true })
      taken = 1
    }

    i += taken
  }

  return out
}

/**
 * The English-spelled pronunciation of an already-reduced French sentence.
 * Feed it `cardSpeech(card)`, not the written French.
 */
export function phoneticForm(spoken: string): string {
  const list = units(spoken.replace(/’/g, "'").split(/\s+/).filter(Boolean).map(split))

  let out = ''
  list.forEach((unit, i) => {
    const next = list[i + 1]
    // The liaison consonant belongs to the next word, so the two are written
    // with no space between them — that is what the learner hears.
    const runs = Boolean(
      unit.sound.beforeVowel && next && !unit.trail && !next.lead && VOWEL.test(next.sound.say),
    )
    out += unit.lead + (runs ? unit.sound.beforeVowel : unit.sound.say) + unit.trail
    if (next && !runs) out += ' '
  })

  return out
    // French leaves a space before ? and ! ; the phonetic line is read as
    // English, so it closes up.
    .replace(/\s+([?!;:])/g, '$1')
    .replace(/^(\s*)(\p{L})/u, (_, space, letter) => space + letter.toUpperCase())
}

/** Words of a spoken form that the table has no sound for. Used by the tests. */
export function unknownWords(spoken: string): string[] {
  return units(spoken.replace(/’/g, "'").split(/\s+/).filter(Boolean).map(split))
    .filter((unit) => unit.unknown && unit.core)
    .map((unit) => unit.core.toLowerCase())
}
