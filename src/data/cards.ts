import type { Card, Segment } from '../types'

/**
 * The deck, transcribed one-for-one from md/sentences.md and validated i+1 (see
 * src/engine/i1.ts). Each card is one whole French sentence built from
 * already-known words plus a single new element, which it highlights:
 *
 *   v(...)  → yellow, new vocabulary
 *   g(...)  → blue,   a new grammar concept
 *   t(...)  → plain,  already-known text
 *   gi(...) → g(...), italic on the English side — see "some" below
 *
 * `segments` is the French (back); `translation` is the English (front). The
 * translation highlights the English counterpart of *the word the gap takes
 * out*, which the answer bolds — on most cards that is the new element, but it
 * is the blank that decides, so rest cards bold too. The kind is the kind of
 * the English word being pointed at: `v` for a content word, `g` for a piece of
 * grammar. It stays plain only where the blanked word has no English word of
 * its own (`Est-ce que`).
 *
 * The one word the English does not carry is "some". `du / de la / de l' / des`
 * — and the `de` a negative collapses them into — are compulsory in French and
 * optional in English, so a translation that says "some" everywhere teaches the
 * opposite of the truth: it makes the French word look like the droppable one.
 * So the English says what English says — "We want bread" — and the French
 * carries a word the English does not account for, which is the lesson. The
 * exception is the card whose gap *is* that article: there the bold needs
 * something to point at, so "some" stays and `gi` italicises it, and the
 * italics say the one thing that is true of it — French makes you say this.
 *
 * The English pronoun "one" is reserved for `il faut`, on every card that uses
 * it. Nothing else in the deck translates as "one" — `on` is glossed "we" — so
 * the pronoun alone tells the two obligations apart on sight: "One has to work"
 * is `il faut travailler`, "You have to work" is `tu dois travailler`. Left to
 * the natural English both render "You have to work", and the learner is asked
 * to infer from the audio a distinction the screen has hidden. "One" is stiffer
 * than anyone speaks, and that is the trade: the card face is a teaching gloss,
 * not a model sentence, and the everyday wording is stated in the explanation
 * (data/explanations.ts) where it can be said rather than guessed at.
 *
 * A card with no `element` is a "rest" card (md/rules.md rule 3): a full
 * sentence built only from known words, which drills a form just taught or sets
 * up the next step. Its French highlights nothing, so it names its gap with
 * `blank` wherever the fallback heuristic would pick badly — an elided fragment
 * (`Est-ce`, `n'est`) or, on a sentence of short words, the wrong one of them.
 * A rest card may still carry a `note` — that is how rules with no new word of
 * their own are taught (elision, asking by intonation, a verb form spelled the
 * same as one already known).
 *
 * What the voice says is not what the screen shows: the learner reads standard
 * written French and hears the everyday spoken reduction (chuis, j'mange, and
 * ne dropped from ne … pas). See src/engine/speech.ts.
 */
const v = (text: string): Segment => ({ text, highlight: 'vocab' })
const g = (text: string): Segment => ({ text, highlight: 'grammar' })
const t = (text: string): Segment => ({ text })
const gi = (text: string): Segment => ({ text, highlight: 'grammar', implied: true })

export const CARDS: Card[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // Block 1 — être · cards 1–43
  // ───────────────────────────────────────────────────────────────────────────

  // Opening — the only place a fragment is allowed (md/rules.md).
  { id: 'c1', element: 'je', segments: [v('Je')], translation: [v('I')] },
  {
    id: 'c2',
    element: 'suis',
    segments: [t('Je '), v('suis')],
    translation: [t('I '), v('am')],
  },
  {
    id: 'c3',
    element: 'fatigue',
    segments: [t('Je suis '), v('fatigué')],
    translation: [t('I am '), v('tired')],
  },

  // The persons — adjective held still so the only thing moving is the subject.
  {
    id: 'c4',
    element: 'tu_es',
    segments: [v('Tu es'), t(' fatigué')],
    translation: [v('You are'), t(' tired')],
  },
  {
    id: 'c5',
    element: 'il_est',
    segments: [v('Il est'), t(' fatigué')],
    translation: [v('He is'), t(' tired')],
  },
  {
    id: 'c6',
    element: 'elle',
    segments: [v('Elle'), t(' est fatiguée')],
    translation: [v('She'), t(' is tired')],
  },
  {
    id: 'c7',
    element: 'nous_sommes',
    segments: [v('Nous sommes'), t(' fatigués')],
    translation: [v('We are'), t(' tired')],
  },
  {
    id: 'c8',
    element: 'vous_etes',
    segments: [v('Vous êtes'), t(' fatigué')],
    translation: [v('You are'), t(' tired')],
  },
  {
    id: 'c9',
    element: 'ils_sont',
    segments: [v('Ils sont'), t(' fatigués')],
    translation: [v('They are'), t(' tired')],
  },
  {
    id: 'c10',
    element: 'elles',
    segments: [v('Elles'), t(' sont fatiguées')],
    translation: [v('They'), t(' are tired')],
  },

  // Spending it.
  {
    id: 'c11',
    element: 'occupe',
    segments: [t('Je suis '), v('occupé')],
    translation: [t('I am '), v('busy')],
  },
  {
    id: 'c12',
    segments: [t('Vous êtes occupé ?')],
    translation: [v('Are you'), t(' busy?')],
  },
  {
    id: 'c13',
    element: 'est_ce_que',
    segments: [g('Est-ce que'), t(' vous êtes occupé ?')],
    translation: [t('Are you busy?')],
  },
  {
    id: 'c14',
    segments: [t('Est-ce que tu es fatigué ?')],
    translation: [v('Are you'), t(' tired?')],
  },
  {
    id: 'c15',
    element: 'malade',
    segments: [t('Il est '), v('malade')],
    translation: [t('He is '), v('sick')],
  },
  {
    id: 'c16',
    element: 'aussi',
    segments: [t('Elle est malade '), v('aussi')],
    translation: [t('She is sick '), v('too')],
  },
  {
    id: 'c17',
    segments: [t('Nous sommes malades')],
    translation: [t('We are '), v('sick')],
  },
  {
    id: 'c18',
    element: 'ne_pas',
    segments: [t('Je '), g('ne'), t(' suis '), g('pas'), t(' malade')],
    translation: [t('I am '), g('not'), t(' sick')],
  },
  {
    id: 'c19',
    segments: [t('Tu n\'es pas malade')],
    translation: [t('You are not '), v('sick')],
  },
  {
    id: 'c20',
    segments: [t('Elle n\'est pas fatiguée')],
    translation: [v('She'), t(' is not tired')],
  },
  {
    id: 'c21',
    element: 'ici',
    segments: [t('Je suis '), v('ici')],
    translation: [t('I am '), v('here')],
  },
  {
    id: 'c22',
    segments: [t('Est-ce qu\'il est ici ?')],
    blank: 'ici',
    translation: [t('Is he '), v('here'), t('?')],
  },
  {
    id: 'c23',
    segments: [t('Il n\'est pas ici')],
    blank: 'ici',
    translation: [t('He is not '), v('here')],
  },
  {
    id: 'c24',
    element: 'la_adv',
    segments: [t('Ils sont '), v('là')],
    translation: [t('They are '), v('there')],
  },
  {
    id: 'c25',
    element: 'ou_where',
    segments: [g('Où'), t(' est-ce que tu es ?')],
    translation: [g('Where'), t(' are you?')],
  },
  {
    id: 'c26',
    segments: [t('Je suis là')],
    blank: 'là',
    translation: [t('I am '), v('here')],
  },

  // On.
  {
    id: 'c27',
    element: 'on',
    segments: [v('On'), t(' est ici')],
    translation: [v('We'), t(' are here')],
  },
  {
    id: 'c28',
    element: 'en_retard',
    segments: [t('On est '), g('en retard')],
    translation: [t('We are '), g('late')],
  },
  {
    id: 'c29',
    segments: [t('Est-ce qu\'on est en retard ?')],
    blank: 'en retard',
    translation: [t('Are we '), g('late'), t('?')],
  },
  {
    id: 'c30',
    element: 'ensemble',
    segments: [t('On est '), v('ensemble')],
    translation: [t('We are '), v('together')],
  },
  {
    id: 'c31',
    segments: [t('On n\'est pas ensemble')],
    translation: [v('We'), t(' are not together')],
  },

  // C'est.
  {
    id: 'c32',
    element: 'le_bus',
    segments: [v('Le bus'), t(' est en retard')],
    translation: [v('The bus'), t(' is late')],
  },
  {
    id: 'c33',
    element: 'c_est',
    segments: [g('C\'est'), t(' ici')],
    translation: [g('It\'s'), t(' here')],
  },
  {
    id: 'c34',
    segments: [t('Ce n\'est pas ici')],
    blank: 'Ce',
    translation: [g('It'), t(' is not here')],
  },
  {
    id: 'c35',
    element: 'mon_ami',
    segments: [t('C\'est '), v('mon ami')],
    translation: [t('It\'s '), v('my friend')],
  },
  {
    id: 'c36',
    element: 'tres',
    segments: [t('Mon ami est '), v('très'), t(' occupé')],
    translation: [t('My friend is '), v('very'), t(' busy')],
  },
  {
    id: 'c37',
    element: 'ma_voiture',
    segments: [t('C\'est '), v('ma voiture')],
    translation: [t('It\'s '), v('my car')],
  },
  {
    id: 'c38',
    segments: [t('Où est ma voiture ?')],
    blank: 'voiture',
    translation: [t('Where is my '), v('car'), t('?')],
  },
  {
    id: 'c39',
    element: 'ca',
    segments: [t('C\'est '), v('ça')],
    translation: [t('That\'s '), v('it')],
  },
  {
    id: 'c40',
    segments: [t('Est-ce que c\'est ça ?')],
    blank: 'ça',
    translation: [t('Is that '), v('it'), t('?')],
  },
  {
    id: 'c41',
    element: 'bien',
    segments: [t('C\'est '), v('bien')],
    translation: [t('That\'s '), v('good')],
  },
  {
    id: 'c42',
    element: 'content',
    segments: [t('Je suis '), v('content')],
    translation: [t('I am '), v('glad')],
  },
  {
    id: 'c43',
    element: 'mais',
    segments: [t('Je suis fatigué, '), v('mais'), t(' je suis content')],
    translation: [t('I am tired, '), v('but'), t(' I am glad')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 2 — avoir · cards 44–76
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'c44',
    element: 'une',
    segments: [t('C\'est '), g('une'), t(' voiture')],
    translation: [t('It\'s '), g('a'), t(' car')],
  },

  // The persons — object held still.
  {
    id: 'c45',
    element: 'j_ai',
    segments: [v('J\'ai'), t(' une voiture')],
    translation: [v('I have'), t(' a car')],
  },
  {
    id: 'c46',
    element: 'tu_as',
    segments: [t('Tu '), v('as'), t(' une voiture')],
    translation: [t('You '), v('have'), t(' a car')],
  },
  {
    id: 'c47',
    element: 'il_a',
    segments: [t('Il '), v('a'), t(' une voiture')],
    translation: [t('He '), v('has'), t(' a car')],
  },
  {
    id: 'c48',
    segments: [t('Elle a une voiture')],
    translation: [t('She has a '), v('car')],
  },
  {
    id: 'c49',
    element: 'nous_avons',
    segments: [t('Nous '), v('avons'), t(' une voiture')],
    translation: [t('We '), v('have'), t(' a car')],
  },
  {
    id: 'c50',
    element: 'vous_avez',
    segments: [t('Vous '), v('avez'), t(' une voiture')],
    translation: [t('You '), v('have'), t(' a car')],
  },
  {
    id: 'c51',
    element: 'ils_ont',
    segments: [t('Ils '), v('ont'), t(' une voiture')],
    translation: [t('They '), v('have'), t(' a car')],
  },
  {
    id: 'c52',
    segments: [t('Elles ont une voiture')],
    translation: [t('They have a '), v('car')],
  },
  {
    id: 'c53',
    segments: [t('On a une voiture')],
    translation: [t('We '), v('have'), t(' a car')],
  },

  // Spending it.
  {
    id: 'c54',
    segments: [t('Est-ce que tu as une voiture ?')],
    translation: [t('Do you '), v('have'), t(' a car?')],
  },
  {
    id: 'c55',
    element: 'de_negation',
    segments: [t('Je n\'ai pas '), g('de'), t(' voiture')],
    translation: [t('I don\'t have '), g('a'), t(' car')],
  },
  {
    id: 'c56',
    segments: [t('Il n\'a pas de voiture')],
    translation: [t('He doesn\'t have a '), v('car')],
  },
  {
    id: 'c57',
    element: 'un',
    segments: [t('Elle a '), g('un'), t(' ami ici')],
    translation: [t('She has '), g('a'), t(' friend here')],
  },
  {
    id: 'c58',
    element: 'des',
    segments: [t('Nous avons '), g('des'), t(' amis')],
    translation: [t('We have '), gi('some'), t(' friends')],
  },
  {
    id: 'c59',
    segments: [t('Est-ce que vous avez des amis ici ?')],
    blank: 'amis',
    translation: [t('Do you have '), v('friends'), t(' here?')],
  },
  {
    id: 'c60',
    element: 'deux',
    segments: [t('On a '), v('deux'), t(' amis')],
    translation: [t('We have '), v('two'), t(' friends')],
  },

  // What you *have* in French.
  {
    id: 'c61',
    element: 'avoir_faim',
    segments: [t('Il a '), g('faim')],
    translation: [t('He is '), g('hungry')],
  },
  {
    id: 'c62',
    segments: [t('Est-ce que tu as faim ?')],
    translation: [v('Are'), t(' you hungry?')],
  },
  {
    id: 'c63',
    segments: [t('Je n\'ai pas faim')],
    blank: 'faim',
    translation: [t('I am not '), g('hungry')],
  },
  {
    id: 'c64',
    element: 'soif',
    segments: [t('Elle a '), g('soif')],
    translation: [t('She is '), g('thirsty')],
  },
  {
    id: 'c65',
    segments: [t('Nous avons soif')],
    blank: 'soif',
    translation: [t('We are '), g('thirsty')],
  },
  {
    id: 'c66',
    element: 'le_temps',
    segments: [t('Vous avez le '), v('temps'), t(' ?')],
    translation: [t('Do you have '), v('time'), t('?')],
  },
  {
    id: 'c67',
    segments: [t('Je n\'ai pas le temps')],
    translation: [t('I don\'t '), v('have'), t(' time')],
  },
  {
    id: 'c68',
    segments: [t('On n\'a pas le temps')],
    translation: [t('We don\'t '), v('have'), t(' time')],
  },
  {
    id: 'c69',
    element: 'avoir_besoin_de',
    segments: [t('On a '), g('besoin'), t(' d\'une voiture')],
    translation: [t('We '), g('need'), t(' a car')],
  },
  {
    id: 'c70',
    segments: [t('J\'ai besoin de mon ami')],
    translation: [t('I need '), v('my friend')],
  },

  // Il y a.
  {
    id: 'c71',
    element: 'il_y_a',
    segments: [g('Il y a'), t(' un bus')],
    translation: [g('There is'), t(' a bus')],
  },
  {
    id: 'c72',
    segments: [t('Est-ce qu\'il y a un bus ici ?')],
    blank: 'bus',
    translation: [t('Is there a '), v('bus'), t(' here?')],
  },
  {
    id: 'c73',
    element: 'il_n_y_a_pas',
    segments: [g('Il n\'y a pas'), t(' de bus')],
    translation: [g('There is no'), t(' bus')],
  },
  {
    id: 'c74',
    element: 'le_probleme',
    segments: [t('Il y a un '), v('problème')],
    translation: [t('There is a '), v('problem')],
  },
  {
    id: 'c75',
    segments: [t('Est-ce qu\'il y a un problème ?')],
    translation: [g('Is there'), t(' a problem?')],
  },
  {
    id: 'c76',
    segments: [t('Il n\'y a pas de problème')],
    blank: 'problème',
    translation: [t('There is no '), v('problem')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 3 — vouloir · cards 77–115
  // ───────────────────────────────────────────────────────────────────────────

  {
    id: 'c77',
    element: 'cafe',
    segments: [t('C\'est un '), v('café')],
    translation: [t('It\'s a '), v('coffee')],
  },

  // The persons — object held still.
  {
    id: 'c78',
    element: 'je_veux',
    segments: [t('Je '), v('veux'), t(' un café')],
    translation: [t('I '), v('want'), t(' a coffee')],
  },
  {
    id: 'c79',
    segments: [t('Tu veux un café')],
    translation: [v('You'), t(' want a coffee')],
  },
  {
    id: 'c80',
    element: 'il_veut',
    segments: [t('Il '), v('veut'), t(' un café')],
    translation: [t('He '), v('wants'), t(' a coffee')],
  },
  {
    id: 'c81',
    segments: [t('Elle veut un café')],
    blank: 'veut',
    translation: [t('She '), v('wants'), t(' a coffee')],
  },
  {
    id: 'c82',
    element: 'nous_voulons',
    segments: [t('Nous '), v('voulons'), t(' un café')],
    translation: [t('We '), v('want'), t(' a coffee')],
  },
  {
    id: 'c83',
    element: 'vous_voulez',
    segments: [t('Vous '), v('voulez'), t(' un café')],
    translation: [t('You '), v('want'), t(' a coffee')],
  },
  {
    id: 'c84',
    element: 'ils_veulent',
    segments: [t('Ils '), v('veulent'), t(' un café')],
    translation: [t('They '), v('want'), t(' a coffee')],
  },
  {
    id: 'c85',
    segments: [t('Elles veulent un café')],
    translation: [t('They want a '), v('coffee')],
  },
  {
    id: 'c86',
    segments: [t('On veut un café')],
    translation: [t('We '), v('want'), t(' a coffee')],
  },

  // Some of it, not one of it.
  {
    id: 'c87',
    segments: [t('Est-ce que tu veux un café ?')],
    translation: [t('Do you '), v('want'), t(' a coffee?')],
  },
  {
    id: 'c88',
    element: 'du',
    segments: [t('Je veux '), g('du'), t(' café')],
    translation: [t('I want '), gi('some'), t(' coffee')],
  },
  {
    id: 'c89',
    element: 'le_pain',
    segments: [t('On veut du '), v('pain')],
    translation: [t('We want '), v('bread')],
  },
  {
    id: 'c90',
    segments: [t('Est-ce que vous voulez du pain ?')],
    translation: [t('Do you '), v('want'), t(' bread?')],
  },
  {
    id: 'c91',
    element: 'de_l_eau',
    segments: [t('Elle veut '), g('de l\'eau')],
    translation: [t('She wants '), gi('some'), g(' water')],
  },
  {
    id: 'c92',
    element: 'de_la_viande',
    segments: [t('Il veut '), g('de la viande')],
    translation: [t('He wants '), gi('some'), g(' meat')],
  },
  {
    id: 'c93',
    segments: [t('Je ne veux pas de viande')],
    translation: [t('I don\'t '), v('want'), t(' meat')],
  },
  {
    id: 'c94',
    segments: [t('Il n\'y a pas d\'eau')],
    translation: [t('There is no '), v('water')],
  },

  // The infinitive slot opens.
  {
    id: 'c95',
    element: 'manger',
    segments: [t('Je veux '), v('manger')],
    translation: [t('I want '), v('to eat')],
  },
  {
    id: 'c96',
    element: 'maintenant',
    segments: [t('On veut manger '), v('maintenant')],
    translation: [t('We want to eat '), v('now')],
  },
  {
    id: 'c97',
    element: 'boire',
    segments: [t('Elle veut '), v('boire'), t(' de l\'eau')],
    translation: [t('She wants '), v('to drink'), t(' water')],
  },
  {
    id: 'c98',
    element: 'quelque_chose',
    segments: [t('Tu veux boire '), v('quelque chose'), t(' ?')],
    translation: [t('Do you want to drink '), v('something'), t('?')],
  },
  {
    id: 'c99',
    element: 'partir',
    segments: [t('Nous voulons '), v('partir')],
    translation: [t('We want '), v('to leave')],
  },
  {
    id: 'c100',
    segments: [t('Est-ce que vous voulez partir maintenant ?')],
    translation: [t('Do you want to leave '), v('now'), t('?')],
  },
  {
    id: 'c101',
    segments: [t('Ils ne veulent pas partir')],
    translation: [t('They don\'t '), v('want'), t(' to leave')],
  },
  {
    id: 'c102',
    element: 'travailler',
    segments: [t('Elles veulent '), v('travailler'), t(' ici')],
    translation: [t('They want '), v('to work'), t(' here')],
  },
  {
    id: 'c103',
    segments: [t('On ne veut pas travailler')],
    translation: [t('We don\'t '), v('want'), t(' to work')],
  },
  {
    id: 'c104',
    element: 'aider',
    segments: [t('Il veut '), v('aider')],
    translation: [t('He wants '), v('to help')],
  },
  {
    id: 'c105',
    segments: [t('Est-ce qu\'elle veut aider ?')],
    blank: 'aider',
    translation: [t('Does she want '), v('to help'), t('?')],
  },

  // Spending it.
  {
    id: 'c106',
    element: 'un_peu',
    segments: [t('Je veux '), g('un peu'), t(' de café')],
    translation: [t('I want '), g('a little'), t(' coffee')],
  },
  {
    id: 'c107',
    segments: [t('Elle veut un peu d\'eau')],
    translation: [t('She '), v('wants'), t(' a little water')],
  },
  {
    id: 'c108',
    element: 'ou',
    segments: [t('Est-ce que tu veux de l\'eau '), v('ou'), t(' du café ?')],
    translation: [t('Do you want water '), v('or'), t(' coffee?')],
  },
  {
    id: 'c109',
    element: 'et',
    segments: [t('On veut du pain '), v('et'), t(' de la viande')],
    translation: [t('We want bread '), v('and'), t(' meat')],
  },
  {
    id: 'c110',
    segments: [t('Il veut manger, mais il n\'a pas le temps')],
    translation: [t('He wants '), v('to eat'), t(', but he doesn\'t have time')],
  },
  {
    id: 'c111',
    element: 'avec',
    segments: [t('Je veux du pain '), v('avec'), t(' du café')],
    translation: [t('I want bread '), v('with'), t(' coffee')],
  },
  {
    id: 'c112',
    segments: [t('Nous voulons aider, mais nous sommes très occupés')],
    translation: [t('We want '), v('to help'), t(', but we are very busy')],
  },
  {
    id: 'c113',
    segments: [t('Est-ce qu\'on veut du café ou de l\'eau ?')],
    blank: 'café',
    translation: [t('Do we want '), v('coffee'), t(' or water?')],
  },
  {
    id: 'c114',
    segments: [t('Je ne veux pas de pain, je veux du café')],
    blank: 'pain',
    translation: [t('I don\'t want '), v('bread'), t(', I want coffee')],
  },
  {
    id: 'c115',
    segments: [t('On veut manger quelque chose maintenant')],
    translation: [t('We want to eat '), v('something'), t(' now')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 4 — pouvoir · cards 116–150
  // ───────────────────────────────────────────────────────────────────────────

  // The persons — the infinitive is held still, so only the subject moves. No
  // setup card is needed: pouvoir takes an infinitive rather than an object,
  // and that slot is already open.
  {
    id: 'c116',
    element: 'je_peux',
    segments: [t('Je '), v('peux'), t(' partir')],
    translation: [t('I '), v('can'), t(' leave')],
  },
  {
    id: 'c117',
    segments: [t('Tu peux partir')],
    blank: 'Tu',
    translation: [v('You'), t(' can leave')],
  },
  {
    id: 'c118',
    element: 'il_peut',
    segments: [t('Il '), v('peut'), t(' partir')],
    translation: [t('He '), v('can'), t(' leave')],
  },
  {
    id: 'c119',
    segments: [t('Elle peut partir maintenant')],
    blank: 'partir',
    translation: [t('She can '), v('leave'), t(' now')],
  },
  {
    id: 'c120',
    element: 'nous_pouvons',
    segments: [t('Nous '), v('pouvons'), t(' partir')],
    translation: [t('We '), v('can'), t(' leave')],
  },
  {
    id: 'c121',
    element: 'vous_pouvez',
    segments: [t('Vous '), v('pouvez'), t(' partir')],
    translation: [t('You '), v('can'), t(' leave')],
  },
  {
    id: 'c122',
    element: 'ils_peuvent',
    segments: [t('Ils '), v('peuvent'), t(' partir')],
    translation: [t('They '), v('can'), t(' leave')],
  },
  {
    id: 'c123',
    segments: [t('On peut partir ensemble')],
    blank: 'On',
    translation: [v('We'), t(' can leave together')],
  },

  // Saying no — ne … pas wraps the conjugated verb and leaves the infinitive
  // outside it.
  {
    id: 'c124',
    segments: [t('Elle ne peut pas travailler')],
    blank: 'travailler',
    translation: [t('She can\'t '), v('work')],
  },
  {
    id: 'c125',
    segments: [t('Elles ne peuvent pas aider')],
    blank: 'Elles',
    translation: [v('They'), t(' can\'t help')],
  },
  {
    id: 'c126',
    segments: [t('Est-ce que tu peux manger avec mon ami ?')],
    blank: 'peux',
    translation: [v('Can'), t(' you eat with my friend?')],
  },

  // Asking permission — the same question in three registers.
  {
    id: 'c127',
    element: 'entrer',
    segments: [t('Est-ce que je peux '), v('entrer'), t(' ?')],
    translation: [t('Can I '), v('come in'), t('?')],
  },
  {
    id: 'c128',
    segments: [t('Je peux entrer ?')],
    blank: 'peux',
    translation: [v('Can'), t(' I come in?')],
  },
  {
    id: 'c129',
    segments: [t('Tu peux entrer')],
    blank: 'entrer',
    translation: [t('You can '), v('come in')],
  },
  {
    id: 'c130',
    element: 'sortir',
    segments: [t('Est-ce que je peux '), v('sortir'), t(' ?')],
    translation: [t('Can I '), v('go out'), t('?')],
  },
  {
    id: 'c131',
    segments: [t('On ne peut pas sortir maintenant')],
    blank: 'On',
    translation: [v('We'), t(' can\'t go out now')],
  },
  {
    id: 'c132',
    element: 'rester',
    segments: [t('Est-ce qu\'on peut '), v('rester'), t(' ici ?')],
    translation: [t('Can we '), v('stay'), t(' here?')],
  },
  {
    id: 'c133',
    segments: [t('Nous ne pouvons pas rester')],
    blank: 'pouvons',
    translation: [t('We '), v('can'), t('\'t stay')],
  },
  {
    id: 'c134',
    segments: [t('Ils peuvent rester ici')],
    blank: 'Ils',
    translation: [v('They'), t(' can stay here')],
  },

  // Politeness — where inversion is genuinely how the question is asked.
  {
    id: 'c135',
    element: 's_il_vous_plait',
    segments: [t('Est-ce que vous pouvez aider, '), g('s\'il vous plaît'), t(' ?')],
    translation: [t('Can you help, '), g('please'), t('?')],
  },
  {
    id: 'c136',
    segments: [t('Pouvez-vous aider ?')],
    blank: 'aider',
    translation: [t('Can you '), v('help'), t('?')],
  },
  {
    id: 'c137',
    segments: [t('Pouvez-vous rester ici, s\'il vous plaît ?')],
    blank: 'rester',
    translation: [t('Can you '), v('stay'), t(' here, please?')],
  },
  {
    id: 'c138',
    element: 'merci',
    segments: [v('Merci'), t(', c\'est très bien')],
    translation: [v('Thank you'), t(', that\'s very good')],
  },

  // Answering.
  {
    id: 'c139',
    element: 'oui',
    segments: [v('Oui'), t(', je peux')],
    translation: [v('Yes'), t(', I can')],
  },
  {
    id: 'c140',
    element: 'non',
    segments: [v('Non'), t(', je ne peux pas')],
    translation: [v('No'), t(', I can\'t')],
  },
  {
    id: 'c141',
    segments: [t('Oui, vous pouvez entrer')],
    blank: 'entrer',
    translation: [t('Yes, you can '), v('come in')],
  },
  {
    id: 'c142',
    element: 'd_accord',
    segments: [g('D\'accord'), t(', on peut manger maintenant')],
    translation: [g('All right'), t(', we can eat now')],
  },
  {
    id: 'c143',
    element: 'peut_etre',
    segments: [v('Peut-être'), t(', mais on est en retard')],
    translation: [v('Maybe'), t(', but we are late')],
  },
  {
    id: 'c144',
    segments: [t('Non merci, je n\'ai pas faim')],
    blank: 'merci',
    translation: [t('No '), v('thank you'), t(', I am not hungry')],
  },

  // Spending it — and the contrast the block exists for.
  {
    id: 'c145',
    element: 'parler',
    segments: [t('Est-ce que tu peux '), v('parler'), t(' avec mon ami ?')],
    translation: [t('Can you '), v('talk'), t(' with my friend?')],
  },
  {
    id: 'c146',
    element: 'regarder',
    segments: [t('Tu peux '), v('regarder'), t(' ma voiture')],
    translation: [t('You can '), v('look at'), t(' my car')],
  },
  {
    id: 'c147',
    element: 'pour',
    segments: [t('Il est ici '), g('pour'), t(' aider')],
    translation: [t('He is here '), g('to'), t(' help')],
  },
  {
    id: 'c148',
    segments: [t('Il y a un problème, mais on peut aider')],
    blank: 'peut',
    translation: [t('There is a problem, but we '), v('can'), t(' help')],
  },
  {
    id: 'c149',
    element: 'libre',
    segments: [t('Est-ce que tu es '), v('libre'), t(' maintenant ?')],
    translation: [t('Are you '), v('free'), t(' now?')],
  },
  {
    id: 'c150',
    segments: [t('Je veux partir, mais je ne peux pas')],
    blank: 'peux',
    translation: [t('I want to leave, but I '), v('can'), t('\'t')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 5 — devoir · cards 151–185
  // ───────────────────────────────────────────────────────────────────────────

  // The persons — the third verb to take an infinitive, so no setup card again.
  {
    id: 'c151',
    element: 'je_dois',
    segments: [t('Je '), v('dois'), t(' travailler')],
    translation: [t('I '), v('have to'), t(' work')],
  },
  {
    id: 'c152',
    segments: [t('Tu dois travailler')],
    blank: 'Tu',
    translation: [v('You'), t(' have to work')],
  },
  {
    id: 'c153',
    element: 'il_doit',
    segments: [t('Il '), v('doit'), t(' travailler')],
    translation: [t('He '), v('has to'), t(' work')],
  },
  {
    id: 'c154',
    segments: [t('Elle doit rester ici')],
    blank: 'rester',
    translation: [t('She has to '), v('stay'), t(' here')],
  },
  {
    id: 'c155',
    element: 'nous_devons',
    segments: [t('Nous '), v('devons'), t(' partir')],
    translation: [t('We '), v('have to'), t(' leave')],
  },
  {
    id: 'c156',
    element: 'vous_devez',
    segments: [t('Vous '), v('devez'), t(' rester')],
    translation: [t('You '), v('have to'), t(' stay')],
  },
  {
    id: 'c157',
    element: 'ils_doivent',
    segments: [t('Ils '), v('doivent'), t(' travailler')],
    translation: [t('They '), v('have to'), t(' work')],
  },
  {
    id: 'c158',
    segments: [t('On doit partir maintenant')],
    blank: 'On',
    translation: [v('We'), t(' have to leave now')],
  },

  // Why — pourquoi asks it, parce que answers it.
  {
    id: 'c159',
    element: 'pourquoi',
    segments: [g('Pourquoi'), t(' est-ce que tu dois partir ?')],
    translation: [g('Why'), t(' do you have to leave?')],
  },
  {
    id: 'c160',
    element: 'parce_que',
    segments: [t('Je dois partir '), g('parce que'), t(' je suis fatigué')],
    translation: [t('I have to leave '), g('because'), t(' I am tired')],
  },
  {
    id: 'c161',
    segments: [t('Pourquoi est-ce qu\'elles doivent rester ?')],
    blank: 'rester',
    translation: [t('Why do they have to '), v('stay'), t('?')],
  },
  {
    id: 'c162',
    segments: [t('Elles doivent rester parce qu\'elles sont malades')],
    blank: 'malades',
    translation: [t('They have to stay because they are '), v('sick')],
  },
  {
    id: 'c163',
    segments: [t('On ne peut pas manger parce qu\'on doit partir')],
    blank: 'manger',
    translation: [t('We can\'t '), v('eat'), t(' because we have to leave')],
  },

  // Il faut — an obligation with nobody attached to it.
  {
    id: 'c164',
    element: 'il_faut',
    segments: [g('Il faut'), t(' partir')],
    translation: [g('One has to'), t(' leave')],
  },
  {
    id: 'c165',
    segments: [t('Il faut travailler')],
    blank: 'travailler',
    translation: [t('One has to '), v('work')],
  },
  {
    id: 'c166',
    element: 'payer',
    segments: [t('Est-ce qu\'il faut '), v('payer'), t(' ?')],
    translation: [t('Does one have to '), v('pay'), t('?')],
  },
  {
    id: 'c167',
    segments: [t('Il faut manger quelque chose')],
    blank: 'quelque chose',
    translation: [t('One has to eat '), v('something')],
  },
  {
    id: 'c168',
    segments: [t('Il ne faut pas rester ici')],
    blank: 'pas',
    translation: [t('One must '), g('not'), t(' stay here')],
  },
  {
    id: 'c169',
    element: 'argent',
    segments: [t('Il faut de l\''), v('argent')],
    translation: [t('One needs '), v('money')],
  },

  // The infinitive slot pays for itself — a verb a card.
  {
    id: 'c170',
    element: 'appeler',
    segments: [t('Je dois '), v('appeler'), t(' mon ami')],
    translation: [t('I have to '), v('call'), t(' my friend')],
  },
  {
    id: 'c171',
    segments: [t('Est-ce que tu peux appeler maintenant ?')],
    blank: 'appeler',
    translation: [t('Can you '), v('call'), t(' now?')],
  },
  {
    id: 'c172',
    element: 'demander',
    segments: [t('Il faut '), v('demander')],
    translation: [t('One has to '), v('ask')],
  },
  {
    id: 'c173',
    element: 'trouver',
    segments: [t('On doit '), v('trouver'), t(' une voiture')],
    translation: [t('We have to '), v('find'), t(' a car')],
  },
  {
    id: 'c174',
    segments: [t('Je ne peux pas trouver ma voiture')],
    blank: 'trouver',
    translation: [t('I can\'t '), v('find'), t(' my car')],
  },
  {
    id: 'c175',
    element: 'chercher',
    segments: [t('Il faut '), v('chercher'), t(' mon ami')],
    translation: [t('One has to '), v('look for'), t(' my friend')],
  },
  {
    id: 'c176',
    segments: [t('Pourquoi est-ce que tu dois chercher une voiture ?')],
    blank: 'Pourquoi',
    translation: [g('Why'), t(' do you have to look for a car?')],
  },
  {
    id: 'c177',
    element: 'je_voudrais',
    segments: [t('Je '), v('voudrais'), t(' un café, s\'il vous plaît')],
    translation: [t('I '), v('would like'), t(' a coffee, please')],
  },

  // Early, late, quickly.
  {
    id: 'c178',
    element: 'tot',
    segments: [t('Je dois partir '), v('tôt')],
    translation: [t('I have to leave '), v('early')],
  },
  {
    id: 'c179',
    element: 'tard',
    segments: [t('Elle doit travailler '), v('tard')],
    translation: [t('She has to work '), v('late')],
  },
  {
    id: 'c180',
    element: 'vite',
    segments: [t('Il faut manger '), v('vite')],
    translation: [t('One has to eat '), v('quickly')],
  },
  {
    id: 'c181',
    element: 'important',
    segments: [t('C\'est '), v('important')],
    translation: [t('It\'s '), v('important')],
  },
  {
    id: 'c182',
    segments: [t('Pourquoi est-ce que c\'est important ?')],
    blank: 'important',
    translation: [t('Why is it '), v('important'), t('?')],
  },

  // All three modals at once — what the last three blocks were building toward.
  {
    id: 'c183',
    segments: [t('Je veux partir, mais je dois travailler')],
    blank: 'dois',
    translation: [t('I want to leave, but I '), v('have to'), t(' work')],
  },
  {
    id: 'c184',
    segments: [t('On doit payer, mais on n\'a pas d\'argent')],
    blank: 'payer',
    translation: [t('We have to '), v('pay'), t(', but we don\'t have money')],
  },
  {
    id: 'c185',
    segments: [t('Il faut chercher une voiture parce qu\'on doit partir tôt')],
    blank: 'tôt',
    translation: [t('One has to look for a car because we have to leave '), v('early')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 6 — aller · cards 186–231
  // ───────────────────────────────────────────────────────────────────────────

  // A place to go: à and au enter on être, and aller enters as an infinitive
  // behind a known veux, so the drill below pays only for the verb forms.
  {
    id: 'c186',
    element: 'maison',
    segments: [t('C\'est ma '), v('maison')],
    translation: [t('It\'s my '), v('house')],
  },
  {
    id: 'c187',
    element: 'a_place',
    segments: [t('Mon ami est '), g('à'), t(' la maison')],
    translation: [t('My friend is '), g('at'), t(' home')],
  },
  {
    id: 'c188',
    element: 'travail',
    segments: [t('C\'est mon '), v('travail')],
    translation: [t('It\'s my '), v('work')],
  },
  {
    id: 'c189',
    element: 'au',
    segments: [t('Il est '), g('au'), t(' travail')],
    translation: [t('He is '), g('at'), t(' work')],
  },
  {
    id: 'c190',
    element: 'aller',
    segments: [t('Je veux '), v('aller'), t(' au travail')],
    translation: [t('I want '), v('to go'), t(' to work')],
  },

  // The persons, place held still.
  {
    id: 'c191',
    element: 'je_vais',
    segments: [t('Je '), v('vais'), t(' au travail')],
    translation: [t('I\'m '), v('going'), t(' to work')],
  },
  {
    id: 'c192',
    element: 'tu_vas',
    segments: [t('Tu '), v('vas'), t(' au travail')],
    translation: [t('You\'re '), v('going'), t(' to work')],
  },
  {
    id: 'c193',
    element: 'il_va',
    segments: [t('Il '), v('va'), t(' au travail')],
    translation: [t('He\'s '), v('going'), t(' to work')],
  },
  {
    id: 'c194',
    segments: [t('Elle va au travail')],
    blank: 'va',
    translation: [t('She\'s '), v('going'), t(' to work')],
  },
  {
    id: 'c195',
    element: 'nous_allons',
    segments: [t('Nous '), v('allons'), t(' au travail')],
    translation: [t('We\'re '), v('going'), t(' to work')],
  },
  {
    id: 'c196',
    element: 'vous_allez',
    segments: [t('Vous '), v('allez'), t(' au travail')],
    translation: [t('You\'re '), v('going'), t(' to work')],
  },
  {
    id: 'c197',
    element: 'ils_vont',
    segments: [t('Ils '), v('vont'), t(' au travail')],
    translation: [t('They\'re '), v('going'), t(' to work')],
  },
  {
    id: 'c198',
    segments: [t('Elles vont au travail')],
    blank: 'vont',
    translation: [t('They\'re '), v('going'), t(' to work')],
  },
  {
    id: 'c199',
    segments: [t('On va au travail')],
    blank: 'va',
    translation: [t('We\'re '), v('going'), t(' to work')],
  },

  // Going places — the place nouns, and au / à la / à l' / en chosen against
  // each other.
  {
    id: 'c200',
    segments: [t('Est-ce que tu vas à la maison ?')],
    blank: 'vas',
    translation: [t('Are you '), v('going'), t(' home?')],
  },
  {
    id: 'c201',
    element: 'bureau',
    segments: [t('On va au '), v('bureau')],
    translation: [t('We\'re going to the '), v('office')],
  },
  {
    id: 'c202',
    segments: [t('Où est le bureau ?')],
    blank: 'Où',
    translation: [g('Where'), t(' is the office?')],
  },
  {
    id: 'c203',
    segments: [t('Elle ne va pas au bureau')],
    blank: 'au',
    translation: [t('She\'s not going '), g('to the'), t(' office')],
  },
  {
    id: 'c204',
    element: 'marche',
    segments: [t('Il faut chercher du pain au '), v('marché')],
    translation: [t('One has to look for bread at the '), v('market')],
  },
  {
    id: 'c205',
    element: 'restaurant',
    segments: [t('Nous allons au '), v('restaurant')],
    translation: [t('We\'re going to the '), v('restaurant')],
  },
  {
    id: 'c206',
    segments: [t('Ils ont des amis au restaurant')],
    blank: 'des',
    translation: [t('They have '), gi('some'), t(' friends at the restaurant')],
  },
  {
    id: 'c207',
    element: 'gare',
    segments: [t('Vous allez à la '), v('gare'), t(' ?')],
    translation: [t('Are you going to the '), v('station'), t('?')],
  },
  {
    id: 'c208',
    segments: [t('Le bus va à la gare')],
    blank: 'bus',
    translation: [t('The '), v('bus'), t(' goes to the station')],
  },
  {
    id: 'c209',
    segments: [t('Vous êtes à la gare, mais il n\'y a pas de bus')],
    blank: 'êtes',
    translation: [t('You '), v('are'), t(' at the station, but there is no bus')],
  },
  {
    id: 'c210',
    element: 'ecole',
    segments: [t('Mon ami va à l\''), v('école')],
    translation: [t('My friend is going to '), v('school')],
  },
  {
    id: 'c211',
    segments: [t('Est-ce que tu vas à l\'école ou au travail ?')],
    blank: 'ou',
    translation: [t('Are you going to school '), v('or'), t(' to work?')],
  },
  {
    id: 'c212',
    element: 'en_ville',
    segments: [t('On va '), g('en ville')],
    translation: [t('We\'re going '), g('into town')],
  },
  {
    id: 'c213',
    element: 'comment',
    segments: [g('Comment'), t(' est-ce qu\'on va en ville ?')],
    translation: [g('How'), t(' do we go into town?')],
  },

  // Going to do something — the near future. It has no word of its own, so it
  // arrives on a rest card and the panel carries it.
  {
    id: 'c214',
    segments: [t('Je vais manger')],
    blank: 'vais',
    translation: [t('I\'m '), v('going'), t(' to eat')],
  },
  {
    id: 'c215',
    segments: [t('Tu vas manger ?')],
    blank: 'vas',
    translation: [t('Are you '), v('going'), t(' to eat?')],
  },
  {
    id: 'c216',
    element: 'demain',
    segments: [t('On va payer '), v('demain')],
    translation: [t('We\'re going to pay '), v('tomorrow')],
  },
  {
    id: 'c217',
    element: 'aujourdhui',
    segments: [t('Elle va travailler '), v('aujourd\'hui')],
    translation: [t('She\'s going to work '), v('today')],
  },
  {
    id: 'c218',
    segments: [t('Je ne vais pas travailler aujourd\'hui')],
    blank: 'travailler',
    translation: [t('I\'m not going '), v('to work'), t(' today')],
  },
  {
    id: 'c219',
    segments: [t('Est-ce que vous allez rester là ?')],
    blank: 'là',
    translation: [t('Are you going to stay '), v('there'), t('?')],
  },
  {
    id: 'c220',
    segments: [t('Ils vont manger et boire au restaurant')],
    blank: 'et',
    translation: [t('They\'re going to eat '), v('and'), t(' drink at the restaurant')],
  },
  {
    id: 'c221',
    segments: [t('Nous allons chercher une voiture')],
    blank: 'chercher',
    translation: [t('We\'re going '), v('to look for'), t(' a car')],
  },
  {
    id: 'c222',
    segments: [t('Vous voulez aller en ville ?')],
    blank: 'aller',
    translation: [t('Do you want '), v('to go'), t(' into town?')],
  },
  {
    id: 'c223',
    segments: [t('Nous avons besoin d\'une voiture pour aller à la gare')],
    blank: 'besoin',
    translation: [t('We '), v('need'), t(' a car to go to the station')],
  },
  {
    id: 'c224',
    segments: [t('Il faut aller au travail tôt')],
    blank: 'tôt',
    translation: [t('One has to go to work '), v('early')],
  },
  {
    id: 'c225',
    segments: [t('Je suis content parce qu\'on va aller au restaurant demain')],
    blank: 'content',
    translation: [t('I am '), v('glad'), t(' because we\'re going to go to the restaurant tomorrow')],
  },

  // Ça va — the frozen expression the whole block was waiting for.
  {
    id: 'c226',
    element: 'ca_va',
    segments: [g('Ça va'), t(' ?')],
    translation: [g('How are you'), t('?')],
  },
  {
    id: 'c227',
    segments: [t('Ça va bien')],
    blank: 'bien',
    translation: [t('It\'s going '), v('well')],
  },
  {
    id: 'c228',
    element: 'mal',
    segments: [t('Ça va '), v('mal'), t(' aujourd\'hui')],
    translation: [t('It\'s going '), v('badly'), t(' today')],
  },
  {
    id: 'c229',
    element: 'comment_allez_vous',
    segments: [g('Comment allez-vous'), t(' ?')],
    translation: [g('How are you'), t('?')],
  },
  {
    id: 'c230',
    segments: [t('Je vais bien, merci')],
    blank: 'merci',
    translation: [t('I am well, '), v('thank you')],
  },
  {
    id: 'c231',
    segments: [t('Ça va, mais je suis très fatigué')],
    blank: 'mais',
    translation: [t('It\'s all right, '), v('but'), t(' I am very tired')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 7 — faire · cards 232–271
  // ───────────────────────────────────────────────────────────────────────────

  // The verb's name first, then something to do with it.
  {
    id: 'c232',
    element: 'faire',
    segments: [t('Je vais '), v('faire'), t(' quelque chose maintenant')],
    translation: [t('I\'m going '), v('to do'), t(' something now')],
  },
  {
    id: 'c233',
    element: 'sport',
    segments: [t('Il faut faire du '), v('sport')],
    translation: [t('One has to do '), v('sport')],
  },
  {
    id: 'c234',
    segments: [t('Nous voulons faire du sport ensemble')],
    blank: 'voulons',
    translation: [t('We '), v('want'), t(' to do sport together')],
  },

  // The persons, activity held still.
  {
    id: 'c235',
    element: 'je_fais',
    segments: [t('Je '), v('fais'), t(' du sport')],
    translation: [t('I '), v('do'), t(' sport')],
  },
  {
    id: 'c236',
    segments: [t('Tu fais du sport')],
    blank: 'fais',
    translation: [t('You '), v('do'), t(' sport')],
  },
  {
    id: 'c237',
    element: 'il_fait',
    segments: [t('Il '), v('fait'), t(' du sport')],
    translation: [t('He '), v('does'), t(' sport')],
  },
  {
    id: 'c238',
    segments: [t('Elle fait du sport')],
    blank: 'fait',
    translation: [t('She '), v('does'), t(' sport')],
  },
  {
    id: 'c239',
    element: 'nous_faisons',
    segments: [t('Nous '), v('faisons'), t(' du sport')],
    translation: [t('We '), v('do'), t(' sport')],
  },
  {
    id: 'c240',
    element: 'vous_faites',
    segments: [t('Vous '), v('faites'), t(' du sport')],
    translation: [t('You '), v('do'), t(' sport')],
  },
  {
    id: 'c241',
    element: 'ils_font',
    segments: [t('Ils '), v('font'), t(' du sport')],
    translation: [t('They '), v('do'), t(' sport')],
  },
  {
    id: 'c242',
    segments: [t('Elles font du sport')],
    blank: 'font',
    translation: [t('They '), v('do'), t(' sport')],
  },
  {
    id: 'c243',
    segments: [t('On fait du sport')],
    blank: 'fait',
    translation: [t('We '), v('do'), t(' sport')],
  },

  // Spending it — the activities, and the articles they insist on.
  {
    id: 'c244',
    segments: [t('Je ne fais pas de sport')],
    blank: 'fais',
    translation: [t('I don\'t '), v('do'), t(' sport')],
  },
  {
    id: 'c245',
    segments: [t('Ils font du sport avec des amis')],
    blank: 'sport',
    translation: [t('They do '), v('sport'), t(' with friends')],
  },
  {
    id: 'c246',
    element: 'cuisine',
    segments: [t('Je vais faire la '), v('cuisine')],
    translation: [t('I\'m going to do the '), v('cooking')],
  },
  {
    id: 'c247',
    segments: [t('Est-ce que tu fais la cuisine ?')],
    blank: 'fais',
    translation: [t('Do you '), v('do'), t(' the cooking?')],
  },
  {
    id: 'c248',
    element: 'menage',
    segments: [t('Il faut faire le '), v('ménage')],
    translation: [t('One has to do the '), v('housework')],
  },
  {
    id: 'c249',
    segments: [t('Ils ne veulent pas faire le ménage')],
    blank: 'veulent',
    translation: [t('They don\'t '), v('want'), t(' to do the housework')],
  },
  {
    id: 'c250',
    segments: [t('On fait le ménage, mais on n\'a pas le temps')],
    blank: 'temps',
    translation: [t('We\'re doing the housework, but we don\'t have '), v('time')],
  },
  {
    id: 'c251',
    segments: [t('Nous pouvons faire le ménage demain')],
    blank: 'pouvons',
    translation: [t('We '), v('can'), t(' do the housework tomorrow')],
  },
  {
    id: 'c252',
    segments: [t('Je suis occupé, je fais le ménage')],
    blank: 'occupé',
    translation: [t('I am '), v('busy'), t(', I\'m doing the housework')],
  },

  // Asking what.
  {
    id: 'c253',
    element: 'quest_ce_que',
    segments: [g('Qu\'est-ce que'), t(' tu fais ?')],
    translation: [g('What'), t(' are you doing?')],
  },
  {
    id: 'c254',
    element: 'quoi',
    segments: [t('Tu fais '), g('quoi'), t(' ?')],
    translation: [g('What'), t(' are you doing?')],
  },
  {
    id: 'c255',
    segments: [t('Qu\'est-ce que c\'est ?')],
    blank: 'c\'est',
    translation: [t('What '), g('is it'), t('?')],
  },
  {
    id: 'c256',
    segments: [t('Qu\'est-ce qu\'on va faire aujourd\'hui ?')],
    blank: 'faire',
    translation: [t('What are we going '), v('to do'), t(' today?')],
  },
  {
    id: 'c257',
    segments: [t('Qu\'est-ce que vous faites ici ?')],
    blank: 'faites',
    translation: [t('What do you '), v('do'), t(' here?')],
  },
  {
    id: 'c258',
    segments: [t('Qu\'est-ce qu\'ils font au bureau ?')],
    blank: 'bureau',
    translation: [t('What are they doing at the '), v('office'), t('?')],
  },

  // The weather — the adjective on the table, then faire takes it over.
  {
    id: 'c259',
    element: 'chaud',
    segments: [t('Le café est '), v('chaud')],
    translation: [t('The coffee is '), v('hot')],
  },
  {
    id: 'c260',
    segments: [t('Il fait chaud aujourd\'hui')],
    blank: 'fait',
    translation: [t('It '), v('is'), t(' hot today')],
  },
  {
    id: 'c261',
    segments: [t('Il fait chaud, j\'ai soif et je veux de l\'eau')],
    blank: 'de l\'eau',
    translation: [t('It is hot, I am thirsty and I want '), gi('some'), g(' water')],
  },
  {
    id: 'c262',
    element: 'froid',
    segments: [t('Il fait '), v('froid')],
    translation: [t('It is '), v('cold')],
  },
  {
    id: 'c263',
    segments: [t('Il fait froid, mais je vais sortir')],
    blank: 'sortir',
    translation: [t('It is cold, but I\'m going '), v('to go out')],
  },
  {
    id: 'c264',
    segments: [t('Est-ce qu\'il fait froid en ville ?')],
    blank: 'en ville',
    translation: [t('Is it cold '), g('in town'), t('?')],
  },
  {
    id: 'c265',
    segments: [t('Est-ce que vous avez froid ?')],
    blank: 'avez',
    translation: [v('Are'), t(' you cold?')],
  },
  {
    id: 'c266',
    element: 'beau',
    segments: [t('Il fait '), v('beau')],
    translation: [t('It is '), v('nice out')],
  },
  {
    id: 'c267',
    segments: [t('Il ne fait pas beau, je vais rester à la maison')],
    blank: 'rester',
    translation: [t('It is not nice out, I\'m going '), v('to stay'), t(' home')],
  },
  {
    id: 'c268',
    element: 'quel_temps_fait_il',
    segments: [g('Quel temps fait-il'), t(' ?')],
    translation: [g('What is the weather like'), t('?')],
  },
  {
    id: 'c269',
    segments: [t('Il fait beau aujourd\'hui, on va faire du sport')],
    blank: 'va',
    translation: [t('It is nice out today, we\'re '), v('going'), t(' to do sport')],
  },
  {
    id: 'c270',
    segments: [t('Vous faites du sport aussi ?')],
    blank: 'aussi',
    translation: [t('Do you do sport '), v('too'), t('?')],
  },
  {
    id: 'c271',
    segments: [t('On peut faire du sport ou aller en ville')],
    blank: 'ou',
    translation: [t('We can do sport '), g('or'), t(' go into town')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 8 — regular -er verbs · cards 272–310
  // ───────────────────────────────────────────────────────────────────────────

  // The pattern, on parler — five spellings for six persons, paid one at a time.
  {
    id: 'c272',
    element: 'je_parle',
    segments: [t('Je '), v('parle'), t(' vite')],
    translation: [t('I '), v('speak'), t(' fast')],
  },
  {
    id: 'c273',
    element: 'tu_parles',
    segments: [t('Tu '), v('parles'), t(' vite')],
    translation: [t('You '), v('speak'), t(' fast')],
  },
  {
    id: 'c274',
    segments: [t('Il parle vite')],
    blank: 'parle',
    translation: [t('He '), v('speaks'), t(' fast')],
  },
  {
    id: 'c275',
    segments: [t('Elle parle vite')],
    blank: 'parle',
    translation: [t('She '), v('speaks'), t(' fast')],
  },
  {
    id: 'c276',
    element: 'nous_parlons',
    segments: [t('Nous '), v('parlons'), t(' vite')],
    translation: [t('We '), v('speak'), t(' fast')],
  },
  {
    id: 'c277',
    element: 'vous_parlez',
    segments: [t('Vous '), v('parlez'), t(' vite')],
    translation: [t('You '), v('speak'), t(' fast')],
  },
  {
    id: 'c278',
    element: 'ils_parlent',
    segments: [t('Ils '), v('parlent'), t(' vite')],
    translation: [t('They '), v('speak'), t(' fast')],
  },
  {
    id: 'c279',
    segments: [t('Elles parlent vite')],
    blank: 'parlent',
    translation: [t('They '), v('speak'), t(' fast')],
  },
  {
    id: 'c280',
    segments: [t('On parle vite')],
    blank: 'parle',
    translation: [t('We '), v('speak'), t(' fast')],
  },

  // Spending it.
  {
    id: 'c281',
    segments: [t('Ils ne parlent pas vite')],
    blank: 'parlent',
    translation: [t('They don\'t '), v('speak'), t(' fast')],
  },
  {
    id: 'c282',
    segments: [t('Je parle avec des amis au bureau')],
    blank: 'amis',
    translation: [t('I talk with '), v('friends'), t(' at the office')],
  },
  {
    id: 'c283',
    segments: [t('Pourquoi est-ce qu\'ils ne parlent pas ?')],
    blank: 'Pourquoi',
    translation: [g('Why'), t(' don\'t they talk?')],
  },
  {
    id: 'c284',
    segments: [t('On parle un peu, mais on doit travailler')],
    blank: 'un peu',
    translation: [t('We talk '), v('a little'), t(', but we have to work')],
  },

  // The pattern transfers — regarder pays once, and every form is still shown.
  {
    id: 'c285',
    element: 'television',
    segments: [t('Il y a une '), v('télévision'), t(' à la maison')],
    translation: [t('There is a '), v('television'), t(' at home')],
  },
  {
    id: 'c286',
    element: 'regarde',
    segments: [t('Je '), v('regarde'), t(' la télévision')],
    translation: [t('I '), v('watch'), t(' television')],
  },
  {
    id: 'c287',
    segments: [t('Nous regardons la télévision ensemble')],
    blank: 'regardons',
    translation: [t('We '), v('watch'), t(' television together')],
  },
  {
    id: 'c288',
    segments: [t('Est-ce que vous regardez la télévision ?')],
    blank: 'regardez',
    translation: [t('Do you '), v('watch'), t(' television?')],
  },
  {
    id: 'c289',
    segments: [t('Ils regardent la télévision, mais ils ne parlent pas')],
    blank: 'regardent',
    translation: [t('They '), v('watch'), t(' television, but they don\'t talk')],
  },
  {
    id: 'c290',
    segments: [t('Elle ne regarde pas la télévision')],
    blank: 'regarde',
    translation: [t('She doesn\'t '), v('watch'), t(' television')],
  },

  // One element each, three or four uses each.
  {
    id: 'c291',
    element: 'musique',
    segments: [t('Il y a de la '), v('musique'), t(' au restaurant')],
    translation: [t('There is '), v('music'), t(' at the restaurant')],
  },
  {
    id: 'c292',
    element: 'ecoute',
    segments: [t('J\''), v('écoute'), t(' la musique')],
    translation: [t('I '), v('listen to'), t(' music')],
  },
  {
    id: 'c293',
    segments: [t('On écoute la musique et on ne parle pas')],
    blank: 'écoute',
    translation: [t('We '), v('listen to'), t(' music and we don\'t talk')],
  },
  {
    id: 'c294',
    element: 'habite',
    segments: [t('J\''), v('habite'), t(' en ville')],
    translation: [t('I '), v('live'), t(' in town')],
  },
  {
    id: 'c295',
    segments: [t('Où est-ce que tu habites ?')],
    blank: 'habites',
    translation: [t('Where do you '), v('live'), t('?')],
  },
  {
    id: 'c296',
    segments: [t('Est-ce qu\'elles habitent ensemble ?')],
    blank: 'habitent',
    translation: [t('Do they '), v('live'), t(' together?')],
  },
  {
    id: 'c297',
    element: 'donne',
    segments: [t('Je '), v('donne'), t(' un peu d\'argent')],
    translation: [t('I '), v('give'), t(' a little money')],
  },
  {
    id: 'c298',
    segments: [t('Qu\'est-ce que vous donnez ?')],
    blank: 'donnez',
    translation: [t('What do you '), v('give'), t('?')],
  },
  {
    id: 'c299',
    segments: [t('On ne donne pas d\'argent')],
    blank: 'donne',
    translation: [t('We don\'t '), v('give'), t(' money')],
  },
  {
    id: 'c300',
    element: 'aime',
    segments: [t('J\''), v('aime'), t(' la musique')],
    translation: [t('I '), v('like'), t(' music')],
  },
  {
    id: 'c301',
    segments: [t('Est-ce que tu aimes le café ?')],
    blank: 'aimes',
    translation: [t('Do you '), v('like'), t(' coffee?')],
  },
  {
    id: 'c302',
    segments: [t('Nous aimons faire du sport')],
    blank: 'aimons',
    translation: [t('We '), v('like'), t(' to do sport')],
  },
  {
    id: 'c303',
    element: 'pense',
    segments: [t('Elle '), v('pense'), t(' vite')],
    translation: [t('She '), v('thinks'), t(' fast')],
  },
  {
    id: 'c304',
    segments: [t('Qu\'est-ce que tu penses ?')],
    blank: 'penses',
    translation: [t('What do you '), v('think'), t('?')],
  },
  {
    id: 'c305',
    segments: [t('Je ne pense pas')],
    blank: 'pense',
    translation: [t('I don\'t '), v('think'), t(' so')],
  },

  // People.
  {
    id: 'c306',
    element: 'personne',
    segments: [t('Il y a une '), v('personne'), t(' ici')],
    translation: [t('There is a '), v('person'), t(' here')],
  },
  {
    id: 'c307',
    segments: [t('Il y a deux personnes ici')],
    blank: 'deux',
    translation: [t('There are '), v('two'), t(' people here')],
  },
  {
    id: 'c308',
    segments: [t('Est-ce que la personne parle vite ?')],
    blank: 'personne',
    translation: [t('Does the '), v('person'), t(' speak fast?')],
  },
  {
    id: 'c309',
    segments: [t('Est-ce que vous avez de la musique ?')],
    blank: 'avez',
    translation: [t('Do you '), v('have'), t(' music?')],
  },
  {
    id: 'c310',
    segments: [t('Vous pouvez parler ou écouter')],
    blank: 'pouvez',
    translation: [t('You '), v('can'), t(' speak or listen')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 9 — more -er verbs, adverbs, frequency · cards 311–350
  // ───────────────────────────────────────────────────────────────────────────

  // The endings, turned on for every -er infinitive already known.
  {
    id: 'c311',
    element: 'travaillons',
    segments: [t('Nous '), v('travaillons'), t(' ensemble')],
    translation: [t('We '), v('work'), t(' together')],
  },

  // New verbs, one element each.
  {
    id: 'c312',
    element: 'arrive',
    segments: [t('J\''), v('arrive'), t(' maintenant')],
    translation: [t('I\'m '), v('arriving'), t(' now')],
  },
  {
    id: 'c313',
    segments: [t('Est-ce que vous arrivez tôt ?')],
    blank: 'arrivez',
    translation: [t('Do you '), v('arrive'), t(' early?')],
  },
  {
    id: 'c314',
    segments: [t('Ils n\'arrivent pas')],
    blank: 'arrivent',
    translation: [t('They aren\'t '), v('arriving')],
  },
  {
    id: 'c315',
    element: 'commence',
    segments: [t('On '), v('commence'), t(' maintenant')],
    translation: [t('We '), v('start'), t(' now')],
  },
  {
    id: 'c316',
    segments: [t('Est-ce que tu commences le travail ?')],
    blank: 'commences',
    translation: [t('Are you '), v('starting'), t(' work?')],
  },
  {
    id: 'c317',
    element: 'commencons',
    segments: [t('Nous '), v('commençons'), t(' le travail')],
    translation: [t('We '), v('start'), t(' work')],
  },
  {
    id: 'c318',
    segments: [t('Ils ne commencent pas tôt')],
    blank: 'commencent',
    translation: [t('They don\'t '), v('start'), t(' early')],
  },
  {
    id: 'c319',
    element: 'arrete',
    segments: [t('J\''), v('arrête'), t(' le travail')],
    translation: [t('I '), v('stop'), t(' work')],
  },
  {
    id: 'c320',
    segments: [t('Pourquoi est-ce que vous arrêtez ?')],
    blank: 'arrêtez',
    translation: [t('Why are you '), v('stopping'), t('?')],
  },
  {
    id: 'c321',
    segments: [t('On arrête maintenant, il n\'y a pas de problème')],
    blank: 'arrête',
    translation: [t('We '), v('stop'), t(' now, there is no problem')],
  },
  {
    id: 'c322',
    element: 'oublie',
    segments: [t('J\''), v('oublie'), t(' le problème')],
    translation: [t('I '), v('forget'), t(' the problem')],
  },
  {
    id: 'c323',
    segments: [t('Est-ce que vous oubliez le travail ?')],
    blank: 'oubliez',
    translation: [t('Do you '), v('forget'), t(' work?')],
  },
  {
    id: 'c324',
    segments: [t('Je ne veux pas oublier mon ami')],
    blank: 'oublier',
    translation: [t('I don\'t want '), v('to forget'), t(' my friend')],
  },

  // Adverbs — French puts them straight after the verb.
  {
    id: 'c325',
    element: 'toujours',
    segments: [t('Je parle '), v('toujours'), t(' vite')],
    translation: [t('I '), v('always'), t(' speak fast')],
  },
  {
    id: 'c326',
    segments: [t('Il est toujours en retard')],
    blank: 'en retard',
    translation: [t('He is always '), g('late')],
  },
  {
    id: 'c327',
    segments: [t('On travaille toujours ensemble')],
    blank: 'travaille',
    translation: [t('We always '), v('work'), t(' together')],
  },
  {
    id: 'c328',
    element: 'souvent',
    segments: [t('Elle écoute '), v('souvent'), t(' la musique')],
    translation: [t('She '), v('often'), t(' listens to music')],
  },
  {
    id: 'c329',
    segments: [t('Est-ce que vous parlez souvent avec des amis ?')],
    blank: 'souvent',
    translation: [t('Do you '), v('often'), t(' talk with friends?')],
  },
  {
    id: 'c330',
    segments: [t('Nous allons souvent boire du café')],
    blank: 'allons',
    translation: [t('We often '), v('go'), t(' to drink coffee')],
  },
  {
    id: 'c331',
    element: 'beaucoup',
    segments: [t('J\'aime '), v('beaucoup'), t(' la musique')],
    translation: [t('I like music '), v('a lot')],
  },
  {
    id: 'c332',
    segments: [t('Est-ce que tu penses beaucoup ?')],
    blank: 'beaucoup',
    translation: [t('Do you think '), v('a lot'), t('?')],
  },
  {
    id: 'c333',
    segments: [t('Peut-être, mais on ne parle pas beaucoup')],
    blank: 'beaucoup',
    translation: [t('Maybe, but we don\'t talk '), v('much')],
  },
  {
    id: 'c334',
    element: 'assez',
    segments: [t('Vous ne parlez pas '), v('assez')],
    translation: [t('You don\'t speak '), v('enough')],
  },
  {
    id: 'c335',
    segments: [t('Est-ce que c\'est assez ?')],
    blank: 'assez',
    translation: [t('Is that '), v('enough'), t('?')],
  },
  {
    id: 'c336',
    segments: [t('Elle ne donne pas assez')],
    blank: 'donne',
    translation: [t('She doesn\'t '), v('give'), t(' enough')],
  },
  {
    id: 'c337',
    element: 'deja',
    segments: [t('Il est '), v('déjà'), t(' tard')],
    translation: [t('It is '), v('already'), t(' late')],
  },
  {
    id: 'c338',
    segments: [t('Est-ce que vous commencez déjà ?')],
    blank: 'commencez',
    translation: [t('Are you already '), v('starting'), t('?')],
  },
  {
    id: 'c339',
    segments: [t('On est déjà en ville')],
    blank: 'déjà',
    translation: [t('We\'re '), v('already'), t(' in town')],
  },

  // Never.
  {
    id: 'c340',
    element: 'ne_jamais',
    segments: [t('Je '), g('ne'), t(' parle '), g('jamais'), t(' vite')],
    translation: [t('I '), g('never'), t(' speak fast')],
  },
  {
    id: 'c341',
    segments: [t('Elle ne regarde jamais la télévision')],
    blank: 'jamais',
    translation: [t('She '), g('never'), t(' watches television')],
  },
  {
    id: 'c342',
    segments: [t('Ils n\'écoutent jamais la musique')],
    blank: 'écoutent',
    translation: [t('They never '), v('listen to'), t(' music')],
  },
  {
    id: 'c343',
    segments: [t('On ne donne jamais d\'argent')],
    blank: 'jamais',
    translation: [t('We '), g('never'), t(' give money')],
  },
  {
    id: 'c344',
    segments: [t('Vous n\'êtes jamais en retard')],
    blank: 'jamais',
    translation: [t('You are '), g('never'), t(' late')],
  },

  // Old words coming back.
  {
    id: 'c345',
    segments: [t('Tu as toujours faim')],
    blank: 'faim',
    translation: [t('You are always '), v('hungry')],
  },
  {
    id: 'c346',
    segments: [t('Nous sommes toujours ensemble')],
    blank: 'sommes',
    translation: [t('We '), v('are'), t(' always together')],
  },
  {
    id: 'c347',
    segments: [t('Il veut souvent parler ou écouter')],
    blank: 'veut',
    translation: [t('He often '), v('wants'), t(' to talk or listen')],
  },
  {
    id: 'c348',
    segments: [t('Ils peuvent entrer maintenant')],
    blank: 'peuvent',
    translation: [t('They '), v('can'), t(' come in now')],
  },
  {
    id: 'c349',
    segments: [t('Oui, d\'accord, on commence')],
    blank: 'd\'accord',
    translation: [t('Yes, '), v('okay'), t(', we start')],
  },
  {
    id: 'c350',
    segments: [t('Non, elle n\'aime pas ça et elle ne regarde jamais')],
    blank: 'Non',
    translation: [v('No'), t(', she doesn\'t like that and she never watches')],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 10 — stem-changing -er verbs · cards 351–375
  // ───────────────────────────────────────────────────────────────────────────

  // manger — the e survives at nous to keep the g soft.
  {
    id: 'c351',
    element: 'mange',
    segments: [t('Je '), v('mange'), t(' du pain')],
    translation: [t('I '), v('eat'), t(' bread')],
  },
  {
    id: 'c352',
    segments: [t('Nous mangeons du pain')],
    blank: 'mangeons',
    translation: [t('We '), v('eat'), t(' bread')],
  },
  {
    id: 'c353',
    segments: [t('Mon ami mange au restaurant')],
    blank: 'mange',
    translation: [t('My friend '), v('eats'), t(' at the restaurant')],
  },

  // appeler — one l where the ending is heard, two where it is silent.
  {
    id: 'c354',
    element: 'appelle',
    segments: [t('J\''), v('appelle'), t(' mon ami')],
    translation: [t('I '), v('call'), t(' my friend')],
  },
  {
    id: 'c355',
    segments: [t('Est-ce que vous appelez le bureau ?')],
    blank: 'appelez',
    translation: [t('Are you '), v('calling'), t(' the office?')],
  },
  {
    id: 'c356',
    segments: [t('Elles appellent souvent')],
    blank: 'appellent',
    translation: [t('They '), v('call'), t(' often')],
  },

  // payer — y becomes i.
  {
    id: 'c357',
    element: 'paie',
    segments: [t('Elle '), v('paie'), t(' le café')],
    translation: [t('She '), v('pays'), t(' for the coffee')],
  },
  {
    id: 'c358',
    segments: [t('Nous payons ensemble')],
    blank: 'payons',
    translation: [t('We '), v('pay'), t(' together')],
  },
  {
    id: 'c359',
    segments: [t('La personne ne paie jamais')],
    blank: 'personne',
    translation: [t('The '), v('person'), t(' never pays')],
  },

  // essayer — the same change, on a verb the deck has not met before.
  {
    id: 'c360',
    element: 'essaie',
    segments: [t('J\''), v('essaie'), t(' la voiture')],
    translation: [t('I '), v('try'), t(' the car')],
  },
  {
    id: 'c361',
    segments: [t('Est-ce que vous essayez aussi ?')],
    blank: 'essayez',
    translation: [t('Are you '), v('trying'), t(' too?')],
  },
  {
    id: 'c362',
    segments: [t('Ils essaient ou ils arrêtent')],
    blank: 'essaient',
    translation: [t('They '), v('try'), t(' or they stop')],
  },

  // préférer — é flips to è where the ending goes silent.
  {
    id: 'c363',
    element: 'prefere',
    segments: [t('On '), v('préfère'), t(' le café')],
    translation: [t('We '), v('prefer'), t(' coffee')],
  },
  {
    id: 'c364',
    segments: [t('Nous préférons le pain')],
    blank: 'préférons',
    translation: [t('We '), v('prefer'), t(' bread')],
  },
  {
    id: 'c365',
    segments: [t('Mon ami préfère rester ici')],
    blank: 'préfère',
    translation: [t('My friend '), v('prefers'), t(' to stay here')],
  },

  // acheter — a bare e takes an accent for the same reason.
  {
    id: 'c366',
    element: 'achete',
    segments: [t('J\''), v('achète'), t(' du pain au marché')],
    translation: [t('I '), v('buy'), t(' bread at the market')],
  },
  {
    id: 'c367',
    segments: [t('Vous achetez une voiture ?')],
    blank: 'achetez',
    translation: [t('You are '), v('buying'), t(' a car?')],
  },
  {
    id: 'c368',
    segments: [t('Est-ce que tu achètes du café ?')],
    blank: 'achètes',
    translation: [t('Are you '), v('buying'), t(' coffee?')],
  },

  // Things doing the verb, not people.
  {
    id: 'c369',
    segments: [t('Le bus arrive tôt')],
    blank: 'arrive',
    translation: [t('The bus '), v('arrives'), t(' early')],
  },
  {
    id: 'c370',
    segments: [t('C\'est assez ?')],
    blank: 'assez',
    translation: [t('Is that '), v('enough'), t('?')],
  },
  {
    id: 'c371',
    segments: [t('Ils ont du pain, mais il n\'y a pas de café')],
    blank: 'ont',
    translation: [t('They '), v('have'), t(' bread, but there is no coffee')],
  },
  {
    id: 'c372',
    segments: [t('Il fait froid, mais le café est chaud')],
    blank: 'chaud',
    translation: [t('It is cold, but the coffee is '), v('hot')],
  },
  {
    id: 'c373',
    segments: [t('Ça va, on mange avec des amis')],
    blank: 'amis',
    translation: [t('It\'s fine, we eat with '), v('friends')],
  },
  {
    id: 'c374',
    segments: [t('Vous devez essayer et payer')],
    blank: 'devez',
    translation: [t('You '), v('have to'), t(' try and pay')],
  },
  {
    id: 'c375',
    segments: [t('Il fait beau, on achète du café au marché')],
    blank: 'achète',
    translation: [t('It is nice out, we '), v('buy'), t(' coffee at the market')],
  },
]
