import type { Element } from '../types'

/**
 * The element inventory — every learnable unit, in the order it is introduced.
 * Transcribed one-for-one from md/sentences.md; see md/rules.md for the
 * one-new-thing design each card follows.
 *
 * `kind` drives the on-card highlight colour: 'vocab' is yellow (a word to
 * learn), 'grammar' is blue (a structural piece — article, negation,
 * preposition, question word).
 *
 * Two things bundle into one element, because neither half is usable alone:
 *   - a subject pronoun with its verb form (`tu_es`, `il_a`), and
 *   - the first noun to need a given article or preposition (`le_bus`,
 *     `de_la_viande`) — every later noun reuses the now-known word.
 * Their `provides` lists each unit that becomes known.
 *
 * `free` carries the mechanical agreement forms a card unlocks at no cost
 * (md/rules.md: agreement is one rule covering every word in the language, so
 * it rides in the explanation and never costs a card). Verb forms are the
 * opposite — every person is its own element, *including forms that sound
 * identical*, because the learner picks between written options.
 *
 * Grammar elements carry a plain-language `note`, shown when a card is flipped.
 * Notes explain in isolation: no "you already know", no "you'll meet this
 * later".
 */
export const ELEMENTS: Element[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Block 1 — être (cards 1–43)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'je',
    kind: 'vocab',
    surface: 'je',
    gloss: 'I',
  },
  {
    id: 'suis',
    kind: 'vocab',
    surface: 'suis',
    gloss: 'am (être — je form)',
  },
  {
    id: 'fatigue',
    kind: 'vocab',
    surface: 'fatigué',
    gloss: 'tired',
    free: [['fatiguée'], ['fatigués'], ['fatiguées']],
  },
  {
    id: 'tu_es',
    kind: 'vocab',
    surface: 'tu es',
    gloss: 'you are (être — tu form)',
    provides: [['tu'], ['es']],
  },
  {
    id: 'il_est',
    kind: 'vocab',
    surface: 'il est',
    gloss: 'he is / it is (être — il form)',
    provides: [['il'], ['est']],
  },
  {
    id: 'elle',
    kind: 'vocab',
    surface: 'elle',
    gloss: 'she / it (feminine)',
  },
  {
    id: 'nous_sommes',
    kind: 'vocab',
    surface: 'nous sommes',
    gloss: 'we are (être — nous form)',
    provides: [['nous'], ['sommes']],
  },
  {
    id: 'vous_etes',
    kind: 'vocab',
    surface: 'vous êtes',
    gloss: 'you are (être — vous form)',
    provides: [['vous'], ['êtes']],
  },
  {
    id: 'ils_sont',
    kind: 'vocab',
    surface: 'ils sont',
    gloss: 'they are (être — ils form)',
    provides: [['ils'], ['sont']],
  },
  {
    id: 'elles',
    kind: 'vocab',
    surface: 'elles',
    gloss: 'they (all feminine)',
  },
  {
    id: 'occupe',
    kind: 'vocab',
    surface: 'occupé',
    gloss: 'busy',
    free: [['occupée'], ['occupés'], ['occupées']],
  },
  {
    id: 'est_ce_que',
    kind: 'grammar',
    surface: 'est-ce que',
    gloss: '(turns a statement into a question)',
  },
  {
    id: 'malade',
    kind: 'vocab',
    surface: 'malade',
    gloss: 'sick / ill',
    free: [['malades']],
  },
  {
    id: 'aussi',
    kind: 'vocab',
    surface: 'aussi',
    gloss: 'too / also',
  },
  {
    id: 'ne_pas',
    kind: 'grammar',
    surface: 'ne … pas',
    gloss: 'not (wraps the verb)',
    provides: [['ne'], ['pas']],
  },
  {
    id: 'ici',
    kind: 'vocab',
    surface: 'ici',
    gloss: 'here',
  },
  {
    id: 'la_adv',
    kind: 'vocab',
    surface: 'là',
    gloss: 'there (and, loosely, "here")',
  },
  {
    id: 'ou_where',
    kind: 'grammar',
    surface: 'où',
    gloss: 'where',
  },
  {
    id: 'on',
    kind: 'vocab',
    surface: 'on',
    gloss: 'we (the everyday word)',
  },
  {
    id: 'en_retard',
    kind: 'grammar',
    surface: 'en retard',
    gloss: 'late',
  },
  {
    id: 'ensemble',
    kind: 'vocab',
    surface: 'ensemble',
    gloss: 'together',
  },
  {
    id: 'le_bus',
    kind: 'vocab',
    surface: 'le bus',
    gloss: 'the bus',
    provides: [['le'], ['bus']],
  },
  {
    id: 'c_est',
    kind: 'grammar',
    surface: "c'est",
    gloss: "it's / that's / this is",
    provides: [['ce']],
  },
  {
    id: 'mon_ami',
    kind: 'vocab',
    surface: 'mon ami',
    gloss: 'my friend',
    provides: [['mon'], ['ami']],
    free: [['amis']],
  },
  {
    id: 'tres',
    kind: 'vocab',
    surface: 'très',
    gloss: 'very',
  },
  {
    id: 'ma_voiture',
    kind: 'vocab',
    surface: 'ma voiture',
    gloss: 'my car',
    provides: [['ma'], ['voiture']],
  },
  {
    id: 'ca',
    kind: 'vocab',
    surface: 'ça',
    gloss: 'that / it',
  },
  {
    id: 'bien',
    kind: 'vocab',
    surface: 'bien',
    gloss: 'well / good',
  },
  {
    id: 'content',
    kind: 'vocab',
    surface: 'content',
    gloss: 'glad / pleased',
    free: [['contente'], ['contents'], ['contentes']],
  },
  {
    id: 'mais',
    kind: 'vocab',
    surface: 'mais',
    gloss: 'but',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 2 — avoir (cards 44–76)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'une',
    kind: 'grammar',
    surface: 'une',
    gloss: 'a / an (feminine)',
  },
  {
    id: 'j_ai',
    kind: 'vocab',
    surface: "j'ai",
    gloss: 'I have (avoir — je form)',
    provides: [['ai']],
  },
  {
    id: 'tu_as',
    kind: 'vocab',
    surface: 'as',
    gloss: 'have (avoir — tu form)',
  },
  {
    id: 'il_a',
    kind: 'vocab',
    surface: 'a',
    gloss: 'has (avoir — il/elle form)',
  },
  {
    id: 'nous_avons',
    kind: 'vocab',
    surface: 'avons',
    gloss: 'have (avoir — nous form)',
  },
  {
    id: 'vous_avez',
    kind: 'vocab',
    surface: 'avez',
    gloss: 'have (avoir — vous form)',
  },
  {
    id: 'ils_ont',
    kind: 'vocab',
    surface: 'ont',
    gloss: 'have (avoir — ils/elles form)',
  },
  {
    id: 'de_negation',
    kind: 'grammar',
    surface: 'de',
    gloss: '(replaces un / une / des after a negative)',
  },
  {
    id: 'un',
    kind: 'grammar',
    surface: 'un',
    gloss: 'a / an (masculine)',
  },
  {
    id: 'des',
    kind: 'grammar',
    surface: 'des',
    gloss: 'some (plural)',
  },
  {
    id: 'deux',
    kind: 'vocab',
    surface: 'deux',
    gloss: 'two',
  },
  {
    id: 'avoir_faim',
    kind: 'grammar',
    surface: 'faim',
    gloss: 'hunger — avoir faim = to be hungry',
  },
  {
    id: 'soif',
    kind: 'grammar',
    surface: 'soif',
    gloss: 'thirst — avoir soif = to be thirsty',
  },
  {
    id: 'le_temps',
    kind: 'vocab',
    surface: 'temps',
    gloss: 'time (le temps)',
  },
  {
    id: 'avoir_besoin_de',
    kind: 'grammar',
    surface: 'besoin',
    gloss: 'need — avoir besoin de = to need',
  },
  {
    id: 'il_y_a',
    kind: 'grammar',
    surface: 'il y a',
    gloss: 'there is / there are',
  },
  {
    id: 'il_n_y_a_pas',
    kind: 'grammar',
    surface: "il n'y a pas",
    gloss: "there isn't / there aren't",
    provides: [['y']],
  },
  {
    id: 'le_probleme',
    kind: 'vocab',
    surface: 'problème',
    gloss: 'problem (le problème)',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 3 — vouloir (cards 77–115)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'cafe',
    kind: 'vocab',
    surface: 'café',
    gloss: 'coffee (le café)',
  },
  {
    id: 'je_veux',
    kind: 'vocab',
    surface: 'veux',
    gloss: 'want (vouloir — je/tu form)',
  },
  {
    id: 'il_veut',
    kind: 'vocab',
    surface: 'veut',
    gloss: 'wants (vouloir — il/elle form)',
  },
  {
    id: 'nous_voulons',
    kind: 'vocab',
    surface: 'voulons',
    gloss: 'want (vouloir — nous form)',
  },
  {
    id: 'vous_voulez',
    kind: 'vocab',
    surface: 'voulez',
    gloss: 'want (vouloir — vous form)',
  },
  {
    id: 'ils_veulent',
    kind: 'vocab',
    surface: 'veulent',
    gloss: 'want (vouloir — ils/elles form)',
  },
  {
    id: 'du',
    kind: 'grammar',
    surface: 'du',
    gloss: 'some (an unspecified amount, masculine)',
  },
  {
    id: 'le_pain',
    kind: 'vocab',
    surface: 'pain',
    gloss: 'bread (le pain)',
  },
  {
    id: 'de_l_eau',
    kind: 'grammar',
    surface: "de l'eau",
    gloss: 'some water',
    provides: [['eau']],
  },
  {
    id: 'de_la_viande',
    kind: 'grammar',
    surface: 'de la viande',
    gloss: 'some meat',
    provides: [['la'], ['viande']],
  },
  {
    id: 'manger',
    kind: 'vocab',
    surface: 'manger',
    gloss: 'to eat (infinitive)',
  },
  {
    id: 'maintenant',
    kind: 'vocab',
    surface: 'maintenant',
    gloss: 'now',
  },
  {
    id: 'boire',
    kind: 'vocab',
    surface: 'boire',
    gloss: 'to drink (infinitive)',
  },
  {
    id: 'quelque_chose',
    kind: 'vocab',
    surface: 'quelque chose',
    gloss: 'something',
    provides: [['quelque', 'chose']],
  },
  {
    id: 'partir',
    kind: 'vocab',
    surface: 'partir',
    gloss: 'to leave / to go (infinitive)',
  },
  {
    id: 'travailler',
    kind: 'vocab',
    surface: 'travailler',
    gloss: 'to work (infinitive)',
  },
  {
    id: 'aider',
    kind: 'vocab',
    surface: 'aider',
    gloss: 'to help (infinitive)',
  },
  {
    id: 'un_peu',
    kind: 'grammar',
    surface: 'un peu',
    gloss: 'a little / a bit',
    provides: [['un', 'peu']],
  },
  {
    id: 'ou',
    kind: 'vocab',
    surface: 'ou',
    gloss: 'or',
  },
  {
    id: 'et',
    kind: 'vocab',
    surface: 'et',
    gloss: 'and',
  },
  {
    id: 'avec',
    kind: 'vocab',
    surface: 'avec',
    gloss: 'with',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 4 — pouvoir (cards 116–150)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'je_peux',
    kind: 'vocab',
    surface: 'peux',
    gloss: 'can (pouvoir — je/tu form)',
  },
  {
    id: 'il_peut',
    kind: 'vocab',
    surface: 'peut',
    gloss: 'can (pouvoir — il/elle form)',
  },
  {
    id: 'nous_pouvons',
    kind: 'vocab',
    surface: 'pouvons',
    gloss: 'can (pouvoir — nous form)',
  },
  {
    id: 'vous_pouvez',
    kind: 'vocab',
    surface: 'pouvez',
    gloss: 'can (pouvoir — vous form)',
  },
  {
    id: 'ils_peuvent',
    kind: 'vocab',
    surface: 'peuvent',
    gloss: 'can (pouvoir — ils/elles form)',
  },
  {
    id: 'entrer',
    kind: 'vocab',
    surface: 'entrer',
    gloss: 'to come in / to enter (infinitive)',
  },
  {
    id: 'sortir',
    kind: 'vocab',
    surface: 'sortir',
    gloss: 'to go out (infinitive)',
  },
  {
    id: 'rester',
    kind: 'vocab',
    surface: 'rester',
    gloss: 'to stay (infinitive)',
  },
  {
    id: 's_il_vous_plait',
    kind: 'grammar',
    surface: "s'il vous plaît",
    gloss: 'please',
    provides: [['se', 'il', 'vous', 'plaît']],
  },
  {
    id: 'merci',
    kind: 'vocab',
    surface: 'merci',
    gloss: 'thank you / thanks',
  },
  {
    id: 'oui',
    kind: 'vocab',
    surface: 'oui',
    gloss: 'yes',
  },
  {
    id: 'non',
    kind: 'vocab',
    surface: 'non',
    gloss: 'no',
  },
  {
    id: 'd_accord',
    kind: 'grammar',
    surface: "d'accord",
    gloss: 'all right / okay / agreed',
    provides: [['de', 'accord']],
  },
  {
    id: 'peut_etre',
    kind: 'vocab',
    surface: 'peut-être',
    gloss: 'maybe / perhaps',
    provides: [['peut', 'être']],
  },
  {
    id: 'parler',
    kind: 'vocab',
    surface: 'parler',
    gloss: 'to talk / to speak (infinitive)',
  },
  {
    id: 'regarder',
    kind: 'vocab',
    surface: 'regarder',
    gloss: 'to look at / to watch (infinitive)',
  },
  {
    id: 'pour',
    kind: 'grammar',
    surface: 'pour',
    gloss: 'for / in order to',
  },
  {
    id: 'libre',
    kind: 'vocab',
    surface: 'libre',
    gloss: 'free / available',
    free: [['libres']],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 5 — devoir (cards 151–185)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'je_dois',
    kind: 'vocab',
    surface: 'dois',
    gloss: 'must / have to (devoir — je/tu form)',
  },
  {
    id: 'il_doit',
    kind: 'vocab',
    surface: 'doit',
    gloss: 'must / has to (devoir — il/elle form)',
  },
  {
    id: 'nous_devons',
    kind: 'vocab',
    surface: 'devons',
    gloss: 'must / have to (devoir — nous form)',
  },
  {
    id: 'vous_devez',
    kind: 'vocab',
    surface: 'devez',
    gloss: 'must / have to (devoir — vous form)',
  },
  {
    id: 'ils_doivent',
    kind: 'vocab',
    surface: 'doivent',
    gloss: 'must / have to (devoir — ils/elles form)',
  },
  {
    id: 'pourquoi',
    kind: 'grammar',
    surface: 'pourquoi',
    gloss: 'why',
  },
  {
    id: 'parce_que',
    kind: 'grammar',
    surface: 'parce que',
    gloss: 'because',
    provides: [['parce', 'que']],
  },
  {
    id: 'il_faut',
    kind: 'grammar',
    surface: 'il faut',
    gloss: 'you have to / one must (no particular person)',
    provides: [['il', 'faut'], ['faut']],
  },
  {
    id: 'payer',
    kind: 'vocab',
    surface: 'payer',
    gloss: 'to pay (infinitive)',
  },
  {
    id: 'argent',
    kind: 'vocab',
    surface: 'argent',
    gloss: 'money (l\'argent)',
  },
  {
    id: 'appeler',
    kind: 'vocab',
    surface: 'appeler',
    gloss: 'to call (infinitive)',
  },
  {
    id: 'demander',
    kind: 'vocab',
    surface: 'demander',
    gloss: 'to ask / to ask for (infinitive)',
  },
  {
    id: 'trouver',
    kind: 'vocab',
    surface: 'trouver',
    gloss: 'to find (infinitive)',
  },
  {
    id: 'chercher',
    kind: 'vocab',
    surface: 'chercher',
    gloss: 'to look for (infinitive)',
  },
  {
    id: 'je_voudrais',
    kind: 'vocab',
    surface: 'voudrais',
    gloss: 'would like (vouloir — the polite form)',
  },
  {
    id: 'tot',
    kind: 'vocab',
    surface: 'tôt',
    gloss: 'early',
  },
  {
    id: 'tard',
    kind: 'vocab',
    surface: 'tard',
    gloss: 'late (in the day)',
  },
  {
    id: 'vite',
    kind: 'vocab',
    surface: 'vite',
    gloss: 'quickly / fast',
  },
  {
    id: 'important',
    kind: 'vocab',
    surface: 'important',
    gloss: 'important',
    free: [['importante'], ['importants'], ['importantes']],
  },
]

export const elementById: Record<string, Element> = Object.fromEntries(
  ELEMENTS.map((el) => [el.id, el]),
)
