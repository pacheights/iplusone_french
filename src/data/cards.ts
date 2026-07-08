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
 * translation highlights the English counterpart of the new element so it can
 * be shown when the "Highlight the target word in English" setting is on — some
 * grammar pieces (e.g. the generic article `le`) have no English word, so their
 * translation stays plain.
 *
 * A card with no `element` is a "rest" card (rules.md rule 3): a full sentence
 * that re-uses only known words to set up the next step; it highlights nothing.
 */
const v = (text: string): Segment => ({ text, highlight: 'vocab' })
const g = (text: string): Segment => ({ text, highlight: 'grammar' })
const t = (text: string): Segment => ({ text })

export const CARDS: Card[] = [
  { id: 'c1', element: 'je', segments: [v('Je')], translation: [v('I')] },
  { id: 'c2', element: 'veux', segments: [t('Je '), v('veux')], translation: [t('I '), v('want')] },
  { id: 'c3', element: 'un', segments: [t('Je veux '), g('un')], translation: [t('I want '), g('a')] },
  {
    id: 'c4',
    element: 'cafe',
    segments: [t('Je veux un '), v('café')],
    translation: [t('I want a '), v('coffee')],
  },
  {
    id: 'c5',
    element: 'boire',
    segments: [t('Je veux '), v('boire'), t(' un café')],
    translation: [t('I want '), v('to drink'), t(' a coffee')],
  },
  {
    id: 'c6',
    element: 'quelque_chose',
    segments: [t('Je veux boire '), v('quelque chose')],
    translation: [t('I want to drink '), v('something')],
  },
  {
    id: 'c7',
    element: 'vous_voulez',
    segments: [v('Vous voulez'), t(' boire quelque chose ?')],
    translation: [v('You want'), t(' to drink something?')],
  },
  {
    id: 'c8',
    element: 'du',
    segments: [t('Vous voulez '), g('du'), t(' café ?')],
    translation: [t('You want '), g('(some)'), t(' coffee?')],
  },
  {
    id: 'c9',
    element: 'pain',
    segments: [t('Je veux du '), v('pain')],
    translation: [t('I want (some) '), v('bread')],
  },
  {
    id: 'c10',
    element: 'aime',
    segments: [t("J'"), v('aime'), t(' boire')],
    translation: [t('I '), v('like'), t(' to drink')],
  },
  {
    id: 'c11',
    element: 'manger',
    segments: [t("J'aime "), v('manger')],
    translation: [t('I like '), v('to eat')],
  },
  {
    id: 'c12',
    element: 'le',
    segments: [t("J'aime "), g('le'), t(' pain')],
    translation: [t('I like bread')],
  },
  {
    id: 'c13',
    element: 'avec',
    segments: [t("J'aime manger du pain "), v('avec'), t(' du café')],
    translation: [t('I like to eat bread '), v('with'), t(' coffee')],
  },
  {
    id: 'c14',
    element: 'de',
    segments: [t("J'aime boire "), g('de'), t(" l'"), v('eau')],
    translation: [t('I like to drink '), v('water')],
  },
  {
    id: 'c15',
    element: 'et',
    segments: [t("J'aime boire du café "), v('et'), t(" de l'eau")],
    translation: [t('I like to drink coffee '), v('and'), t(' water')],
  },
  { id: 'c16', element: 'mange', segments: [t('Je '), v('mange')], translation: [t('I '), v('eat')] },
  { id: 'c17', segments: [t('Je mange du pain')], translation: [t('I eat bread')] },
  {
    id: 'c18',
    element: 'ne_pas',
    segments: [t('Je '), g('ne'), t(' mange '), g('pas'), t(' de pain')],
    translation: [t('I '), g('do not'), t(' eat bread')],
  },
  {
    id: 'c19',
    element: 'mangez',
    segments: [t('Vous ne '), v('mangez'), t(' pas de pain')],
    translation: [t('You do not '), v('eat'), t(' bread')],
  },
  {
    id: 'c20',
    element: 'il',
    segments: [v('Il'), t(' mange du pain')],
    translation: [v('He'), t(' eats bread')],
  },
  {
    id: 'c21',
    element: 'la_viande',
    segments: [t('Je mange de '), g('la'), t(' '), v('viande')],
    translation: [t('I eat '), v('meat')],
  },
  {
    id: 'c22',
    element: 'mais',
    segments: [
      t('Je mange de la viande, '),
      v('mais'),
      t(' vous ne mangez pas de viande'),
    ],
    translation: [t('I eat meat, '), v('but'), t(' you do not eat meat')],
    note: 'After a negative, the "some" word drops its article: de la viande → pas de viande (likewise du → de, de l\' → de).',
  },
  {
    id: 'c23',
    element: 'savoir',
    segments: [t('Je veux '), v('savoir')],
    translation: [t('I want '), v('to know')],
  },
  {
    id: 'c24',
    element: 'elle_veut',
    segments: [v('Elle veut'), t(' savoir')],
    translation: [v('She wants'), t(' to know')],
  },
  {
    id: 'c25',
    element: 'pourquoi',
    segments: [t('Elle veut savoir '), v('pourquoi')],
    translation: [t('She wants to know '), v('why')],
  },
  {
    id: 'c26',
    element: 'qui',
    segments: [t('Je veux savoir '), v('qui')],
    translation: [t('I want to know '), v('who')],
  },
  {
    id: 'c27',
    element: 'suis',
    segments: [t('Je veux savoir qui je '), v('suis')],
    translation: [t('I want to know who I '), v('am')],
  },
  {
    id: 'c28',
    element: 'moi_meme',
    segments: [t('Je suis '), v('moi-même')],
    translation: [t('I am '), v('myself')],
  },
  {
    id: 'c29',
    element: 'heureux',
    segments: [t('Je suis '), v('heureux')],
    translation: [t('I am '), v('happy')],
  },
  {
    id: 'c30',
    element: 'etes',
    segments: [t('Vous '), v('êtes'), t(' heureux')],
    translation: [t('You '), v('are'), t(' happy')],
  },
  {
    id: 'c31',
    segments: [t('Vous êtes '), v('vous-même')],
    translation: [t('You are '), v('yourself')],
  },
  {
    id: 'c32',
    element: 'achete',
    segments: [t("J'"), v('achète'), t(' du pain')],
    translation: [t('I '), v('buy'), t(' bread')],
  },
  {
    id: 'c33',
    element: 'au_marche',
    segments: [t("J'achète du pain "), g('au'), t(' '), v('marché')],
    translation: [t('I buy bread '), g('at the'), t(' '), v('market')],
  },
  {
    id: 'c34',
    element: 'achetez',
    segments: [t('Vous '), v('achetez'), t(' du pain au marché')],
    translation: [t('You '), v('buy'), t(' bread at the market')],
  },
  {
    id: 'c35',
    element: 'argent',
    segments: [t("Vous achetez du pain au marché avec de l'"), v('argent')],
    translation: [t('You buy bread at the market with '), v('money')],
  },
  {
    id: 'c36',
    element: 'allez',
    segments: [t('Vous '), v('allez'), t(' au marché ?')],
    translation: [t('Are you '), v('going'), t(' to the market?')],
  },
  {
    id: 'c37',
    element: 'vais',
    segments: [t('Je '), v('vais'), t(' au marché')],
    translation: [t("I'm "), v('going'), t(' to the market')],
  },
  {
    id: 'c38',
    element: 'travail',
    segments: [t('Je vais au '), v('travail')],
    translation: [t("I'm going to "), v('work')],
  },
  {
    id: 'c39',
    element: 'aujourdhui',
    segments: [t('Mais, vous allez au travail '), v("aujourd'hui")],
    translation: [t("But, you're going to work "), v('today')],
  },
  {
    id: 'c40',
    element: 'aussi',
    segments: [t('Je vais au travail '), v('aussi')],
    translation: [t("I'm going to work "), v('too')],
  },
  {
    id: 'c41',
    element: 'venir',
    segments: [t('Je vais '), v('venir')],
    translation: [t("I'm going "), v('to come')],
  },
  {
    id: 'c42',
    element: 'chez_vous',
    segments: [t('Je vais venir '), v('chez vous')],
    translation: [t("I'm going to come "), v('to your place')],
  },
  {
    id: 'c43',
    element: 'demain',
    segments: [t('Je vais venir chez vous '), v('demain')],
    translation: [t("I'm going to come to your place "), v('tomorrow')],
  },
  {
    id: 'c44',
    element: 'chez_moi',
    segments: [t('Vous voulez venir '), v('chez moi'), t(' demain ?')],
    translation: [t('You want to come '), v('to my place'), t(' tomorrow?')],
  },
  {
    id: 'c45',
    element: 'pouvez',
    segments: [t('Vous '), v('pouvez'), t(' venir chez moi')],
    translation: [t('You '), v('can'), t(' come to my place')],
  },
  {
    id: 'c46',
    element: 'peux',
    segments: [t('Je '), v('peux'), t(' venir chez vous')],
    translation: [t('I '), v('can'), t(' come to your place')],
  },
  {
    id: 'c47',
    element: 'dois',
    segments: [t('Je '), v('dois'), t(' venir chez vous')],
    translation: [t('I '), v('have'), t(' to come to your place')],
  },
  {
    id: 'c48',
    element: 'travailler',
    segments: [t('Je dois '), v('travailler')],
    translation: [t('I have '), v('to work')],
  },
  {
    id: 'c49',
    element: 'partir',
    segments: [t('Je dois '), v('partir')],
    translation: [t('I have '), v('to leave')],
  },
  {
    id: 'c50',
    element: 'devez',
    segments: [t('Vous '), v('devez'), t(' partir')],
    translation: [t('You '), v('have'), t(' to leave')],
  },
  {
    id: 'c51',
    element: 'fatigue',
    segments: [t('Vous êtes '), v('fatigué'), t(' ?')],
    translation: [t('Are you '), v('tired'), t('?')],
  },
  { id: 'c52', segments: [t('Je suis fatigué')], translation: [t('I am tired')] },
  {
    id: 'c53',
    element: 'parce_que',
    segments: [t('Je suis fatigué '), g('parce que'), t(' je '), v('travaille')],
    translation: [t('I am tired '), g('because'), t(' I '), v('work')],
  },
  {
    id: 'c54',
    element: 'bureau',
    segments: [t('Je travaille au '), v('bureau')],
    translation: [t('I work at the '), v('office')],
  },
  {
    id: 'c55',
    element: 'ai',
    segments: [t("J'"), v('ai'), t(' du travail')],
    translation: [t('I '), v('have'), t(' work')],
  },
  {
    id: 'c56',
    element: 'temps',
    segments: [t("J'ai le "), v('temps')],
    translation: [t('I have '), v('time')],
  },
  { id: 'c57', segments: [t("Je n'ai pas le temps")], translation: [t("I don't have time")] },
  {
    id: 'c58',
    element: 'une_voiture',
    segments: [t("J'ai "), g('une'), t(' '), v('voiture')],
    translation: [t('I have '), g('a'), t(' '), v('car')],
  },
  {
    id: 'c59',
    element: 'ma',
    segments: [t("J'ai "), g('ma'), t(' voiture')],
    translation: [t('I have '), g('my'), t(' car')],
  },
  {
    id: 'c60',
    element: 'en',
    segments: [t('Je vais au bureau '), v('en'), t(' voiture')],
    translation: [t('I go to the office '), v('by'), t(' car')],
  },
  {
    id: 'c61',
    element: 'fais',
    segments: [t('Je '), v('fais'), t(' du café')],
    translation: [t('I '), v('make'), t(' coffee')],
  },
  {
    id: 'c62',
    element: 'quest_ce_que',
    segments: [g("Qu'est-ce que"), t(' vous voulez ?')],
    translation: [g('What'), t(' do you want?')],
  },
  {
    id: 'c63',
    element: 'faites',
    segments: [t("Qu'est-ce que vous "), v('faites'), t(' ?')],
    translation: [t('What are you '), v('doing'), t('?')],
  },
  {
    id: 'c64',
    element: 'est',
    segments: [t('Il '), v('est'), t(' fatigué')],
    translation: [t('He '), v('is'), t(' tired')],
  },
  {
    id: 'c65',
    element: 'ou_where',
    segments: [v('Où'), t(' est le café ?')],
    translation: [v('Where'), t(' is the coffee?')],
  },
  {
    id: 'c66',
    element: 'mon_ami',
    segments: [t('Où est '), g('mon'), t(' '), v('ami'), t(' ?')],
    translation: [t('Where is '), g('my'), t(' '), v('friend'), t('?')],
  },
  {
    id: 'c67',
    element: 'la_adv',
    segments: [t('Mon ami est '), v('là')],
    translation: [t('My friend is '), v('there')],
  },
  {
    id: 'c68',
    element: 'occupe',
    segments: [t('Mon ami est '), v('occupé')],
    translation: [t('My friend is '), v('busy')],
  },
  { id: 'c69', segments: [t('Je suis occupé aussi')], translation: [t('I am busy too')] },
  {
    id: 'c70',
    element: 'travaillez',
    segments: [t('Vous '), v('travaillez'), t(' au bureau ?')],
    translation: [t('Do you '), v('work'), t(' at the office?')],
  },
  {
    id: 'c71',
    element: 'est_ce_que',
    segments: [g('Est-ce que'), t(" vous travaillez aujourd'hui ?")],
    translation: [g('Do'), t(' you work today?')],
  },
  { id: 'c72', segments: [t('Est-ce que vous voulez un café ?')], translation: [t('Do you want a coffee?')] },
  {
    id: 'c73',
    element: 'prends',
    segments: [t('Je '), v('prends'), t(' un café')],
    translation: [t("I'm "), v('having'), t(' a coffee')],
  },
  {
    id: 'c74',
    element: 'bus',
    segments: [t('Je prends le '), v('bus')],
    translation: [t('I take the '), v('bus')],
  },
  {
    id: 'c75',
    element: 'pour',
    segments: [t('Je prends le bus '), g('pour'), t(' travailler')],
    translation: [t('I take the bus '), g('to'), t(' work')],
  },
  {
    id: 'c76',
    element: 'donc',
    segments: [t("Je n'ai pas de voiture, "), g('donc'), t(' je prends le bus')],
    translation: [t("I don't have a car, "), g('so'), t(' I take the bus')],
  },
  {
    id: 'c77',
    element: 'prendre',
    segments: [t('Je dois '), v('prendre'), t(' le bus')],
    translation: [t('I have '), v('to take'), t(' the bus')],
  },
  {
    id: 'c78',
    element: 'voir',
    segments: [t('Je veux '), v('voir'), t(' mon ami')],
    translation: [t('I want '), v('to see'), t(' my friend')],
  },
  { id: 'c79', segments: [t('Je vais voir mon ami demain')], translation: [t("I'm going to see my friend tomorrow")] },
  {
    id: 'c80',
    element: 'nous_allons',
    segments: [v('Nous allons'), t(' au marché')],
    translation: [v('We are going'), t(' to the market')],
  },
  {
    id: 'c81',
    element: 'ensemble',
    segments: [t('Nous allons au marché '), v('ensemble')],
    translation: [t('We are going to the market '), v('together')],
  },
  {
    id: 'c82',
    element: 'voulons',
    segments: [t('Nous '), v('voulons'), t(' manger')],
    translation: [t('We '), v('want'), t(' to eat')],
  },
  {
    id: 'c83',
    element: 'devons',
    segments: [t('Nous '), v('devons'), t(' manger')],
    translation: [t('We '), v('have'), t(' to eat')],
  },
  {
    id: 'c84',
    element: 'faim',
    segments: [t("J'ai "), v('faim')],
    translation: [t("I'm "), v('hungry')],
  },
  {
    id: 'c85',
    segments: [t("J'ai faim, mais je n'ai pas le temps "), g('de'), t(' manger')],
    translation: [t("I'm hungry, but I don't have time to eat")],
    note: 'le temps de + verb = "time to do something". After a noun like le temps, French links to the following infinitive with de: le temps de manger = time to eat.',
  },
]
