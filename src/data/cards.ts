import type { Card, Segment } from '../types'

/**
 * The deck, transcribed one-for-one from md/sentences.md and validated i+1 (see
 * src/engine/i1.ts). Each card is one whole French sentence built from
 * already-known words plus a single new element, which it highlights:
 *
 *   v(...) → yellow, new vocabulary
 *   g(...) → blue,   a new grammar concept
 *   t(...) → plain,  already-known text
 *
 * `segments` is the French (back); `translation` is the English (front). The
 * translation highlights the English counterpart of *the word the gap takes
 * out*, which the answer bolds — on most cards that is the new element, but it
 * is the blank that decides, so rest cards bold too. The kind is the kind of
 * the English word being pointed at: `v` for a content word, `g` for a piece of
 * grammar. It stays plain only where the blanked word has no English word of
 * its own (`Est-ce que`).
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
    note: 'The simplest way to ask a yes/no question in French is to say the statement and let your voice rise at the end. Nothing is added and no words move: vous êtes occupé becomes vous êtes occupé ? This is what people use most in conversation.',
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
    note: 'When ne meets a word starting with a vowel, it loses its e and joins on with an apostrophe: ne es → n\'es. French does this with several short words (je → j\', que → qu\', de → d\', le → l\'). It is automatic and never optional.',
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
    note: 'que drops its e in front of a vowel and joins on: est-ce que il → est-ce qu\'il. The same happens with elle and on: est-ce qu\'elle, est-ce qu\'on.',
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
    note: 'To ask where something is, French puts où first and the verb straight after it: où est ma voiture ? The subject follows the verb. This is a fixed shape worth learning whole — où est-ce que ma voiture est is not something anyone says.',
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
    translation: [t('We have '), g('some'), t(' friends')],
  },
  {
    id: 'c59',
    segments: [t('Est-ce que vous avez des amis ici ?')],
    blank: 'amis',
    translation: [t('Do you have some '), v('friends'), t(' here?')],
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
    note: 'faim takes no article at all, so there is nothing for a negative to collapse: je n\'ai pas faim. Compare je n\'ai pas de voiture, where une had to become de.',
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
    note: 'le survives a negative, unlike un, une and des: je n\'ai pas le temps, not \'pas de temps\'. le points at a specific, definite thing — the time for this — and a negative does not dissolve it.',
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
    note: 'With tu, vouloir keeps exactly the form it has with je: je veux, tu veux. Only the subject changes. This is worth noticing because it is not the usual pattern — être and avoir both change (je suis / tu es, j\'ai / tu as).',
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
    translation: [t('I want '), g('some'), t(' coffee')],
  },
  {
    id: 'c89',
    element: 'le_pain',
    segments: [t('On veut du '), v('pain')],
    translation: [t('We want some '), v('bread')],
  },
  {
    id: 'c90',
    segments: [t('Est-ce que vous voulez du pain ?')],
    translation: [t('Do you '), v('want'), t(' some bread?')],
  },
  {
    id: 'c91',
    element: 'de_l_eau',
    segments: [t('Elle veut '), g('de l\'eau')],
    translation: [t('She wants '), g('some water')],
  },
  {
    id: 'c92',
    element: 'de_la_viande',
    segments: [t('Il veut '), g('de la viande')],
    translation: [t('He wants '), g('some meat')],
  },
  {
    id: 'c93',
    segments: [t('Je ne veux pas de viande')],
    translation: [t('I don\'t '), v('want'), t(' any meat')],
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
    translation: [t('She wants '), v('to drink'), t(' some water')],
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
    note: 'ne … pas wraps the conjugated verb only. The infinitive stays outside, behind pas: ils ne veulent pas partir.',
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
    translation: [t('Do you want some water '), v('or'), t(' some coffee?')],
  },
  {
    id: 'c109',
    element: 'et',
    segments: [t('On veut du pain '), v('et'), t(' de la viande')],
    translation: [t('We want some bread '), v('and'), t(' some meat')],
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
    translation: [t('I want some bread '), v('with'), t(' some coffee')],
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
    translation: [t('Do we want some '), v('coffee'), t(' or some water?')],
  },
  {
    id: 'c114',
    segments: [t('Je ne veux pas de pain, je veux du café')],
    blank: 'pain',
    translation: [t('I don\'t want any '), v('bread'), t(', I want some coffee')],
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
    note: 'With tu, pouvoir keeps exactly the form it has with je: je peux, tu peux. Only the subject changes, so the subject is the only thing telling the two apart.',
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
    note: 'When a sentence has two verbs, ne … pas wraps the conjugated one and the infinitive stays outside, behind pas: elle ne peut pas travailler. The two halves never split up to go around both verbs.',
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
    note: 'Asking permission needs nothing added: say the statement and let your voice rise at the end. je peux entrer becomes je peux entrer ? This is the form people actually use, and est-ce que je peux entrer ? is its slightly more careful twin.',
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
    note: 'Putting the verb in front of its subject and hyphenating the two — pouvez-vous — is the polite way to ask. It is worth learning whole, because French only inverts like this in a handful of set questions; everywhere else est-ce que does the work.',
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
]
