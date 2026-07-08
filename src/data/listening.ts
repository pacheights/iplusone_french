import type { ListeningItem } from '../types'

/**
 * The listening-comprehension bank. Each item plays one French sentence
 * (`answer`) and offers three English-labelled choices; the two distractors are
 * near-homophones that differ from the answer by a single hard-to-hear detail —
 * a homophone verb form (veux / veut), a je-vs-vous ending (mange / mangez), a
 * present-or-absent negation (du → de), a swapped article (un / le / du), or a
 * word tacked on the end — so the learner has to parse the whole utterance
 * rather than catch one keyword.
 *
 * Every sentence here — answer and both distractors — is built only from words
 * taught in the first 60 cards (up through `en`). `requires` lists every element
 * id whose words the item uses, so an item appears only once all of them are
 * known. The bank is intentionally dense and front-loaded: many items unlock in
 * the first ~25 words so the listening track is full early. A test
 * (src/engine/listening.data.test.ts) checks that every word is covered by the
 * declared `requires`, so a typo or a missing id fails CI rather than shipping a
 * question that uses an unknown word.
 */
export const LISTENING_ITEMS: ListeningItem[] = [
  // ── Person: homophone verbs (the pronoun is the only clue) ──────────────
  {
    id: 'l-mange-il-elle-je',
    answer: { text: 'Il mange du pain', translation: 'He eats bread' },
    distractors: [
      { text: 'Elle mange du pain', translation: 'She eats bread' },
      { text: 'Je mange du pain', translation: 'I eat bread' },
    ],
    gloss: 'je, il and elle all take the same verb sound (mange) — only the pronoun changes, and il vs elle is the trap.',
    requires: ['je', 'il', 'elle_veut', 'mange', 'du', 'pain'],
  },
  {
    id: 'l-mange-viande-il-elle',
    answer: { text: 'Elle mange de la viande', translation: 'She eats meat' },
    distractors: [
      { text: 'Il mange de la viande', translation: 'He eats meat' },
      { text: 'Elle mange du pain', translation: 'She eats bread' },
    ],
    gloss: 'il vs elle (mange sounds identical); and de la viande vs du pain.',
    requires: ['il', 'elle_veut', 'mange', 'la_viande', 'de', 'du', 'pain'],
  },
  {
    id: 'l-veut-cafe-elle-je-vous',
    answer: { text: 'Elle veut un café', translation: 'She wants a coffee' },
    distractors: [
      { text: 'Je veux un café', translation: 'I want a coffee' },
      { text: 'Vous voulez un café', translation: 'You want a coffee' },
    ],
    gloss: 'je veux and elle veut are homophones; vous voulez adds the -lez ending.',
    requires: ['je', 'veux', 'elle_veut', 'vous_voulez', 'un', 'cafe'],
  },
  {
    id: 'l-veut-cafe-il-elle-je',
    answer: { text: 'Il veut un café', translation: 'He wants a coffee' },
    distractors: [
      { text: 'Elle veut un café', translation: 'She wants a coffee' },
      { text: 'Je veux un café', translation: 'I want a coffee' },
    ],
    gloss: 'veut sounds the same for il / elle / je — the pronoun is everything, and il vs elle is hardest.',
    requires: ['je', 'veux', 'il', 'elle_veut', 'un', 'cafe'],
  },
  {
    id: 'l-veut-pain-elle-je-vous',
    answer: { text: 'Elle veut du pain', translation: 'She wants some bread' },
    distractors: [
      { text: 'Je veux du pain', translation: 'I want some bread' },
      { text: 'Vous voulez du pain', translation: 'You want some bread' },
    ],
    gloss: 'je veux / elle veut (homophones) / vous voulez (-lez), all with du pain.',
    requires: ['je', 'veux', 'elle_veut', 'vous_voulez', 'du', 'pain'],
  },
  {
    id: 'l-veut-boire-qqch',
    answer: { text: 'Elle veut boire quelque chose', translation: 'She wants to drink something' },
    distractors: [
      { text: 'Je veux boire quelque chose', translation: 'I want to drink something' },
      { text: 'Vous voulez boire quelque chose', translation: 'You want to drink something' },
    ],
    gloss: 'je veux and elle veut are homophones; vous voulez is the odd one out (-lez).',
    requires: ['je', 'veux', 'elle_veut', 'vous_voulez', 'boire', 'quelque_chose'],
  },
  {
    id: 'l-veut-savoir-pourquoi',
    answer: { text: 'Elle veut savoir pourquoi', translation: 'She wants to know why' },
    distractors: [
      { text: 'Je veux savoir pourquoi', translation: 'I want to know why' },
      { text: 'Elle veut savoir qui', translation: 'She wants to know who' },
    ],
    gloss: 'je veux vs elle veut (homophones), and pourquoi vs qui at the end.',
    requires: ['je', 'veux', 'elle_veut', 'savoir', 'pourquoi', 'qui'],
  },

  // ── Person: je vs vous (the audible ending) ─────────────────────────────
  {
    id: 'l-voulez-cafe-pain',
    answer: { text: 'Vous voulez du café', translation: 'You want some coffee' },
    distractors: [
      { text: 'Je veux du café', translation: 'I want some coffee' },
      { text: 'Vous voulez du pain', translation: 'You want some bread' },
    ],
    gloss: 'je veux vs vous voulez (-lez); and du café vs du pain.',
    requires: ['je', 'veux', 'vous_voulez', 'du', 'cafe', 'pain'],
  },
  {
    id: 'l-mangez-pain',
    answer: { text: 'Vous mangez du pain', translation: 'You eat bread' },
    distractors: [
      { text: 'Je mange du pain', translation: 'I eat bread' },
      { text: 'Il mange du pain', translation: 'He eats bread' },
    ],
    gloss: 'vous mangez carries the -ez ending; je and il mange do not.',
    requires: ['je', 'il', 'mange', 'mangez', 'du', 'pain', 'vous_voulez'],
  },
  {
    id: 'l-mangez-viande-neg',
    answer: { text: 'Vous mangez de la viande', translation: 'You eat meat' },
    distractors: [
      { text: 'Je mange de la viande', translation: 'I eat meat' },
      { text: 'Vous ne mangez pas de viande', translation: "You don't eat meat" },
    ],
    gloss: 'je mange vs vous mangez; and the negation (de la viande → pas de viande).',
    requires: ['je', 'mange', 'mangez', 'la_viande', 'ne_pas', 'de', 'vous_voulez'],
  },
  {
    id: 'l-achete-marche',
    answer: { text: 'Vous achetez du pain au marché', translation: 'You buy bread at the market' },
    distractors: [
      { text: "J'achète du pain au marché", translation: 'I buy bread at the market' },
      { text: 'Vous achetez du café au marché', translation: 'You buy coffee at the market' },
    ],
    gloss: "j'achète vs vous achetez turns on the final -ez; and du pain vs du café.",
    requires: ['je', 'achete', 'achetez', 'du', 'pain', 'cafe', 'au_marche', 'vous_voulez'],
  },
  {
    id: 'l-allez-marche-travail',
    answer: { text: 'Vous allez au marché', translation: 'You go to the market' },
    distractors: [
      { text: 'Je vais au marché', translation: 'I go to the market' },
      { text: 'Vous allez au travail', translation: 'You go to work' },
    ],
    gloss: 'je vais vs vous allez; and au marché vs au travail.',
    requires: ['je', 'vais', 'allez', 'au_marche', 'travail', 'vous_voulez'],
  },
  {
    id: 'l-pouvez-venir-partir',
    answer: { text: 'Vous pouvez venir', translation: 'You can come' },
    distractors: [
      { text: 'Je peux venir', translation: 'I can come' },
      { text: 'Vous pouvez partir', translation: 'You can leave' },
    ],
    gloss: 'je peux vs vous pouvez; and venir (come) vs partir (leave).',
    requires: ['je', 'peux', 'pouvez', 'venir', 'partir', 'vous_voulez'],
  },
  {
    id: 'l-devez-partir-travailler',
    answer: { text: 'Vous devez partir', translation: 'You have to leave' },
    distractors: [
      { text: 'Je dois partir', translation: 'I have to leave' },
      { text: 'Vous devez travailler', translation: 'You have to work' },
    ],
    gloss: 'je dois vs vous devez; and partir vs travailler.',
    requires: ['je', 'dois', 'devez', 'partir', 'travailler', 'vous_voulez'],
  },
  {
    id: 'l-etes-fatigue-heureux',
    answer: { text: 'Vous êtes fatigué', translation: 'You are tired' },
    distractors: [
      { text: 'Je suis fatigué', translation: 'I am tired' },
      { text: 'Vous êtes heureux', translation: 'You are happy' },
    ],
    gloss: 'je suis vs vous êtes; and fatigué vs heureux.',
    requires: ['je', 'suis', 'etes', 'fatigue', 'heureux', 'vous_voulez'],
  },

  // ── Negation present / absent (du → de under negation) ──────────────────
  {
    id: 'l-neg-mange-pain',
    answer: { text: 'Je ne mange pas de pain', translation: "I don't eat bread" },
    distractors: [
      { text: 'Je mange du pain', translation: 'I eat bread' },
      { text: 'Vous ne mangez pas de pain', translation: "You don't eat bread" },
    ],
    gloss: 'ne … pas flips du → de; and je mange vs vous mangez.',
    requires: ['je', 'mange', 'mangez', 'ne_pas', 'du', 'de', 'pain', 'vous_voulez'],
  },
  {
    id: 'l-neg-veux-cafe',
    answer: { text: 'Je ne veux pas de café', translation: "I don't want coffee" },
    distractors: [
      { text: 'Je veux du café', translation: 'I want some coffee' },
      { text: 'Je ne veux pas de pain', translation: "I don't want bread" },
    ],
    gloss: 'hear the negation (du → de); then café vs pain.',
    requires: ['je', 'veux', 'ne_pas', 'du', 'de', 'cafe', 'pain'],
  },
  {
    id: 'l-neg-achete-pain',
    answer: { text: "Je n'achète pas de pain", translation: "I don't buy bread" },
    distractors: [
      { text: "J'achète du pain", translation: 'I buy bread' },
      { text: "Je n'achète pas de café", translation: "I don't buy coffee" },
    ],
    gloss: "n'achète pas de … is the negation; then pain vs café.",
    requires: ['je', 'achete', 'ne_pas', 'du', 'de', 'pain', 'cafe'],
  },
  {
    id: 'l-neg-temps',
    answer: { text: "Je n'ai pas le temps", translation: "I don't have time" },
    distractors: [
      { text: "J'ai le temps", translation: 'I have time' },
      { text: "J'ai du travail", translation: 'I have work' },
    ],
    gloss: "the negation (n'ai pas) is the whole difference from j'ai; then le temps vs du travail.",
    requires: ['je', 'ai', 'ne_pas', 'le', 'temps', 'du', 'travail'],
  },
  {
    id: 'l-neg-viande-je-il',
    answer: { text: 'Je ne mange pas de viande', translation: "I don't eat meat" },
    distractors: [
      { text: 'Je mange de la viande', translation: 'I eat meat' },
      { text: 'Il ne mange pas de viande', translation: "He doesn't eat meat" },
    ],
    gloss: 'de la viande → pas de viande under negation; and je vs il.',
    requires: ['je', 'il', 'mange', 'ne_pas', 'la_viande', 'de'],
  },
  {
    id: 'l-neg-vais-travail',
    answer: { text: 'Je ne vais pas au travail', translation: "I'm not going to work" },
    distractors: [
      { text: 'Je vais au travail', translation: "I'm going to work" },
      { text: 'Je ne vais pas au marché', translation: "I'm not going to the market" },
    ],
    gloss: 'catch the negation (ne … pas); then au travail vs au marché.',
    requires: ['je', 'vais', 'ne_pas', 'au_marche', 'travail'],
  },
  {
    id: 'l-neg-veux-boire',
    answer: { text: 'Je ne veux pas boire', translation: "I don't want to drink" },
    distractors: [
      { text: 'Je veux boire', translation: 'I want to drink' },
      { text: 'Je ne veux pas manger', translation: "I don't want to eat" },
    ],
    gloss: 'the negation ne … pas; then boire (drink) vs manger (eat).',
    requires: ['je', 'veux', 'ne_pas', 'boire', 'manger'],
  },
  {
    id: 'l-neg-peux-venir',
    answer: { text: 'Je ne peux pas venir', translation: "I can't come" },
    distractors: [
      { text: 'Je peux venir', translation: 'I can come' },
      { text: 'Je ne peux pas partir', translation: "I can't leave" },
    ],
    gloss: 'the negation (can vs can\'t); then venir (come) vs partir (leave).',
    requires: ['je', 'peux', 'ne_pas', 'venir', 'partir'],
  },
  {
    id: 'l-neg-achetez-pain',
    answer: { text: "Vous n'achetez pas de pain", translation: "You don't buy bread" },
    distractors: [
      { text: 'Vous achetez du pain', translation: 'You buy bread' },
      { text: "Je n'achète pas de pain", translation: "I don't buy bread" },
    ],
    gloss: 'the negation (du → de); and vous achetez vs j\'achète.',
    requires: ['je', 'achete', 'achetez', 'ne_pas', 'du', 'de', 'pain', 'vous_voulez'],
  },
  {
    id: 'l-neg-dois-partir',
    answer: { text: 'Je ne dois pas partir', translation: "I don't have to leave" },
    distractors: [
      { text: 'Je dois partir', translation: 'I have to leave' },
      { text: 'Je ne peux pas partir', translation: "I can't leave" },
    ],
    gloss: 'ne … pas (don\'t have to); then dois (must) vs peux (can).',
    requires: ['je', 'dois', 'peux', 'ne_pas', 'partir'],
  },

  // ── Article discrimination: un / le / du before one noun ────────────────
  {
    id: 'l-article-cafe-je',
    answer: { text: 'Je veux un café', translation: 'I want a coffee' },
    distractors: [
      { text: 'Je veux le café', translation: 'I want the coffee' },
      { text: 'Je veux du café', translation: 'I want some coffee' },
    ],
    gloss: 'un (a) / le (the) / du (some) before café — three articles, one noun.',
    requires: ['je', 'veux', 'un', 'le', 'du', 'cafe'],
  },
  {
    id: 'l-article-cafe-vous',
    answer: { text: 'Vous voulez du café', translation: 'You want some coffee' },
    distractors: [
      { text: 'Vous voulez un café', translation: 'You want a coffee' },
      { text: 'Vous voulez le café', translation: 'You want the coffee' },
    ],
    gloss: 'du (some) / un (a) / le (the) before café — one noun, three articles.',
    requires: ['vous_voulez', 'du', 'un', 'le', 'cafe'],
  },

  // ── Partitive shape: du / de la / de l' ─────────────────────────────────
  {
    id: 'l-partitive-veux',
    answer: { text: 'Je veux du café', translation: 'I want some coffee' },
    distractors: [
      { text: 'Je veux de la viande', translation: 'I want some meat' },
      { text: "Je veux de l'eau", translation: 'I want some water' },
    ],
    gloss: "du (masc) / de la (fem) / de l' (before a vowel) — the 'some' word changes shape.",
    requires: ['je', 'veux', 'du', 'cafe', 'la_viande', 'de', 'le'],
  },
  {
    id: 'l-partitive-boire',
    answer: { text: "J'aime boire de l'eau", translation: 'I like to drink water' },
    distractors: [
      { text: "J'aime boire du café", translation: 'I like to drink coffee' },
      { text: "Je veux boire de l'eau", translation: 'I want to drink water' },
    ],
    gloss: "de l'eau (water) vs du café (coffee); and j'aime vs je veux.",
    requires: ['je', 'aime', 'veux', 'boire', 'de', 'le', 'cafe', 'du'],
  },

  // ── Destination: which au X? ────────────────────────────────────────────
  {
    id: 'l-dest-travail-marche-bureau',
    answer: { text: 'Je vais au travail', translation: "I'm going to work" },
    distractors: [
      { text: 'Je vais au marché', translation: "I'm going to the market" },
      { text: 'Je vais au bureau', translation: "I'm going to the office" },
    ],
    gloss: 'au travail / au marché / au bureau — catch which place.',
    requires: ['je', 'vais', 'au_marche', 'travail', 'bureau'],
  },
  {
    id: 'l-dest-bureau-person',
    answer: { text: 'Vous allez au bureau', translation: 'You go to the office' },
    distractors: [
      { text: 'Je vais au bureau', translation: 'I go to the office' },
      { text: 'Vous allez au marché', translation: 'You go to the market' },
    ],
    gloss: 'je vais vs vous allez; and au bureau vs au marché.',
    requires: ['je', 'vais', 'allez', 'au_marche', 'bureau', 'vous_voulez'],
  },

  // ── A word tacked on the end (aussi / demain / aujourd'hui) ─────────────
  {
    id: 'l-trail-aussi-travail',
    answer: { text: 'Je vais au travail aussi', translation: "I'm going to work too" },
    distractors: [
      { text: 'Je vais au travail', translation: "I'm going to work" },
      { text: 'Vous allez au travail aussi', translation: "You're going to work too" },
    ],
    gloss: 'did you catch aussi (too) at the end? and je vais vs vous allez.',
    requires: ['je', 'vais', 'allez', 'au_marche', 'travail', 'aussi', 'vous_voulez'],
  },
  {
    id: 'l-trail-demain-chez',
    answer: { text: 'Je vais venir chez vous demain', translation: "I'm going to come to your place tomorrow" },
    distractors: [
      { text: 'Je vais venir chez vous', translation: "I'm going to come to your place" },
      { text: 'Je vais venir chez moi demain', translation: "I'm going to come to my place tomorrow" },
    ],
    gloss: 'demain (tomorrow) tacked on the end; and chez vous vs chez moi.',
    requires: ['je', 'vais', 'venir', 'chez_vous', 'chez_moi', 'demain'],
  },
  {
    id: 'l-trail-aujourdhui',
    answer: { text: "Vous allez au travail aujourd'hui", translation: "You're going to work today" },
    distractors: [
      { text: 'Vous allez au travail', translation: "You're going to work" },
      { text: "Je vais au travail aujourd'hui", translation: "I'm going to work today" },
    ],
    gloss: "aujourd'hui (today) at the end; and vous allez vs je vais.",
    requires: ['je', 'vais', 'allez', 'au_marche', 'travail', 'aujourdhui', 'vous_voulez'],
  },
  {
    id: 'l-trail-aussi-fatigue',
    answer: { text: 'Je suis fatigué aussi', translation: 'I am tired too' },
    distractors: [
      { text: 'Je suis fatigué', translation: 'I am tired' },
      { text: 'Vous êtes fatigué aussi', translation: 'You are tired too' },
    ],
    gloss: 'aussi (too) at the end; and je suis vs vous êtes.',
    requires: ['je', 'suis', 'etes', 'fatigue', 'aussi', 'vous_voulez'],
  },

  // ── Possessive / article before voiture ─────────────────────────────────
  {
    id: 'l-voiture-ma-une-la',
    answer: { text: "J'ai ma voiture", translation: 'I have my car' },
    distractors: [
      { text: "J'ai une voiture", translation: 'I have a car' },
      { text: "J'ai la voiture", translation: 'I have the car' },
    ],
    gloss: 'ma (my) / une (a) / la (the) before voiture.',
    requires: ['je', 'ai', 'ma', 'une_voiture', 'la_viande'],
  },

  // ── chez vous vs chez moi ───────────────────────────────────────────────
  {
    id: 'l-chez-vous-moi',
    answer: { text: 'Je peux venir chez vous', translation: 'I can come to your place' },
    distractors: [
      { text: 'Je peux venir chez moi', translation: 'I can come to my place' },
      { text: 'Vous pouvez venir chez moi', translation: 'You can come to my place' },
    ],
    gloss: 'chez vous vs chez moi; and je peux vs vous pouvez.',
    requires: ['je', 'peux', 'pouvez', 'venir', 'chez_vous', 'chez_moi', 'vous_voulez'],
  },
  {
    id: 'l-chez-veux-vous-moi',
    answer: { text: 'Vous voulez venir chez moi', translation: 'You want to come to my place' },
    distractors: [
      { text: 'Je veux venir chez vous', translation: 'I want to come to your place' },
      { text: 'Vous voulez venir chez moi demain', translation: 'You want to come to my place tomorrow' },
    ],
    gloss: 'chez moi vs chez vous; and whether demain (tomorrow) is on the end.',
    requires: ['je', 'veux', 'vous_voulez', 'venir', 'chez_vous', 'chez_moi', 'demain'],
  },

  // ── Connectors: avec / et / mais / parce que ────────────────────────────
  {
    id: 'l-avec-et-pain-cafe',
    answer: { text: "J'aime le pain avec du café", translation: 'I like bread with coffee' },
    distractors: [
      { text: "J'aime le pain et du café", translation: 'I like bread and coffee' },
      { text: "J'aime le café avec du pain", translation: 'I like coffee with bread' },
    ],
    gloss: 'avec (with) vs et (and); and bread-with-coffee vs coffee-with-bread.',
    requires: ['je', 'aime', 'le', 'pain', 'avec', 'du', 'cafe', 'et'],
  },
  {
    id: 'l-et-eau-added',
    answer: { text: "J'aime boire du café et de l'eau", translation: 'I like to drink coffee and water' },
    distractors: [
      { text: "J'aime boire du café", translation: 'I like to drink coffee' },
      { text: "Je veux boire du café et de l'eau", translation: 'I want to drink coffee and water' },
    ],
    gloss: "did you hear et de l'eau (and water) added? and j'aime vs je veux.",
    requires: ['je', 'aime', 'veux', 'boire', 'du', 'cafe', 'et', 'de', 'le'],
  },
  {
    id: 'l-parceque-travaille',
    answer: { text: 'Je suis fatigué parce que je travaille', translation: 'I am tired because I work' },
    distractors: [
      { text: 'Je suis fatigué', translation: 'I am tired' },
      { text: 'Je suis heureux parce que je travaille', translation: 'I am happy because I work' },
    ],
    gloss: 'parce que je travaille (because I work) tacked on; and fatigué vs heureux.',
    requires: ['je', 'suis', 'fatigue', 'parce_que', 'heureux'],
  },
  {
    id: 'l-mais-temps',
    answer: { text: "Je veux manger, mais je n'ai pas le temps", translation: "I want to eat, but I don't have time" },
    distractors: [
      { text: 'Je veux manger', translation: 'I want to eat' },
      { text: "Je dois manger, mais je n'ai pas le temps", translation: "I have to eat, but I don't have time" },
    ],
    gloss: "mais je n'ai pas le temps added on; and je veux vs je dois.",
    requires: ['je', 'veux', 'dois', 'manger', 'mais', 'ne_pas', 'ai', 'le', 'temps'],
  },

  // ── Little verbs that blur: dois / peux / veux / vais + infinitive ──────
  {
    id: 'l-modal-venir',
    answer: { text: 'Je dois venir', translation: 'I have to come' },
    distractors: [
      { text: 'Je peux venir', translation: 'I can come' },
      { text: 'Je veux venir', translation: 'I want to come' },
    ],
    gloss: 'dois (must) / peux (can) / veux (want) before venir — three short verbs that blur.',
    requires: ['je', 'dois', 'peux', 'veux', 'venir'],
  },
  {
    id: 'l-modal-manger',
    answer: { text: 'Je dois manger', translation: 'I have to eat' },
    distractors: [
      { text: 'Je veux manger', translation: 'I want to eat' },
      { text: 'Vous devez manger', translation: 'You have to eat' },
    ],
    gloss: 'je dois (must) vs je veux (want); and je dois vs vous devez.',
    requires: ['je', 'dois', 'veux', 'devez', 'manger', 'vous_voulez'],
  },
  {
    id: 'l-vais-venir-partir',
    answer: { text: 'Je vais venir', translation: "I'm going to come" },
    distractors: [
      { text: 'Je vais partir', translation: "I'm going to leave" },
      { text: 'Vous allez venir', translation: "You're going to come" },
    ],
    gloss: 'venir (come) vs partir (leave); and je vais vs vous allez.',
    requires: ['je', 'vais', 'allez', 'venir', 'partir', 'vous_voulez'],
  },
  {
    id: 'l-dois-travailler-partir',
    answer: { text: 'Je dois travailler', translation: 'I have to work' },
    distractors: [
      { text: 'Je dois partir', translation: 'I have to leave' },
      { text: 'Vous devez travailler', translation: 'You have to work' },
    ],
    gloss: 'travailler (work) vs partir (leave); and je dois vs vous devez.',
    requires: ['je', 'dois', 'devez', 'travailler', 'partir', 'vous_voulez'],
  },
  {
    id: 'l-veux-dois-savoir',
    answer: { text: 'Je veux savoir', translation: 'I want to know' },
    distractors: [
      { text: 'Je dois savoir', translation: 'I have to know' },
      { text: 'Elle veut savoir', translation: 'She wants to know' },
    ],
    gloss: 'veux (want) vs dois (must); and je veux vs elle veut.',
    requires: ['je', 'veux', 'dois', 'elle_veut', 'savoir'],
  },
  {
    id: 'l-vais-manger-boire',
    answer: { text: 'Je vais manger', translation: "I'm going to eat" },
    distractors: [
      { text: 'Je vais boire', translation: "I'm going to drink" },
      { text: 'Vous allez manger', translation: "You're going to eat" },
    ],
    gloss: 'manger (eat) vs boire (drink); and je vais vs vous allez.',
    requires: ['je', 'vais', 'allez', 'manger', 'boire', 'vous_voulez'],
  },
  {
    id: 'l-partir-demain',
    answer: { text: 'Je vais partir demain', translation: "I'm going to leave tomorrow" },
    distractors: [
      { text: 'Je vais partir', translation: "I'm going to leave" },
      { text: 'Je vais venir demain', translation: "I'm going to come tomorrow" },
    ],
    gloss: 'demain (tomorrow) added; and partir (leave) vs venir (come).',
    requires: ['je', 'vais', 'partir', 'venir', 'demain'],
  },
  {
    id: 'l-devez-pouvez-venir',
    answer: { text: 'Vous devez venir', translation: 'You have to come' },
    distractors: [
      { text: 'Vous pouvez venir', translation: 'You can come' },
      { text: 'Je dois venir', translation: 'I have to come' },
    ],
    gloss: 'pouvez (can) vs devez (must); and vous devez vs je dois.',
    requires: ['je', 'dois', 'pouvez', 'devez', 'venir', 'vous_voulez'],
  },

  // ── Identity: qui je suis / qui vous êtes ; moi-même / vous-même ────────
  {
    id: 'l-qui-je-suis',
    answer: { text: 'Je veux savoir qui je suis', translation: 'I want to know who I am' },
    distractors: [
      { text: 'Je veux savoir qui vous êtes', translation: 'I want to know who you are' },
      { text: 'Elle veut savoir qui je suis', translation: 'She wants to know who I am' },
    ],
    gloss: 'qui je suis (who I am) vs qui vous êtes (who you are); and je veux vs elle veut.',
    requires: ['je', 'veux', 'elle_veut', 'savoir', 'qui', 'suis', 'etes', 'vous_voulez'],
  },
  {
    id: 'l-moi-meme',
    answer: { text: 'Je suis moi-même', translation: 'I am myself' },
    distractors: [
      { text: 'Vous êtes vous-même', translation: 'You are yourself' },
      { text: 'Je suis heureux', translation: 'I am happy' },
    ],
    gloss: 'je suis moi-même vs vous êtes vous-même; and moi-même vs heureux.',
    requires: ['je', 'suis', 'etes', 'moi_meme', 'heureux', 'vous_voulez'],
  },

  // ── Money / by car (deeper — unlock near card 60) ───────────────────────
  {
    id: 'l-en-voiture',
    answer: { text: 'Je vais au bureau en voiture', translation: 'I go to the office by car' },
    distractors: [
      { text: 'Je vais au travail en voiture', translation: 'I go to work by car' },
      { text: 'Vous allez au bureau en voiture', translation: 'You go to the office by car' },
    ],
    gloss: 'au bureau vs au travail; and je vais vs vous allez.',
    requires: ['je', 'vais', 'allez', 'au_marche', 'bureau', 'travail', 'en', 'une_voiture', 'vous_voulez'],
  },
  {
    id: 'l-argent-achete',
    answer: { text: "Vous achetez du pain avec de l'argent", translation: 'You buy bread with money' },
    distractors: [
      { text: "J'achète du pain avec de l'argent", translation: 'I buy bread with money' },
      { text: "Vous achetez du café avec de l'argent", translation: 'You buy coffee with money' },
    ],
    gloss: "j'achète vs vous achetez; and du pain vs du café.",
    requires: ['je', 'achete', 'achetez', 'du', 'pain', 'cafe', 'avec', 'de', 'le', 'argent', 'vous_voulez'],
  },
  {
    id: 'l-argent-veux-ai',
    answer: { text: "Je veux de l'argent", translation: 'I want money' },
    distractors: [
      { text: "J'ai de l'argent", translation: 'I have money' },
      { text: "Je veux de l'eau", translation: 'I want water' },
    ],
    gloss: "je veux vs j'ai; and de l'argent (money) vs de l'eau (water).",
    requires: ['je', 'veux', 'ai', 'de', 'le', 'argent'],
  },
]
