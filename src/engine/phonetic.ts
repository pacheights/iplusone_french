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
  acheter: 'ash-tay',
  achetez: 'ash-tay',
  achetons: 'ash-tohn',
  achète: 'a-shet',
  achètent: 'a-shet',
  aider: 'eh-day',
  aime: 'em',
  aimons: 'ay-mohn',
  aller: 'a-lay',
  allez: 'a-lay',
  "allez-vous": 'a-lay-voo',
  allons: 'a-lohn',
  ami: 'a-mee',
  amis: 'a-mee',
  appeler: 'ap-lay',
  appelez: 'a-play',
  appelle: 'a-pel',
  appellent: 'a-pel',
  appelons: 'a-plohn',
  argent: 'ar-zhahn',
  arrive: 'a-reev',
  arrivent: 'a-reev',
  arrivez: 'a-ree-vay',
  arrête: 'a-ret',
  arrêtent: 'a-ret',
  arrêtez: 'a-re-tay',
  assez: 'a-say',
  au: 'oh',
  "aujourd'hui": 'oh-zhoor-dwee',
  aussi: 'oh-see',
  avec: 'a-veck',
  avez: 'a-vay',
  avons: 'a-vohn',
  beau: 'boh',
  beaucoup: 'boh-koo',
  besoin: 'buh-zwan',
  bien: 'byan',
  boire: 'bwahr',
  bureau: 'bew-roh',
  bus: 'bews',
  "c'est": { say: 'say', beforeVowel: 'say-t' },
  café: 'ka-fay',
  chaud: 'shoh',
  chercher: 'sher-shay',
  chose: 'shohz',
  chuis: 'shuis',
  commence: 'ko-mahns',
  commencent: 'ko-mahns',
  commences: 'ko-mahns',
  commencez: 'ko-mahn-say',
  comment: { say: 'ko-mahn', beforeVowel: 'ko-mahn-t' },
  commençons: 'ko-mahn-sohn',
  content: 'kohn-tahn',
  cuisine: 'kwee-zeen',
  "d'accord": 'da-kor',
  "d'argent": 'dar-zhahn',
  "d'eau": 'doh',
  "d'une": 'dewn',
  de: 'duh',
  demain: 'duh-man',
  demander: 'duh-mahn-day',
  des: { say: 'day', beforeVowel: 'day-z' },
  deux: { say: 'duh', beforeVowel: 'duh-z' },
  devez: 'duh-vay',
  devons: 'duh-vohn',
  dois: 'dwah',
  doit: 'dwah',
  doivent: 'dwahv',
  donne: 'don',
  donnez: 'do-nay',
  du: 'dew',
  déjà: 'day-zha',
  elle: { say: 'ell', beforeVowel: 'e-l' },
  elles: { say: 'ell', beforeVowel: 'ell-z' },
  en: 'ahn',
  ensemble: 'ahn-sahmbl',
  entrer: 'ahn-tray',
  essaient: 'e-say',
  essayer: 'e-say-yay',
  essayez: 'e-say-yay',
  essayons: 'e-say-yohn',
  est: { say: 'ay', beforeVowel: 'ay-t' },
  "est-ce qu'elle": { say: 'ess-kell', beforeVowel: 'ess-ke-l' },
  "est-ce qu'elles": 'ess-kell',
  "est-ce qu'il": { say: 'ess-keel', beforeVowel: 'ess-kee-l' },
  "est-ce qu'ils": 'ess-keel',
  "est-ce qu'on": { say: 'ess-kohn', beforeVowel: 'ess-koh-n' },
  "est-ce qu'y'a": 'ess-kya',
  "est-ce que": 'ess-kuh',
  et: 'ay',
  faim: 'fan',
  faire: 'fair',
  fais: 'fay',
  faisons: 'fuh-zohn',
  fait: 'fay',
  "fait-il": 'fay-teel',
  faites: 'fet',
  fatigué: 'fa-tee-gay',
  fatiguée: 'fa-tee-gay',
  fatiguées: 'fa-tee-gay',
  fatigués: 'fa-tee-gay',
  faut: 'foh',
  font: 'fohn',
  froid: 'frwah',
  gare: 'gar',
  habitent: 'a-beet',
  i: 'ee',
  ici: 'ee-see',
  il: { say: 'eel', beforeVowel: 'ee-l' },
  ils: { say: 'eel', beforeVowel: 'eel-z' },
  important: { say: 'an-por-tahn', beforeVowel: 'an-por-tahn-t' },
  "j'achète": 'zha-shet',
  "j'ai": 'zhay',
  "j'aime": 'zhem',
  "j'appelle": 'zha-pel',
  "j'arrive": 'zha-reev',
  "j'arrête": 'zha-ret',
  "j'dois": 'zhdwah',
  "j'donne": 'zhdon',
  "j'essaie": 'zhe-say',
  "j'fais": 'zhfay',
  "j'habite": 'zha-beet',
  "j'mange": 'zhmahnzh',
  "j'oublie": 'zhoo-blee',
  "j'parle": 'zhparl',
  "j'pense": 'zhpahns',
  "j'peux": 'zhpuh',
  "j'préfère": 'zhpray-fair',
  "j'regarde": 'zhruh-gard',
  "j'vais": 'zhvay',
  "j'veux": 'zhvuh',
  "j'voudrais": 'zhvoo-dray',
  "j'écoute": 'zhay-koot',
  jamais: 'zha-may',
  je: 'zhuh',
  "l'argent": 'lar-zhahn',
  "l'eau": 'loh',
  "l'école": 'lay-kol',
  la: 'la',
  le: 'luh',
  libre: 'leebr',
  là: 'la',
  ma: 'ma',
  maintenant: 'mant-nahn',
  mais: 'may',
  maison: 'may-zohn',
  mal: 'mal',
  malade: 'ma-lad',
  malades: 'ma-lad',
  mange: 'mahnzh',
  mangent: 'mahnzh',
  mangeons: 'mahn-zhohn',
  manger: 'mahn-zhay',
  marché: 'mar-shay',
  merci: 'mer-see',
  mon: { say: 'mohn', beforeVowel: 'moh-n' },
  musique: 'mew-zeek',
  ménage: 'may-nazh',
  non: 'nohn',
  nous: { say: 'noo', beforeVowel: 'noo-z' },
  occupé: 'oh-kew-pay',
  occupés: 'oh-kew-pay',
  on: { say: 'ohn', beforeVowel: 'oh-n' },
  ont: { say: 'ohn', beforeVowel: 'ohn-t' },
  ou: 'oo',
  oublier: 'oo-blee-ay',
  oubliez: 'oo-blee-ay',
  oui: 'wee',
  où: 'oo',
  paie: 'pay',
  paient: 'pay',
  pain: 'pan',
  parce: 'pars',
  "parce que": 'pars-kuh',
  parle: 'parl',
  parlent: 'parl',
  parler: 'par-lay',
  parles: 'parl',
  parlez: 'par-lay',
  parlons: 'par-lohn',
  partir: 'par-teer',
  pas: { say: 'pah', beforeVowel: 'pah-z' },
  payer: 'pay-yay',
  payons: 'pay-yohn',
  pense: 'pahns',
  penses: 'pahns',
  personne: 'per-son',
  personnes: 'per-son',
  peu: 'puh',
  peut: { say: 'puh', beforeVowel: 'puh-t' },
  "peut-être": 'puh-tetr',
  peuvent: { say: 'puhv', beforeVowel: 'puhv-t' },
  peux: 'puh',
  pour: 'poor',
  pourquoi: 'poor-kwah',
  pouvez: { say: 'poo-vay', beforeVowel: 'poo-vay-z' },
  "pouvez-vous": { say: 'poo-vay-voo', beforeVowel: 'poo-vay-voo-z' },
  pouvons: 'poo-vohn',
  problème: 'pro-blem',
  préfère: 'pray-fair',
  préfèrent: 'pray-fair',
  préférons: 'pray-fay-rohn',
  "qu'elle": 'kell',
  "qu'elles": 'kell',
  "qu'est-ce": 'kess',
  "qu'est-ce qu'ils": 'kess-keel',
  "qu'est-ce qu'on": 'kess-kohn',
  "qu'est-ce que": 'kess-kuh',
  "qu'il": { say: 'keel', beforeVowel: 'kee-l' },
  "qu'ils": 'keel',
  "qu'on": { say: 'kohn', beforeVowel: 'koh-n' },
  "qu'y'a": 'kya',
  que: 'kuh',
  quel: 'kel',
  quelque: 'kel-kuh',
  quoi: 'kwah',
  regarde: 'ruh-gard',
  regardent: 'ruh-gard',
  regarder: 'ruh-gar-day',
  regardez: 'ruh-gar-day',
  regardons: 'ruh-gar-dohn',
  restaurant: 'res-toh-rahn',
  rester: 'res-tay',
  retard: 'ruh-tar',
  "s'il vous plaît": 'seel-voo-play',
  soif: 'swaf',
  sommes: 'som',
  sont: { say: 'sohn', beforeVowel: 'sohn-t' },
  sortir: 'sor-teer',
  souvent: 'soo-vahn',
  sport: 'spor',
  "t'achètes": 'ta-shet',
  "t'aimes": 'tem',
  "t'appelles": 'ta-pel',
  "t'as": 'ta',
  "t'es": 'tay',
  "t'habites": 'ta-beet',
  tard: 'tar',
  temps: 'tahn',
  toujours: 'too-zhoor',
  travail: 'tra-vye',
  travaille: 'tra-vye',
  travailler: 'tra-va-yay',
  travaillons: 'tra-va-yohn',
  trouver: 'troo-vay',
  très: { say: 'tray', beforeVowel: 'tray-z' },
  tu: 'tew',
  télévision: 'tay-lay-vee-zyohn',
  tôt: 'toh',
  un: { say: 'uhn', beforeVowel: 'uh-n' },
  une: 'ewn',
  va: 'va',
  vais: 'vay',
  vas: 'va',
  veulent: 'vuhl',
  veut: 'vuh',
  veux: 'vuh',
  viande: 'vyahnd',
  ville: 'veel',
  vite: 'veet',
  voiture: 'vwa-tewr',
  vont: 'vohn',
  voudrais: 'voo-dray',
  voulez: 'voo-lay',
  voulons: 'voo-lohn',
  vous: { say: 'voo', beforeVowel: 'voo-z' },
  "y'a": 'ya',
  à: 'ah',
  ça: 'sa',
  è: 'eh',
  écoute: 'ay-koot',
  écoutent: 'ay-koot',
  écouter: 'ay-koo-tay',
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
