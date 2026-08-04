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
 * `free` carries the mechanical forms a card unlocks at no cost (md/rules.md:
 * a rule covering every word in the language rides in the explanation and never
 * costs a card). Two kinds live here — adjective agreement and noun plurals,
 * and, from block 8, the six forms of a regular -er verb. An *irregular* verb is
 * the opposite: every person is its own element, *including forms that sound
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

  // ─────────────────────────────────────────────────────────────────────────
  // Block 6 — aller (cards 186–231)
  //
  // The first block written under the reuse clock: `à`, `au` and `en ville` are
  // marked, because which one a place takes is a choice remade on every noun,
  // and one card cannot offer the alternatives. The nouns are left unmarked —
  // recalling `la gare` is the scheduler's job.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'maison',
    kind: 'vocab',
    surface: 'maison',
    gloss: 'house / home (la maison)',
  },
  {
    id: 'a_place',
    kind: 'grammar',
    surface: 'à',
    gloss: 'to / at (a place)',
    clock: true,
  },
  {
    id: 'travail',
    kind: 'vocab',
    surface: 'travail',
    gloss: 'work (le travail)',
  },
  {
    id: 'au',
    kind: 'grammar',
    surface: 'au',
    gloss: 'to the / at the (masculine)',
    clock: true,
  },
  {
    id: 'aller',
    kind: 'vocab',
    surface: 'aller',
    gloss: 'to go (infinitive)',
  },
  {
    id: 'je_vais',
    kind: 'vocab',
    surface: 'vais',
    gloss: 'am going (aller — je form)',
  },
  {
    id: 'tu_vas',
    kind: 'vocab',
    surface: 'vas',
    gloss: 'are going (aller — tu form)',
  },
  {
    id: 'il_va',
    kind: 'vocab',
    surface: 'va',
    gloss: 'is going (aller — il/elle form)',
  },
  {
    id: 'nous_allons',
    kind: 'vocab',
    surface: 'allons',
    gloss: 'are going (aller — nous form)',
  },
  {
    id: 'vous_allez',
    kind: 'vocab',
    surface: 'allez',
    gloss: 'are going (aller — vous form)',
  },
  {
    id: 'ils_vont',
    kind: 'vocab',
    surface: 'vont',
    gloss: 'are going (aller — ils/elles form)',
  },
  {
    id: 'bureau',
    kind: 'vocab',
    surface: 'bureau',
    gloss: 'office (le bureau)',
  },
  {
    id: 'marche',
    kind: 'vocab',
    surface: 'marché',
    gloss: 'market (le marché)',
  },
  {
    id: 'restaurant',
    kind: 'vocab',
    surface: 'restaurant',
    gloss: 'restaurant (le restaurant)',
  },
  {
    id: 'gare',
    kind: 'vocab',
    surface: 'gare',
    gloss: 'station (la gare)',
  },
  {
    id: 'ecole',
    kind: 'vocab',
    surface: 'école',
    gloss: 'school (l\'école)',
  },
  {
    id: 'en_ville',
    kind: 'grammar',
    surface: 'en ville',
    gloss: 'into town / in town',
    provides: [['en', 'ville']],
    clock: true,
  },
  {
    id: 'comment',
    kind: 'grammar',
    surface: 'comment',
    gloss: 'how',
  },
  {
    id: 'demain',
    kind: 'vocab',
    surface: 'demain',
    gloss: 'tomorrow',
  },
  {
    id: 'aujourdhui',
    kind: 'vocab',
    surface: 'aujourd\'hui',
    gloss: 'today',
  },
  {
    id: 'ca_va',
    kind: 'grammar',
    surface: 'ça va',
    gloss: 'how are you / it\'s fine',
    provides: [['ça', 'va']],
  },
  {
    id: 'mal',
    kind: 'vocab',
    surface: 'mal',
    gloss: 'badly',
  },
  {
    id: 'comment_allez_vous',
    kind: 'grammar',
    surface: 'comment allez-vous',
    gloss: 'how are you (polite)',
    provides: [['comment', 'allez', 'vous']],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 7 — faire (cards 232–271)
  //
  // Nothing here is marked `clock`. The block's own choices are all made
  // somewhere else: which article an activity takes is the article system,
  // already on the clock from block 6, and the question words are retrieved
  // rather than assembled — there is no third option to weigh `quoi` against.
  // The verb forms need no mark; they are recognised from their gloss.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'faire',
    kind: 'vocab',
    surface: 'faire',
    gloss: 'to do / to make (infinitive)',
  },
  {
    id: 'sport',
    kind: 'vocab',
    surface: 'sport',
    gloss: 'sport (le sport)',
  },
  {
    id: 'je_fais',
    kind: 'vocab',
    surface: 'fais',
    gloss: 'do (faire — je/tu form)',
  },
  {
    id: 'il_fait',
    kind: 'vocab',
    surface: 'fait',
    gloss: 'does (faire — il/elle form)',
  },
  {
    id: 'nous_faisons',
    kind: 'vocab',
    surface: 'faisons',
    gloss: 'do (faire — nous form)',
  },
  {
    id: 'vous_faites',
    kind: 'vocab',
    surface: 'faites',
    gloss: 'do (faire — vous form)',
  },
  {
    id: 'ils_font',
    kind: 'vocab',
    surface: 'font',
    gloss: 'do (faire — ils/elles form)',
  },
  {
    id: 'cuisine',
    kind: 'vocab',
    surface: 'cuisine',
    gloss: 'cooking / kitchen (la cuisine)',
  },
  {
    id: 'menage',
    kind: 'vocab',
    surface: 'ménage',
    gloss: 'housework (le ménage)',
  },
  {
    id: 'quest_ce_que',
    kind: 'grammar',
    surface: 'qu\'est-ce que',
    gloss: 'what',
    provides: [['que', 'est', 'ce', 'que']],
  },
  {
    id: 'quoi',
    kind: 'grammar',
    surface: 'quoi',
    gloss: 'what (standing after the verb)',
  },
  {
    id: 'chaud',
    kind: 'vocab',
    surface: 'chaud',
    gloss: 'hot',
    free: [['chaude'], ['chauds'], ['chaudes']],
  },
  {
    id: 'froid',
    kind: 'vocab',
    surface: 'froid',
    gloss: 'cold',
    free: [['froide'], ['froids'], ['froides']],
  },
  {
    id: 'beau',
    kind: 'vocab',
    surface: 'beau',
    gloss: 'nice (of weather) / beautiful',
  },
  {
    id: 'quel_temps_fait_il',
    kind: 'grammar',
    surface: 'quel temps fait-il',
    gloss: 'what is the weather like',
    provides: [['quel', 'temps', 'fait', 'il']],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 8 — regular -er verbs (cards 272–310)
  //
  // `parler` pays per form, the way an irregular verb does — five elements for
  // five spellings. `regarder` pays once and its other forms ride on `free`,
  // and every regular -er verb after it does the same: one element, six forms
  // and the infinitive together (md/rules.md, "The -er endings").
  //
  // The gloss "(infinitive — all six forms)" is what reuse.ts reads to put a
  // bundled verb on the clock; keep the shape.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'je_parle',
    kind: 'vocab',
    surface: 'parle',
    gloss: 'speak / speaks (parler — je/il/elle form)',
  },
  {
    id: 'tu_parles',
    kind: 'vocab',
    surface: 'parles',
    gloss: 'speak (parler — tu form)',
  },
  {
    id: 'nous_parlons',
    kind: 'vocab',
    surface: 'parlons',
    gloss: 'speak (parler — nous form)',
  },
  {
    id: 'vous_parlez',
    kind: 'vocab',
    surface: 'parlez',
    gloss: 'speak (parler — vous form)',
  },
  {
    id: 'ils_parlent',
    kind: 'vocab',
    surface: 'parlent',
    gloss: 'speak (parler — ils/elles form)',
  },
  {
    id: 'television',
    kind: 'vocab',
    surface: 'télévision',
    gloss: 'television (la télévision)',
  },
  {
    id: 'regarde',
    kind: 'vocab',
    surface: 'regarde',
    gloss: 'watch (regarder — all six forms)',
    free: [['regardes'], ['regardons'], ['regardez'], ['regardent']],
  },
  {
    id: 'musique',
    kind: 'vocab',
    surface: 'musique',
    gloss: 'music (la musique)',
  },
  {
    id: 'ecoute',
    kind: 'vocab',
    surface: 'écoute',
    gloss: 'listen to (écouter — all six forms)',
    free: [['écouter'], ['écoutes'], ['écoutons'], ['écoutez'], ['écoutent']],
  },
  {
    id: 'habite',
    kind: 'vocab',
    surface: 'habite',
    gloss: 'live (habiter — all six forms)',
    free: [['habiter'], ['habites'], ['habitons'], ['habitez'], ['habitent']],
  },
  {
    id: 'donne',
    kind: 'vocab',
    surface: 'donne',
    gloss: 'give (donner — all six forms)',
    free: [['donner'], ['donnes'], ['donnons'], ['donnez'], ['donnent']],
  },
  {
    id: 'aime',
    kind: 'vocab',
    surface: 'aime',
    gloss: 'like (aimer — all six forms)',
    free: [['aimer'], ['aimes'], ['aimons'], ['aimez'], ['aiment']],
  },
  {
    id: 'pense',
    kind: 'vocab',
    surface: 'pense',
    gloss: 'think / thinks (penser — all six forms)',
    free: [['penser'], ['penses'], ['pensons'], ['pensez'], ['pensent']],
  },
  {
    id: 'personne',
    kind: 'vocab',
    surface: 'personne',
    gloss: 'person (la personne)',
    free: [['personnes']],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 9 — more -er verbs, adverbs, frequency (cards 311–350)
  //
  // `travaillons` is the switch-on card: the -er endings were installed in
  // block 8, so every -er infinitive already taught can be conjugated without
  // paying again. Its `free` list carries all six of those verbs' forms, which
  // is why it runs long — the cost is one card, not six.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'travaillons',
    kind: 'vocab',
    surface: 'travaillons',
    gloss: 'work (travailler — all six forms)',
    free: [
      ['travaille'], ['travailles'], ['travaillez'], ['travaillent'],
      ['aide'], ['aides'], ['aidons'], ['aidez'], ['aident'],
      ['cherche'], ['cherches'], ['cherchons'], ['cherchez'], ['cherchent'],
      ['trouve'], ['trouves'], ['trouvons'], ['trouvez'], ['trouvent'],
      ['reste'], ['restes'], ['restons'], ['restez'], ['restent'],
      ['entre'], ['entres'], ['entrons'], ['entrez'], ['entrent'],
    ],
  },
  {
    id: 'arrive',
    kind: 'vocab',
    surface: 'arrive',
    gloss: 'arrive / arrives / arriving (arriver — all six forms)',
    free: [['arriver'], ['arrives'], ['arrivons'], ['arrivez'], ['arrivent']],
  },
  {
    id: 'commence',
    kind: 'vocab',
    surface: 'commence',
    gloss: 'start / starting (commencer — all six forms)',
    free: [['commencer'], ['commences'], ['commencez'], ['commencent']],
  },
  {
    id: 'commencons',
    kind: 'vocab',
    surface: 'commençons',
    gloss: 'start / starting (commencer — nous form)',
  },
  {
    id: 'arrete',
    kind: 'vocab',
    surface: 'arrête',
    gloss: 'stop / stopping (arrêter — all six forms)',
    free: [['arrêter'], ['arrêtes'], ['arrêtons'], ['arrêtez'], ['arrêtent']],
  },
  {
    id: 'oublie',
    kind: 'vocab',
    surface: 'oublie',
    gloss: 'forget (oublier — all six forms)',
    free: [['oublier'], ['oublies'], ['oublions'], ['oubliez'], ['oublient']],
  },
  {
    id: 'toujours',
    kind: 'vocab',
    surface: 'toujours',
    gloss: 'always',
  },
  {
    id: 'souvent',
    kind: 'vocab',
    surface: 'souvent',
    gloss: 'often',
  },
  {
    id: 'beaucoup',
    kind: 'vocab',
    surface: 'beaucoup',
    gloss: 'a lot / much',
  },
  {
    id: 'assez',
    kind: 'vocab',
    surface: 'assez',
    gloss: 'enough',
  },
  {
    id: 'deja',
    kind: 'vocab',
    surface: 'déjà',
    gloss: 'already',
  },
  {
    id: 'ne_jamais',
    kind: 'grammar',
    surface: 'ne … jamais',
    gloss: 'never (wraps the verb)',
    provides: [['ne'], ['jamais']],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Block 10 — stem-changing -er verbs (cards 351–375)
  //
  // These end in -er but are not in the free class (md/rules.md, "The -er
  // endings"): the stem moves. Each costs its own element and carries its own
  // six forms, because where the stem lands is a fact about the verb rather
  // than a rule about the language.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'mange',
    kind: 'vocab',
    surface: 'mange',
    gloss: 'eat / eats (manger — all six forms)',
    free: [['manges'], ['mangeons'], ['mangez'], ['mangent']],
  },
  {
    id: 'appelle',
    kind: 'vocab',
    surface: 'appelle',
    gloss: 'call / calling (appeler — all six forms)',
    free: [['appelles'], ['appelons'], ['appelez'], ['appellent']],
  },
  {
    id: 'paie',
    kind: 'vocab',
    surface: 'paie',
    gloss: 'pay / pays (payer — all six forms)',
    free: [['paies'], ['payons'], ['payez'], ['paient']],
  },
  {
    id: 'essaie',
    kind: 'vocab',
    surface: 'essaie',
    gloss: 'try / trying (essayer — all six forms)',
    free: [['essayer'], ['essaies'], ['essayons'], ['essayez'], ['essaient']],
  },
  {
    id: 'prefere',
    kind: 'vocab',
    surface: 'préfère',
    gloss: 'prefer / prefers (préférer — all six forms)',
    free: [['préférer'], ['préfères'], ['préférons'], ['préférez'], ['préfèrent']],
  },
  {
    id: 'achete',
    kind: 'vocab',
    surface: 'achète',
    gloss: 'buy / buying (acheter — all six forms)',
    free: [['acheter'], ['achètes'], ['achetons'], ['achetez'], ['achètent']],
  },
]

export const elementById: Record<string, Element> = Object.fromEntries(
  ELEMENTS.map((el) => [el.id, el]),
)
