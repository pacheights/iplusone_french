import type { CardExplanation, ExplainedPart } from '../types'

/**
 * The explain panel, one entry per card in CARDS.
 *
 * Each entry says what the sentence means in English, walks every part of it in
 * reading order, and — where assembling the pieces teaches something the pieces
 * alone don't — closes with what the whole shape is doing.
 *
 * Four rules hold everywhere in this file:
 *
 *   1. **Complete.** Every word of the French belongs to exactly one part, so
 *      no piece of a card goes unexplained. `explanations.test.ts` proves it.
 *   2. **Standalone.** A panel never says "you already know" or "you'll meet
 *      this later" — it is read cold, by someone who wants this sentence
 *      explained now.
 *   3. **Name the part, then explain it.** Every item opens by saying what kind
 *      of word this is and what it means in English — "This is a possessive
 *      adjective meaning your" — and then says how it behaves in French. The
 *      labels stay ordinary (subject pronoun, noun, adjective, infinitive,
 *      conjunction, preposition); the heavy ones (second person singular
 *      present indicative) never appear.
 *   4. **Put it in English terms, but only where it earns its place.** The
 *      reader is an English speaker, so a note names the English habit that
 *      would otherwise produce a mistake: English drops a word French keeps
 *      (`des amis`), English needs an extra verb French does without (`do you
 *      have`), English leaves to context what French must choose (`du café` vs
 *      `un café`). Where the two languages agree, say nothing — "exactly as in
 *      English" is not a fact about French. Never say the same thing twice on
 *      one card: if a part note makes the point, `whole` does not repeat it.
 *
 * A conjugated verb always names its infinitive. A wrapped negative is
 * explained as the single thing it is, so it is written `ne … pas` with the
 * verb elided out and the verb gets its own part.
 */
const p = (part: string, note: string): ExplainedPart => ({ part, note })

/**
 * `"Je suis fatigué" translates to "I am tired" in English. Let's break it down:`
 *
 * `extra` is a note about the sentence as a whole — who it is said to, who is in
 * the group — and lands before the lead-in to the numbered breakdown.
 */
const opens = (french: string, english: string, extra?: string) =>
  `'${french}' translates to '${english}' in English.${extra ? ` ${extra}` : ''} Let's break it down:`

// ─── Subject pronouns ───────────────────────────────────────────────────────
const jeNote =
  'This is the subject pronoun meaning \'I.\' French always states the subject, so it stands in front of the verb in every sentence.'
const JE = p('Je', jeNote)
const je = p('je', jeNote)

const tuNote =
  'This is the subject pronoun meaning \'you.\' French uses it for one person you are close to — a friend, a family member, a child. For anyone else it uses \'vous.\''
const TU = p('Tu', tuNote)
const tu = p('tu', tuNote)

const IL = p(
  'Il',
  'This is the subject pronoun meaning \'he.\' It also means \'it\' when the thing being talked about is a masculine noun.',
)
const ELLE = p(
  'Elle',
  'This is the subject pronoun meaning \'she.\' It also means \'it\' when the thing being talked about is a feminine noun.',
)
const NOUS = p(
  'Nous',
  'This is the subject pronoun meaning \'we.\' It is the formal choice; in everyday conversation French speakers usually say \'on\' instead.',
)
const vousNote =
  'This is the subject pronoun meaning \'you.\' French uses it for a stranger, for someone older, for anyone at work, and for more than one person at once.'
const VOUS = p('Vous', vousNote)
const vous = p('vous', vousNote)
const ILS = p(
  'Ils',
  'This is the subject pronoun meaning \'they,\' used for a group of men or for any mixed group. One man among a hundred women is enough to make it \'ils.\'',
)
const ELLES = p(
  'Elles',
  'This is the subject pronoun meaning \'they,\' used only when every person in the group is a woman.',
)
const onNote =
  'This is the subject pronoun meaning \'we.\' It is what French speakers actually say in conversation, where \'nous\' sounds formal, and it takes the same verb form as \'il\' and \'elle\': \'on est,\' never \'on sommes.\''
const ON = p('On', onNote)

// ─── être ───────────────────────────────────────────────────────────────────
const SUIS = p(
  'suis',
  'This is the verb \'être\' (to be), conjugated in the present tense for \'je.\' It means \'am.\' \'être\' is irregular, so its forms are learned one at a time: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.',
)
const suis = p(
  'suis',
  'This is the verb \'être\' (to be), conjugated for \'je.\' It means \'am.\' In French, a verb changes its form to match the subject in front of it.',
)
const es = p(
  'es',
  'This is the verb \'être\' (to be), conjugated for \'tu.\' It means \'are.\' The final -s is silent.',
)
const est = p(
  'est',
  'This is the verb \'être\' (to be), conjugated for \'il,\' \'elle\' and \'on.\' It means \'is.\' The final -t is silent, so it sounds exactly like the \'tu\' form \'es.\'',
)
const sommes = p(
  'sommes',
  'This is the verb \'être\' (to be), conjugated for \'nous.\' It means \'are.\'',
)
const etes = p('êtes', 'This is the verb \'être\' (to be), conjugated for \'vous.\' It means \'are.\'')
const sont = p(
  'sont',
  'This is the verb \'être\' (to be), conjugated for \'ils\' and \'elles.\' It means \'are.\'',
)

// ─── avoir ──────────────────────────────────────────────────────────────────
const jApostropheAi = p(
  'J\'ai',
  'This is two words joined: \'je\' (I) and \'ai,\' the verb \'avoir\' (to have) conjugated for \'je,\' meaning \'have.\' \'avoir\' is irregular: j\'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont. In front of a vowel \'je\' drops its e and joins on with an apostrophe: je ai → j\'ai.',
)
const ai = p('ai', 'This is the verb \'avoir\' (to have), conjugated for \'je.\' It means \'have.\'')
const as = p(
  'as',
  'This is the verb \'avoir\' (to have), conjugated for \'tu.\' It means \'have.\' It sounds exactly like the \'il\' form \'a.\'',
)
const a = p(
  'a',
  'This is the verb \'avoir\' (to have), conjugated for \'il,\' \'elle\' and \'on.\' It means \'has.\'',
)
const avons = p(
  'avons',
  'This is the verb \'avoir\' (to have), conjugated for \'nous.\' It means \'have.\' The silent -s of \'nous\' links onto the vowel that starts it, so \'nous avons\' is heard as nou-zavons.',
)
const avez = p(
  'avez',
  'This is the verb \'avoir\' (to have), conjugated for \'vous.\' It means \'have.\' The -ez ending sounds like é.',
)
const ont = p(
  'ont',
  'This is the verb \'avoir\' (to have), conjugated for \'ils\' and \'elles.\' It means \'have.\' The silent -s of \'ils\' links onto it as a z, so \'ils ont\' is heard as il-zont — which is what keeps it apart from \'ils sont.\'',
)

// ─── vouloir ────────────────────────────────────────────────────────────────
const VEUX = p(
  'veux',
  'This is the verb \'vouloir\' (to want), conjugated in the present tense for \'je.\' It means \'want.\' \'vouloir\' is irregular: je veux, tu veux, il/elle veut, nous voulons, vous voulez, ils/elles veulent.',
)
const veux = p(
  'veux',
  'This is the verb \'vouloir\' (to want), conjugated for \'je.\' It means \'want.\'',
)
const veuxTu = p(
  'veux',
  'This is the verb \'vouloir\' (to want), conjugated for \'tu.\' It means \'want.\' It is spelled exactly like the \'je\' form — je veux, tu veux — so only the subject in front tells them apart.',
)
const veut = p(
  'veut',
  'This is the verb \'vouloir\' (to want), conjugated for \'il,\' \'elle\' and \'on.\' It means \'wants.\' It sounds identical to \'veux\'; only the spelling separates them.',
)
const voulons = p(
  'voulons',
  'This is the verb \'vouloir\' (to want), conjugated for \'nous.\' It means \'want.\'',
)
const voulez = p(
  'voulez',
  'This is the verb \'vouloir\' (to want), conjugated for \'vous.\' It means \'want.\' The -ez ending sounds like é.',
)
const veulent = p(
  'veulent',
  'This is the verb \'vouloir\' (to want), conjugated for \'ils\' and \'elles.\' It means \'want.\' The -ent ending is completely silent, so the word is said as one syllable and sounds nothing like it looks.',
)

// ─── Adjectives ─────────────────────────────────────────────────────────────
const fatigue = p(
  'fatigué',
  'This is an adjective meaning \'tired.\' In French an adjective changes its ending to match whoever it describes: \'fatiguée\' for a woman, \'fatigués\' for a group, \'fatiguées\' for a group of women. None of the four endings changes the sound.',
)
const fatiguee = p(
  'fatiguée',
  'This is the adjective \'fatigué\' (tired) with the -e ending that matches a feminine subject. The ending is silent, so it sounds the same as \'fatigué.\'',
)
const fatigues = p(
  'fatigués',
  'This is the adjective \'fatigué\' (tired) with the -s ending that matches a plural subject. The -s is silent.',
)
const malade = p(
  'malade',
  'This is an adjective meaning \'sick\' or \'ill.\' It already ends in -e, so it is written the same for a man and for a woman; only a plural adds -s: \'ils sont malades.\'',
)
const occupe = p(
  'occupé',
  'This is an adjective meaning \'busy.\' A woman writes \'occupée\' and a group writes \'occupés.\' The endings are silent.',
)
const occupes = p(
  'occupés',
  'This is the adjective \'occupé\' (busy) with the silent -s that matches a plural subject.',
)
const tres = p(
  'très',
  'This is an adverb meaning \'very.\' It goes in front of the adjective it strengthens.',
)

// ─── Place, time and other adverbs ──────────────────────────────────────────
const ici = p('ici', 'This is an adverb meaning \'here\' — the place the speaker is.')
const la = p(
  'là',
  'This is an adverb meaning \'there.\' French speakers use it for \'here\' just as readily: \'je suis là\' is the ordinary way to say \'I\'m here\' or \'I\'ve arrived.\'',
)
const maintenant = p(
  'maintenant',
  'This is an adverb meaning \'now.\' French usually puts it at the end of the sentence.',
)
const enRetard = p(
  'en retard',
  'This is a fixed expression meaning \'late.\' The two words travel together and never change. French treats lateness as a state you are in, so it goes with \'être\': on est en retard.',
)
const quelqueChose = p(
  'quelque chose',
  'This is a fixed expression meaning \'something.\' Two words that work as one.',
)
const unPeu = p('un peu', 'This is a fixed expression meaning \'a little\' or \'a bit.\'')

// ─── Questions ──────────────────────────────────────────────────────────────
const estCeQueNote =
  'This is a construction used to form a yes/no question in French. Word for word it is \'is it that …,\' and it is placed in front of an ordinary statement, which keeps its normal word order — nothing else in the sentence moves.'
const estCeQue = p('Est-ce que', estCeQueNote)
const estCeQuLower = (rest: string, extra: string) =>
  p(
    `Est-ce qu'${rest}`,
    `This is 'est-ce que,' the construction that turns a statement into a yes/no question — word for word, 'is it that ….' In front of a vowel 'que' drops its e and joins the next word with an apostrophe: est-ce que ${rest} → est-ce qu'${rest}. ${extra}`,
  )

// ─── Negation ───────────────────────────────────────────────────────────────
const nePasNote =
  'This is the French negative, and it comes in two pieces that wrap around the verb: \'ne\' in front of it and \'pas\' behind it. English needs only one word, \'not.\' Both French pieces are written, but in ordinary speech the \'ne\' is dropped and only \'pas\' is heard.'
const nePas = p('ne … pas', nePasNote)
const nApostrophePas = p(
  'n\' … pas',
  `${nePasNote} Before a vowel 'ne' drops its e and joins the next word with an apostrophe: ne est → n'est.`,
)

// ─── Articles ───────────────────────────────────────────────────────────────
const un = p(
  'un',
  'This is the indefinite article meaning \'a\' or \'an,\' used in front of a masculine noun. The feminine form is \'une.\'',
)
const une = p(
  'une',
  'This is the indefinite article meaning \'a\' or \'an,\' used in front of a feminine noun. The masculine form is \'un.\'',
)
const des = p(
  'des',
  'This is the plural of \'un\' and \'une,\' meaning \'some.\' English usually leaves it out — \'we have friends\' — but French never does.',
)
const le = p(
  'le',
  'This is the definite article meaning \'the,\' used in front of a masculine noun. The feminine form is \'la.\'',
)
const leNeg = p(
  'le',
  'This is the definite article \'the,\' used in front of a masculine noun. Unlike \'un,\' \'une\' and \'des,\' it survives a negative untouched: \'je n\'ai pas le temps,\' never \'pas de temps.\' \'le\' points at a definite thing — the time for this — and a negative does not dissolve it.',
)
const du = p(
  'du',
  'This is the partitive article meaning \'some\' — an uncounted amount of a masculine thing. The feminine partner is \'de la,\' and in front of a vowel both become \'de l\'.\' English can leave this word out; French cannot.',
)
const deLa = p(
  'de la',
  'This is the partitive article meaning \'some,\' used for an uncounted amount of a feminine thing. \'la\' here is the feminine \'the,\' so \'la viande\' is the meat and \'de la viande\' is some meat.',
)
const deL = p(
  'de l\'',
  'This is the partitive article meaning \'some,\' used in front of any word starting with a vowel whatever its gender. The vowel, not the gender, is what decides this form.',
)
const deNeg = p(
  'de',
  'After a negative, \'un,\' \'une\' and \'des\' all collapse into plain \'de\': j\'ai une voiture → je n\'ai pas de voiture. Nothing is left to count, so the counting word goes. In front of a vowel it shortens to \'d\'.\'',
)
const mon = p(
  'mon',
  'This is a possessive adjective meaning \'my,\' used in front of a masculine noun. In French a possessive adjective matches the gender of the thing owned, not the owner — a man and a woman both say \'mon ami.\'',
)
const ma = p(
  'ma',
  'This is a possessive adjective meaning \'my,\' used in front of a feminine noun. It matches the gender of the thing owned, not the owner, so everyone says \'ma voiture.\'',
)
const cEstNote =
  'This is two words joined: \'ce\' (this, that) and \'est\' (is), with \'ce\' dropping its e in front of the vowel. It means \'it is,\' \'this is\' or \'that is\' — the all-purpose way to point at something and say what it is. It never changes for masculine, feminine or plural.'
const CEST = p('C\'est', cEstNote)
const cEst = p('c\'est', cEstNote)

// ─── Nouns ──────────────────────────────────────────────────────────────────
const voiture = p(
  'voiture',
  'This is a feminine singular noun meaning \'car.\' Being feminine is what puts feminine words in front of it: la voiture, une voiture, ma voiture.',
)
const bus = p('bus', 'This is a masculine singular noun meaning \'bus\': le bus, un bus.')
const ami = p(
  'ami',
  'This is a masculine singular noun meaning \'friend.\' A female friend is \'une amie,\' and the plural is \'amis.\'',
)
const amis = p(
  'amis',
  'This is the plural of \'ami\' (friend). A French noun adds -s in the plural, and the -s is silent.',
)
const cafe = p(
  'café',
  'This is a masculine singular noun meaning \'coffee,\' and also the place you drink it in: le café, un café.',
)
const pain = p('pain', 'This is a masculine singular noun meaning \'bread\': le pain, du pain.')
const eau = p(
  'eau',
  'This is a feminine singular noun meaning \'water.\' It starts with a vowel, so the words in front of it elide: l\'eau, de l\'eau.',
)
const viande = p(
  'viande',
  'This is a feminine singular noun meaning \'meat\': la viande, de la viande.',
)
const probleme = p(
  'problème',
  'This is a masculine singular noun meaning \'problem\': un problème, le problème.',
)
const temps = p(
  'temps',
  'This is a masculine singular noun meaning \'time.\' The -ps ending is silent. \'avoir le temps\' is to have the time for something.',
)
const faim = p(
  'faim',
  'This is a feminine singular noun meaning \'hunger.\' French treats hunger as something you have rather than something you are, so it goes with \'avoir\' and never with \'être,\' and takes no article: \'il a faim\' is word for word \'he has hunger.\'',
)
const soif = p(
  'soif',
  'This is a feminine singular noun meaning \'thirst.\' Like \'faim\' it is something you have: \'elle a soif\' is word for word \'she has thirst,\' with no article in between.',
)
const besoin = p(
  'besoin',
  'This is a masculine singular noun meaning \'need.\' French has no single verb for \'to need\' — it says you have a need of something: \'avoir besoin de.\'',
)
const ilYA = p(
  'Il y a',
  'This is a fixed expression meaning \'there is\' or \'there are\' — the same three words for both. The \'il\' in it stands for nobody, just as \'it\' stands for nobody in \'it is raining.\' The phrase is used whole and never changes shape; said quickly it comes out as \'ya.\'',
)
const yA = p(
  'y a',
  'These are the other two words of \'il y a\' (there is, there are), whose \'il\' has been pulled into \'est-ce qu\'il\' above. The expression is one unit and is always used whole.',
)
const ilNYAPas = p(
  'Il n\'y a pas',
  'This is the negative of \'il y a,\' meaning \'there isn\'t\' or \'there aren\'t.\' \'ne … pas\' closes around the verb \'a,\' and \'ne\' drops its e in front of the y. The result is fixed and worth learning whole.',
)

// ─── Infinitives ────────────────────────────────────────────────────────────
const infinitiveNote =
  'The infinitive is the plain, unconjugated form — the name of the verb — and in French it is what follows another verb, with nothing put in between.'
const manger = p('manger', `This is an infinitive verb meaning 'to eat.' ${infinitiveNote}`)
const mangerShort = p(
  'manger',
  'This is an infinitive verb meaning \'to eat,\' following straight on from the conjugated verb in front of it.',
)
const boire = p('boire', `This is an infinitive verb meaning 'to drink.' ${infinitiveNote}`)
const partir = p(
  'partir',
  'This is an infinitive verb meaning \'to leave\' or \'to set off\' — moving away from a place rather than arriving somewhere.',
)
const travailler = p('travailler', 'This is an infinitive verb meaning \'to work.\'')
const aider = p('aider', 'This is an infinitive verb meaning \'to help.\'')

// ─── Connectors ─────────────────────────────────────────────────────────────
const mais = p(
  'mais',
  'This is a conjunction meaning \'but.\' It connects two statements that pull against each other.',
)
const et = p(
  'et',
  'This is a conjunction meaning \'and.\' The t is silent and never links onto the next word.',
)
const ou = p(
  'ou',
  'This is a conjunction meaning \'or.\' It is written without an accent — \'où\' with one means \'where.\'',
)
const ouWhere = p(
  'Où',
  'This is a question word meaning \'where.\' It goes at the very front of the question.',
)

const secondVerb =
  'When one verb follows another in French, the second stays in its plain infinitive form and nothing goes between them.'

// ─── pouvoir ────────────────────────────────────────────────────────────────
const peux = p(
  'peux',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'je.\' It means \'can\' or \'am able to.\'',
)
const peuxTu = p(
  'peux',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'tu.\' It means \'can.\' The \'je\' and \'tu\' forms are spelled identically, so the subject in front is the only thing separating them.',
)
const peut = p(
  'peut',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'il,\' \'elle\' or \'on.\' It means \'can.\' It sounds exactly like the \'peux\' used with \'je\' and \'tu\' — the spelling is the only difference.',
)
const pouvons = p(
  'pouvons',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'nous.\' It means \'can.\'',
)
const pouvez = p(
  'pouvez',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'vous.\' It means \'can.\' The \'-ez\' ending sounds like é.',
)
const peuvent = p(
  'peuvent',
  'This is the verb \'pouvoir\' (to be able to), conjugated for \'ils\' or \'elles.\' It means \'can.\' The \'-ent\' ending is silent, so the written word is longer than the spoken one.',
)
const POUVEZ_VOUS = p(
  'Pouvez-vous',
  'This is \'pouvez\' (can, for \'vous\') placed in front of its own subject and hyphenated to it. Turning the two around like this makes the question polite, and it is worth learning whole: French inverts this way only in a handful of set questions.',
)

// ─── Block 4 infinitives ────────────────────────────────────────────────────
const entrer = p('entrer', 'This is an infinitive verb meaning \'to come in\' or \'to go in.\'')
const sortir = p(
  'sortir',
  'This is an infinitive verb meaning \'to go out\' — stepping outside an enclosed space. It is the opposite of \'entrer.\'',
)
const rester = p(
  'rester',
  'This is an infinitive verb meaning \'to stay\' or \'to remain\' in a place. It resembles the English \'to rest\' but does not mean it — resting is \'se reposer.\'',
)
const parler = p(
  'parler',
  'This is an infinitive verb meaning \'to talk\' or \'to speak.\' Talking with someone is \'parler avec\'; speaking a language takes no preposition at all.',
)
const regarder = p(
  'regarder',
  'This is an infinitive verb meaning \'to look at\' or \'to watch.\' The \'at\' is already inside the French verb, so nothing is added after it.',
)

// ─── Politeness and answers ─────────────────────────────────────────────────
const silVousPlait = p(
  's\'il vous plaît',
  'This is a fixed expression meaning \'please.\' Word for word it is \'if it pleases you,\' which is why it carries \'vous\' — said to someone you call \'tu,\' it becomes \'s\'il te plaît.\' It is used whole and sits at the end of the request.',
)
const merciNote =
  'This is the word for \'thank you.\' Answering an offer, \'merci\' on its own can mean \'no thank you,\' so \'non merci\' is what makes a refusal unmistakable.'
const MERCI = p('Merci', merciNote)
const merci = p('merci', merciNote)
const OUI = p(
  'Oui',
  'This is the word for \'yes.\' French speakers rarely leave it standing alone — it usually opens a short answer rather than being the whole of one.',
)
const NON = p(
  'Non',
  'This is the word for \'no.\' It answers a question, and it is a different word from the \'ne … pas\' that negates a sentence — an answer can use both.',
)
const dAccord = p(
  'D\'accord',
  'This is a fixed expression meaning \'all right\' or \'okay\' — the everyday way to agree to something. It also pairs with \'être\' to agree with a person: je suis d\'accord.',
)
const peutEtre = p(
  'Peut-être',
  'This is an adverb meaning \'maybe\' or \'perhaps.\' It is built from \'peut\' (can) and \'être\' (to be) — literally \'can-be\' — but it works as one fixed word, always hyphenated, and neither half does anything on its own here.',
)

// ─── Block 4 odds and ends ──────────────────────────────────────────────────
const pour = p(
  'pour',
  'This is a preposition meaning \'for.\' In front of an infinitive it means \'in order to\' and gives the reason something is done. English usually drops the \'in order\' and leaves a bare \'to\'; French always keeps \'pour.\'',
)
const libre = p(
  'libre',
  'This is an adjective meaning \'free\' in the sense of not busy and not taken. It already ends in -e, so it looks the same for a masculine or feminine subject; only the plural adds -s. Free of charge is a different word, \'gratuit.\'',
)
const ensemble = p('ensemble', 'This is an adverb meaning \'together.\'')
const avec = p('avec', 'This is a preposition meaning \'with.\'')
const bien = p(
  'bien',
  'This is an adverb meaning \'good\' or \'well.\' Said of a situation it means that it works, that it suits — rather than describing the quality of a thing.',
)
const on = p('on', onNote)

export const EXPLANATIONS: Record<string, CardExplanation> = {
  // ───────────────────────────────────────────────────────────────────────────
  // Block 1 — être
  // ───────────────────────────────────────────────────────────────────────────
  c1: {
    summary: '\'Je\' translates to \'I\' in English.',
    parts: [
      p(
        'Je',
        'This is the subject pronoun meaning \'I\' — the word for yourself as the one doing something. French writes it with a small j except at the start of a sentence, where English always capitalises its \'I.\'',
      ),
    ],
  },

  c2: {
    summary: opens('Je suis', 'I am'),
    parts: [JE, SUIS],
    whole:
      'Together they are \'I am.\' French never leaves the subject out, so \'je\' and \'suis\' travel together — there is no way to say \'am\' on its own.',
  },

  c3: {
    summary: opens('Je suis fatigué', 'I am tired'),
    parts: [JE, suis, fatigue],
  },

  c4: {
    summary: opens('Tu es fatigué', 'You are tired', 'It is said to someone you know well.'),
    parts: [TU, es, fatigue],
    whole:
      'The only difference between this and \'je suis fatigué\' is who is being talked about, and the verb changes shape to follow: je suis, tu es.',
  },

  c5: {
    summary: opens('Il est fatigué', 'He is tired'),
    parts: [IL, est, fatigue],
  },

  c6: {
    summary: opens('Elle est fatiguée', 'She is tired'),
    parts: [ELLE, est, fatiguee],
    whole:
      '\'être\' takes the same form with \'elle\' as with \'il\' — \'est.\' What changes for a feminine subject is the adjective behind it: fatigué → fatiguée.',
  },

  c7: {
    summary: opens('Nous sommes fatigués', 'We are tired'),
    parts: [NOUS, sommes, fatigues],
  },

  c8: {
    summary: opens(
      'Vous êtes fatigué',
      'You are tired',
      'This is the polite \'you,\' or several people at once.',
    ),
    parts: [
      VOUS,
      etes,
      p(
        'fatigué',
        'This is the adjective \'fatigué\' (tired), written with no -s because \'vous\' here is one person. Said to a group it would be \'fatigués.\'',
      ),
    ],
    whole:
      '\'vous\' is both the polite \'you\' and the plural \'you\' — the same two words serve for a stranger and for a room full of people. Only the ending on the adjective shows which is meant.',
  },

  c9: {
    summary: opens('Ils sont fatigués', 'They are tired'),
    parts: [ILS, sont, fatigues],
  },

  c10: {
    summary: opens('Elles sont fatiguées', 'They are tired', 'The group is entirely female.'),
    parts: [
      ELLES,
      sont,
      p(
        'fatiguées',
        'This is the adjective \'fatigué\' (tired) carrying both endings: -e for feminine and -s for plural. Neither one is heard.',
      ),
    ],
    whole:
      '\'elles\' takes the same form of \'être\' as \'ils.\' The choice between the two pronouns is only about who is in the group — English has one word, \'they,\' for both.',
  },

  c11: {
    summary: opens('Je suis occupé', 'I am busy'),
    parts: [JE, suis, occupe],
  },

  c12: {
    summary: opens('Vous êtes occupé ?', 'Are you busy?'),
    parts: [VOUS, etes, occupe],
    whole:
      'Nothing has been added and no word has moved — this is the statement \'vous êtes occupé\' with the voice rising at the end, which is the commonest way to ask a yes/no question in conversation. English has to swap the subject and the verb to do the same job. Note that French leaves a space before the question mark.',
  },

  c13: {
    summary: opens('Est-ce que vous êtes occupé ?', 'Are you busy?'),
    parts: [estCeQue, vous, etes, occupe],
    whole:
      'The statement is left untouched: vous êtes occupé → est-ce que vous êtes occupé ? It works with every verb and never rearranges the words, which makes it the safe way to ask anything.',
  },

  c14: {
    summary: opens('Est-ce que tu es fatigué ?', 'Are you tired?'),
    parts: [estCeQue, tu, es, fatigue],
  },

  c15: {
    summary: opens('Il est malade', 'He is sick'),
    parts: [IL, est, malade],
  },

  c16: {
    summary: opens('Elle est malade aussi', 'She is sick too'),
    parts: [
      ELLE,
      est,
      malade,
      p(
        'aussi',
        'This is an adverb meaning \'too\' or \'also.\' It goes at the end of the sentence, where English puts \'too.\'',
      ),
    ],
  },

  c17: {
    summary: opens('Nous sommes malades', 'We are sick'),
    parts: [
      NOUS,
      sommes,
      p(
        'malades',
        'This is the adjective \'malade\' (sick) with the silent -s that matches a plural subject.',
      ),
    ],
  },

  c18: {
    summary: opens('Je ne suis pas malade', 'I am not sick'),
    parts: [JE, nePas, suis, malade],
    whole:
      'The two halves close around the verb and nothing else: je ne suis pas malade. Said out loud it is usually \'je suis pas malade,\' with the \'ne\' gone.',
  },

  c19: {
    summary: opens('Tu n\'es pas malade', 'You are not sick'),
    parts: [TU, nApostrophePas, es, malade],
    whole:
      'Several short French words lose their vowel in front of another vowel and join on with an apostrophe: je → j\', que → qu\', de → d\', le → l\'. It is automatic and never optional — French avoids two vowels meeting.',
  },

  c20: {
    summary: opens('Elle n\'est pas fatiguée', 'She is not tired'),
    parts: [ELLE, nApostrophePas, est, fatiguee],
  },

  c21: {
    summary: opens('Je suis ici', 'I am here'),
    parts: [JE, suis, ici],
  },

  c22: {
    summary: opens('Est-ce qu\'il est ici ?', 'Is he here?'),
    parts: [
      estCeQuLower(
        'il',
        'The same happens before \'elle\' and \'on\': est-ce qu\'elle, est-ce qu\'on.',
      ),
      est,
      ici,
    ],
  },

  c23: {
    summary: opens('Il n\'est pas ici', 'He is not here'),
    parts: [IL, nApostrophePas, est, ici],
  },

  c24: {
    summary: opens('Ils sont là', 'They are there'),
    parts: [ILS, sont, la],
  },

  c25: {
    summary: opens('Où est-ce que tu es ?', 'Where are you?'),
    parts: [
      ouWhere,
      p(
        'est-ce que',
        'This is the construction that turns a statement into a question — word for word, \'is it that ….\' Behind a question word it lets the rest of the sentence keep its ordinary statement order.',
      ),
      tu,
      es,
    ],
    whole:
      'The shape is question word + est-ce que + an ordinary sentence: où est-ce que tu es ? Any question word can take the front slot, and the words behind it never have to be rearranged.',
  },

  c26: {
    summary: opens('Je suis là', 'I am here'),
    parts: [JE, suis, la],
    whole:
      '\'là\' points somewhere away from the speaker, but \'je suis là\' is nonetheless the ordinary way to say \'I\'m here\' or \'I\'ve arrived.\' Only the situation separates the two readings.',
  },

  c27: {
    summary: opens('On est ici', 'We are here'),
    parts: [ON, est, ici],
  },

  c28: {
    summary: opens('On est en retard', 'We are late'),
    parts: [ON, est, enRetard],
  },

  c29: {
    summary: opens('Est-ce qu\'on est en retard ?', 'Are we late?'),
    parts: [
      estCeQuLower(
        'on',
        '\'on\' is the everyday word for \'we,\' and it takes the same verb form as \'il\' and \'elle.\'',
      ),
      est,
      enRetard,
    ],
  },

  c30: {
    summary: opens('On est ensemble', 'We are together'),
    parts: [
      ON,
      est,
      p(
        'ensemble',
        'This is an adverb meaning \'together.\' It is one word and never changes shape.',
      ),
    ],
  },

  c31: {
    summary: opens('On n\'est pas ensemble', 'We are not together'),
    parts: [ON, nApostrophePas, est, p('ensemble', 'This is an adverb meaning \'together.\'')],
    whole:
      'It is \'est,\' not \'on,\' that causes the apostrophe: \'ne\' comes up against the vowel of \'est\' and drops its e — on n\'est pas.',
  },

  c32: {
    summary: opens('Le bus est en retard', 'The bus is late'),
    parts: [
      p(
        'Le',
        'This is the definite article meaning \'the,\' used in front of a masculine noun. Every French noun is either masculine or feminine, and the word for \'the\' changes to match: \'le bus,\' but \'la voiture.\' The gender belongs to the word itself, so it is worth learning \'le bus\' rather than \'bus\' alone.',
      ),
      bus,
      est,
      enRetard,
    ],
    whole:
      'A thing can be the subject just as a person can, and the verb behaves in exactly the same way: le bus est en retard.',
  },

  c33: {
    summary: opens('C\'est ici', 'It\'s here'),
    parts: [CEST, ici],
  },

  c34: {
    summary: opens('Ce n\'est pas ici', 'It is not here'),
    parts: [
      p(
        'Ce',
        'This is the pronoun meaning \'this\' or \'that\' — the \'ce\' of \'c\'est,\' written out in full. It shortens to \'c\'\' only in front of a vowel, and here the next word is \'n\',\' so it keeps its e.',
      ),
      nApostrophePas,
      est,
      ici,
    ],
    whole:
      'The negative of \'c\'est\' is \'ce n\'est pas\': \'ne\' slips in between, so \'ce\' no longer meets a vowel and it is \'ne\' that loses a letter instead. Spoken, people say \'c\'est pas ici.\'',
  },

  c35: {
    summary: opens('C\'est mon ami', 'It\'s my friend'),
    parts: [CEST, mon, ami],
  },

  c36: {
    summary: opens('Mon ami est très occupé', 'My friend is very busy'),
    parts: [
      p(
        'Mon',
        'This is a possessive adjective meaning \'my,\' used in front of a masculine noun. It matches the gender of the thing owned, not the owner.',
      ),
      ami,
      est,
      tres,
      occupe,
    ],
  },

  c37: {
    summary: opens('C\'est ma voiture', 'It\'s my car'),
    parts: [CEST, ma, voiture],
    whole:
      'The word for \'my\' follows the gender of the thing owned, never the gender of the owner: everyone says \'ma voiture\' and everyone says \'mon ami.\'',
  },

  c38: {
    summary: opens('Où est ma voiture ?', 'Where is my car?'),
    parts: [
      p('Où', 'This is a question word meaning \'where.\''),
      est,
      p('ma', 'This is a possessive adjective meaning \'my,\' used in front of a feminine noun.'),
      voiture,
    ],
    whole:
      'To ask where something is, French puts \'où\' first and the verb straight after it, with the subject last: où est ma voiture ? It is a fixed shape worth learning whole, because \'où est-ce que ma voiture est\' is not something anyone says.',
  },

  c39: {
    summary: opens('C\'est ça', 'That\'s it'),
    parts: [
      CEST,
      p(
        'ça',
        'This is a pronoun meaning \'that\' or \'it.\' It points at a thing or a situation without naming it.',
      ),
    ],
    whole: '\"c\'est ça\" is an everyday phrase in its own right: that\'s it, that\'s right, exactly.',
  },

  c40: {
    summary: opens('Est-ce que c\'est ça ?', 'Is that it?'),
    parts: [estCeQue, cEst, p('ça', 'This is a pronoun meaning \'that\' or \'it.\'')],
    whole:
      '\'est-ce que\' sits in front of the finished sentence \'c\'est ça\' and leaves it exactly as it was.',
  },

  c41: {
    summary: opens('C\'est bien', 'That\'s good'),
    parts: [
      CEST,
      p(
        'bien',
        'This is an adverb meaning \'good\' or \'well.\' \'c\'est bien\' is said about a situation — that\'s good, that works — rather than about the quality of a thing.',
      ),
    ],
  },

  c42: {
    summary: opens('Je suis content', 'I am glad'),
    parts: [
      JE,
      suis,
      p(
        'content',
        'This is an adjective meaning \'glad\' or \'pleased\' — happy about something in particular. A woman writes \'contente,\' and there the final t is heard; a group writes \'contents\' or \'contentes.\'',
      ),
    ],
  },

  c43: {
    summary: opens('Je suis fatigué, mais je suis content', 'I am tired, but I am glad'),
    parts: [
      JE,
      suis,
      fatigue,
      mais,
      je,
      p(
        'suis',
        'This is \'être\' (to be) conjugated for \'je\' again. French states the subject and the verb a second time, where English can drop both and say \'but glad.\'',
      ),
      p('content', 'This is an adjective meaning \'glad\' or \'pleased.\' A woman writes \'contente.\''),
    ],
    whole:
      'Together the sentence sets one state against another: tired on one side, glad on the other.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 2 — avoir
  // ───────────────────────────────────────────────────────────────────────────
  c44: {
    summary: opens('C\'est une voiture', 'It\'s a car'),
    parts: [CEST, une, voiture],
    whole:
      'There is no way to leave out the word for \'a\': a countable noun in French always has an article in front of it.',
  },

  c45: {
    summary: opens('J\'ai une voiture', 'I have a car'),
    parts: [jApostropheAi, une, voiture],
  },

  c46: {
    summary: opens('Tu as une voiture', 'You have a car'),
    parts: [tu, as, une, voiture],
  },

  c47: {
    summary: opens('Il a une voiture', 'He has a car'),
    parts: [IL, a, une, voiture],
  },

  c48: {
    summary: opens('Elle a une voiture', 'She has a car'),
    parts: [ELLE, a, une, voiture],
    whole: '\'avoir\' takes the same form with \'elle\' as with \'il\': elle a, il a.',
  },

  c49: {
    summary: opens('Nous avons une voiture', 'We have a car'),
    parts: [NOUS, avons, une, voiture],
  },

  c50: {
    summary: opens('Vous avez une voiture', 'You have a car'),
    parts: [VOUS, avez, une, voiture],
  },

  c51: {
    summary: opens('Ils ont une voiture', 'They have a car'),
    parts: [ILS, ont, une, voiture],
  },

  c52: {
    summary: opens('Elles ont une voiture', 'They have a car', 'The group is entirely female.'),
    parts: [ELLES, ont, une, voiture],
  },

  c53: {
    summary: opens('On a une voiture', 'We have a car'),
    parts: [ON, a, une, voiture],
    whole:
      '\'on\' takes the \'il\' form of the verb even though it means \'we\': on a, never \'on avons.\' This is the sentence a French speaker is far likelier to say than \'nous avons une voiture.\'',
  },

  c54: {
    summary: opens('Est-ce que tu as une voiture ?', 'Do you have a car?'),
    parts: [estCeQue, tu, as, une, voiture],
    whole:
      'English has to bring in an extra verb to ask this — \'do you have.\' French adds nothing to the verb at all; \'est-ce que\' carries the whole question.',
  },

  c55: {
    summary: opens('Je n\'ai pas de voiture', 'I don\'t have a car'),
    parts: [JE, nApostrophePas, ai, deNeg, voiture],
    whole:
      'The negative changes two things at once: \'ne … pas\' closes around the verb, and \'une\' gives way to \'de.\' j\'ai une voiture → je n\'ai pas de voiture.',
  },

  c56: {
    summary: opens('Il n\'a pas de voiture', 'He doesn\'t have a car'),
    parts: [IL, nApostrophePas, a, deNeg, voiture],
  },

  c57: {
    summary: opens('Elle a un ami ici', 'She has a friend here'),
    parts: [
      ELLE,
      a,
      un,
      p(
        'ami',
        'This is a masculine singular noun meaning \'friend\' — which is what makes it \'un ami\' and not \'une amie.\'',
      ),
      ici,
    ],
  },

  c58: {
    summary: opens('Nous avons des amis', 'We have some friends'),
    parts: [NOUS, avons, des, amis],
  },

  c59: {
    summary: opens('Est-ce que vous avez des amis ici ?', 'Do you have some friends here?'),
    parts: [
      estCeQue,
      vous,
      avez,
      p(
        'des',
        'This is the plural of \'un\' and \'une,\' meaning \'some.\' French says it where English leaves it out.',
      ),
      amis,
      ici,
    ],
  },

  c60: {
    summary: opens('On a deux amis', 'We have two friends'),
    parts: [
      ON,
      a,
      p(
        'deux',
        'This is the number \'two.\' The x is silent on its own, but it links onto a following vowel as a z: \'deux amis\' comes out deu-zamis.',
      ),
      amis,
    ],
    whole:
      'A number takes the place of \'un\' or \'des\' — the thing is counted now, so no other word for \'some\' is needed.',
  },

  c61: {
    summary: opens('Il a faim', 'He is hungry'),
    parts: [IL, a, faim],
    whole:
      'A whole family of states works this way in French, using \'avoir\' where English uses \'to be.\'',
  },

  c62: {
    summary: opens('Est-ce que tu as faim ?', 'Are you hungry?'),
    parts: [
      estCeQue,
      tu,
      as,
      p(
        'faim',
        'This is a feminine singular noun meaning \'hunger.\' \'avoir faim\' is to be hungry, with no article in between.',
      ),
    ],
  },

  c63: {
    summary: opens('Je n\'ai pas faim', 'I am not hungry'),
    parts: [
      JE,
      nApostrophePas,
      ai,
      p(
        'faim',
        'This is a feminine singular noun meaning \'hunger,\' standing bare behind the verb: \'avoir faim\' is to be hungry.',
      ),
    ],
    whole:
      '\'faim\' has no \'un\' or \'une\' in front of it, so a negative has nothing to collapse: je n\'ai pas faim. Where a countable thing is involved the article does change — je n\'ai pas de voiture.',
  },

  c64: {
    summary: opens('Elle a soif', 'She is thirsty'),
    parts: [ELLE, a, soif],
  },

  c65: {
    summary: opens('Nous avons soif', 'We are thirsty'),
    parts: [
      NOUS,
      avons,
      p(
        'soif',
        'This is a feminine singular noun meaning \'thirst.\' \'avoir soif\' is to be thirsty.',
      ),
    ],
  },

  c66: {
    summary: opens('Vous avez le temps ?', 'Do you have time?'),
    parts: [VOUS, avez, le, temps],
    whole:
      'This is asked with the voice alone: the words stand in their statement order and only the rise at the end makes it a question. English needs \'do\' to ask the same thing. French leaves a space before the question mark.',
  },

  c67: {
    summary: opens('Je n\'ai pas le temps', 'I don\'t have time'),
    parts: [JE, nApostrophePas, ai, leNeg, temps],
  },

  c68: {
    summary: opens('On n\'a pas le temps', 'We don\'t have time'),
    parts: [
      ON,
      nApostrophePas,
      a,
      p(
        'le',
        'This is the definite article \'the.\' It keeps its place under a negative, where \'un,\' \'une\' and \'des\' would give way to \'de\': on n\'a pas le temps.',
      ),
      temps,
    ],
  },

  c69: {
    summary: opens('On a besoin d\'une voiture', 'We need a car'),
    parts: [
      ON,
      a,
      besoin,
      p(
        'd\'',
        'This is the preposition \'de\' (of), the fixed last piece of \'avoir besoin de\' — it never drops away. In front of a vowel it shortens to \'d\'.\'',
      ),
      une,
      voiture,
    ],
    whole:
      'Word for word this is \'we have need of a car.\' The three pieces \'avoir + besoin + de\' work as one verb, so the thing needed always arrives behind \'de.\'',
  },

  c70: {
    summary: opens('J\'ai besoin de mon ami', 'I need my friend'),
    parts: [
      p(
        'J\'ai',
        'This is \'je\' (I) and \'ai,\' the verb \'avoir\' (to have) conjugated for \'je,\' meaning \'have.\' In front of a vowel \'je\' drops its e: je ai → j\'ai.',
      ),
      besoin,
      p('de', 'This is the preposition \'of,\' the fixed second half of \'avoir besoin de.\''),
      mon,
      ami,
    ],
    whole:
      '\'avoir besoin de\' works for people as readily as for things: j\'ai besoin de mon ami is \'I need my friend.\'',
  },

  c71: {
    summary: opens('Il y a un bus', 'There is a bus'),
    parts: [ilYA, un, bus],
    whole:
      '\'il y a\' is how French says that something exists or is present, and it is fixed: the same three words whether there is one bus or many.',
  },

  c72: {
    summary: opens('Est-ce qu\'il y a un bus ici ?', 'Is there a bus here?'),
    parts: [
      estCeQuLower('il', 'The \'il\' here is the one inside \'il y a,\' and it stands for nobody.'),
      yA,
      un,
      bus,
      ici,
    ],
  },

  c73: {
    summary: opens('Il n\'y a pas de bus', 'There is no bus'),
    parts: [
      ilNYAPas,
      p(
        'de',
        'This is what \'un,\' \'une\' and \'des\' all become after a negative: il y a un bus → il n\'y a pas de bus.',
      ),
      bus,
    ],
  },

  c74: {
    summary: opens('Il y a un problème', 'There is a problem'),
    parts: [ilYA, un, probleme],
  },

  c75: {
    summary: opens('Est-ce qu\'il y a un problème ?', 'Is there a problem?'),
    parts: [
      estCeQuLower('il', 'The \'il\' here is the one inside \'il y a,\' and it stands for nobody.'),
      yA,
      un,
      probleme,
    ],
  },

  c76: {
    summary: opens('Il n\'y a pas de problème', 'There is no problem'),
    parts: [
      ilNYAPas,
      p('de', 'This is what \'un,\' \'une\' and \'des\' become after a negative.'),
      probleme,
    ],
    whole:
      '\'il n\'y a pas de problème\' is also an everyday reply in its own right: no problem, that\'s fine.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 3 — vouloir
  // ───────────────────────────────────────────────────────────────────────────
  c77: {
    summary: opens('C\'est un café', 'It\'s a coffee'),
    parts: [CEST, un, cafe],
  },

  c78: {
    summary: opens('Je veux un café', 'I want a coffee'),
    parts: [JE, VEUX, un, cafe],
  },

  c79: {
    summary: opens('Tu veux un café', 'You want a coffee'),
    parts: [tu, veuxTu, un, cafe],
    whole:
      '\'vouloir\' keeps the identical spelling with \'tu\' as with \'je\': je veux, tu veux. That is unusual — \'être\' and \'avoir\' both change (je suis / tu es, j\'ai / tu as) — so only the subject in front tells these two apart.',
  },

  c80: {
    summary: opens('Il veut un café', 'He wants a coffee'),
    parts: [IL, veut, un, cafe],
  },

  c81: {
    summary: opens('Elle veut un café', 'She wants a coffee'),
    parts: [ELLE, veut, un, cafe],
  },

  c82: {
    summary: opens('Nous voulons un café', 'We want a coffee'),
    parts: [NOUS, voulons, un, cafe],
  },

  c83: {
    summary: opens('Vous voulez un café', 'You want a coffee'),
    parts: [VOUS, voulez, un, cafe],
  },

  c84: {
    summary: opens('Ils veulent un café', 'They want a coffee'),
    parts: [ILS, veulent, un, cafe],
  },

  c85: {
    summary: opens('Elles veulent un café', 'They want a coffee', 'The group is entirely female.'),
    parts: [ELLES, veulent, un, cafe],
  },

  c86: {
    summary: opens('On veut un café', 'We want a coffee'),
    parts: [ON, veut, un, cafe],
    whole:
      '\'on\' takes the \'il\' form: on veut, never \'on voulons.\' Meaning \'we\' while behaving like \'he\' is the whole trick of \'on.\'',
  },

  c87: {
    summary: opens('Est-ce que tu veux un café ?', 'Do you want a coffee?'),
    parts: [estCeQue, tu, veuxTu, un, cafe],
    whole: '\'est-ce que tu veux …?\' is the everyday way to offer someone something.',
  },

  c88: {
    summary: opens('Je veux du café', 'I want some coffee'),
    parts: [
      JE,
      veux,
      du,
      p(
        'café',
        'This is a masculine singular noun meaning \'coffee\' — which is why the word for \'some\' in front of it is \'du.\'',
      ),
    ],
    whole:
      '\'du café\' is an unmeasured amount of the stuff; \'un café\' is one cup of it. English can leave the difference to context — \'I want coffee\' — but French always picks one or the other.',
  },

  c89: {
    summary: opens('On veut du pain', 'We want some bread'),
    parts: [
      ON,
      veut,
      p(
        'du',
        'This is the partitive article meaning \'some\' — an uncounted amount of a masculine thing.',
      ),
      pain,
    ],
  },

  c90: {
    summary: opens('Est-ce que vous voulez du pain ?', 'Do you want some bread?'),
    parts: [
      estCeQue,
      vous,
      voulez,
      p(
        'du',
        'This is the partitive article meaning \'some,\' used for a masculine thing that is not counted.',
      ),
      pain,
    ],
  },

  c91: {
    summary: opens('Elle veut de l\'eau', 'She wants some water'),
    parts: [ELLE, veut, deL, eau],
    whole:
      'The set is \'du\' in front of a masculine word, \'de la\' in front of a feminine one, and \'de l\'\' in front of any word starting with a vowel.',
  },

  c92: {
    summary: opens('Il veut de la viande', 'He wants some meat'),
    parts: [IL, veut, deLa, viande],
  },

  c93: {
    summary: opens('Je ne veux pas de viande', 'I don\'t want any meat'),
    parts: [
      JE,
      nePas,
      veux,
      p(
        'de',
        'After a negative, \'du,\' \'de la\' and \'de l\'\' all flatten to plain \'de\': je veux de la viande → je ne veux pas de viande.',
      ),
      viande,
    ],
  },

  c94: {
    summary: opens('Il n\'y a pas d\'eau', 'There is no water'),
    parts: [
      ilNYAPas,
      p(
        'd\'',
        'This is what \'un,\' \'une,\' \'du,\' \'de la\' and \'de l\'\' all become after a negative: plain \'de,\' shortened to \'d\'\' in front of a vowel.',
      ),
      eau,
    ],
  },

  c95: {
    summary: opens('Je veux manger', 'I want to eat'),
    parts: [JE, veux, manger],
    whole:
      'je veux manger is \'I want to eat.\' No French word for the English \'to\' appears, because \'manger\' already carries it in its ending.',
  },

  c96: {
    summary: opens('On veut manger maintenant', 'We want to eat now'),
    parts: [ON, veut, mangerShort, maintenant],
  },

  c97: {
    summary: opens('Elle veut boire de l\'eau', 'She wants to drink some water'),
    parts: [ELLE, veut, boire, deL, eau],
    whole:
      'Two verbs in a row, then what is drunk: elle veut boire de l\'eau. Only the first verb changes to match the subject; the second stays in its infinitive form.',
  },

  c98: {
    summary: opens('Tu veux boire quelque chose ?', 'Do you want to drink something?'),
    parts: [tu, veuxTu, boire, quelqueChose],
    whole:
      'Asked with the voice alone — no \'est-ce que\' and no rearranged words — which is how an offer like this is usually made.',
  },

  c99: {
    summary: opens('Nous voulons partir', 'We want to leave'),
    parts: [NOUS, voulons, partir],
  },

  c100: {
    summary: opens('Est-ce que vous voulez partir maintenant ?', 'Do you want to leave now?'),
    parts: [estCeQue, vous, voulez, partir, maintenant],
  },

  c101: {
    summary: opens('Ils ne veulent pas partir', 'They don\'t want to leave'),
    parts: [ILS, nePas, veulent, partir],
    whole:
      '\'ne … pas\' closes around the verb that carries the person, and only that one. The second verb stays outside, behind \'pas\': ils ne veulent pas partir.',
  },

  c102: {
    summary: opens('Elles veulent travailler ici', 'They want to work here'),
    parts: [ELLES, veulent, travailler, ici],
  },

  c103: {
    summary: opens('On ne veut pas travailler', 'We don\'t want to work'),
    parts: [ON, nePas, veut, travailler],
  },

  c104: {
    summary: opens('Il veut aider', 'He wants to help'),
    parts: [IL, veut, aider],
  },

  c105: {
    summary: opens('Est-ce qu\'elle veut aider ?', 'Does she want to help?'),
    parts: [
      estCeQuLower('elle', '\'elle\' means \'she,\' and also \'it\' for a feminine thing.'),
      veut,
      aider,
    ],
  },

  c106: {
    summary: opens('Je veux un peu de café', 'I want a little coffee'),
    parts: [
      JE,
      veux,
      unPeu,
      p(
        'de',
        'After a word of quantity such as \'un peu,\' the word for \'some\' flattens to plain \'de\': \'du café\' on its own, but \'un peu de café.\'',
      ),
      p('café', 'This is a masculine singular noun meaning \'coffee.\''),
    ],
  },

  c107: {
    summary: opens('Elle veut un peu d\'eau', 'She wants a little water'),
    parts: [
      ELLE,
      veut,
      unPeu,
      p(
        'd\'',
        'This is the \'de\' that follows a quantity word such as \'un peu.\' In front of a vowel it shortens to \'d\'.\'',
      ),
      p('eau', 'This is a feminine singular noun meaning \'water.\''),
    ],
  },

  c108: {
    summary: opens(
      'Est-ce que tu veux de l\'eau ou du café ?',
      'Do you want some water or some coffee?',
    ),
    parts: [estCeQue, tu, veuxTu, deL, eau, ou, du, cafe],
    whole:
      'Each option carries its own word for \'some\': de l\'eau ou du café. French does not let the second one lean on the first the way English does.',
  },

  c109: {
    summary: opens('On veut du pain et de la viande', 'We want some bread and some meat'),
    parts: [
      ON,
      veut,
      p(
        'du',
        'This is the partitive article meaning \'some,\' for a masculine thing that is not counted.',
      ),
      pain,
      et,
      deLa,
      viande,
    ],
  },

  c110: {
    summary: opens(
      'Il veut manger, mais il n\'a pas le temps',
      'He wants to eat, but he doesn\'t have time',
    ),
    parts: [
      IL,
      veut,
      mangerShort,
      mais,
      p(
        'il',
        'This is the subject pronoun meaning \'he,\' said again in the second half. French does not leave it out.',
      ),
      nApostrophePas,
      a,
      leNeg,
      temps,
    ],
    whole: `${secondVerb} And where English can say 'he wants to eat but doesn\'t have time,' French repeats the subject: il veut … mais il n'a pas ….`,
  },

  c111: {
    summary: opens('Je veux du pain avec du café', 'I want some bread with some coffee'),
    parts: [
      JE,
      veux,
      p(
        'du',
        'This is the partitive article meaning \'some,\' for a masculine thing that is not counted.',
      ),
      pain,
      p('avec', 'This is a preposition meaning \'with.\''),
      du,
      cafe,
    ],
  },

  c112: {
    summary: opens(
      'Nous voulons aider, mais nous sommes très occupés',
      'We want to help, but we are very busy',
    ),
    parts: [
      NOUS,
      voulons,
      aider,
      mais,
      p('nous', 'This is the subject pronoun meaning \'we,\' said again to open the second half.'),
      sommes,
      tres,
      occupes,
    ],
    whole: 'Two complete sentences joined by \'mais,\' each with its own subject and its own verb.',
  },

  c113: {
    summary: opens(
      'Est-ce qu\'on veut du café ou de l\'eau ?',
      'Do we want some coffee or some water?',
    ),
    parts: [
      estCeQuLower(
        'on',
        '\'on\' means \'we,\' and it takes the same verb form as \'il\' and \'elle\': on veut.',
      ),
      veut,
      du,
      cafe,
      ou,
      deL,
      eau,
    ],
  },

  c114: {
    summary: opens(
      'Je ne veux pas de pain, je veux du café',
      'I don\'t want any bread, I want some coffee',
    ),
    parts: [
      JE,
      nePas,
      veux,
      p(
        'de',
        'After a negative, \'du\' and \'de la\' flatten to plain \'de\': je veux du pain → je ne veux pas de pain.',
      ),
      pain,
      je,
      p('veux', 'This is \'vouloir\' (to want) conjugated for \'je\' again, now in a plain statement.'),
      du,
      cafe,
    ],
    whole:
      'The two halves show the same word in both states: \'de\' under the negative, \'du\' in the positive.',
  },

  c115: {
    summary: opens('On veut manger quelque chose maintenant', 'We want to eat something now'),
    parts: [ON, veut, mangerShort, quelqueChose, maintenant],
    whole:
      'The order is subject, verb, second verb, what is eaten, when: on veut manger quelque chose maintenant.',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 4 — pouvoir
  // ───────────────────────────────────────────────────────────────────────────
  c116: {
    summary: opens('Je peux partir', 'I can leave'),
    parts: [JE, peux, partir],
    whole: `'pouvoir' is almost always followed by a second verb, and that verb stays plain. ${secondVerb}`,
  },

  c117: {
    summary: opens('Tu peux partir', 'You can leave'),
    parts: [TU, peuxTu, partir],
    whole:
      '\'pouvoir\' is spelled the same for \'je\' and for \'tu\': je peux, tu peux. Nothing on the verb marks which one it is, so the pronoun carries the whole distinction.',
  },

  c118: {
    summary: opens('Il peut partir', 'He can leave'),
    parts: [IL, peut, partir],
  },

  c119: {
    summary: opens('Elle peut partir maintenant', 'She can leave now'),
    parts: [ELLE, peut, partir, maintenant],
    whole:
      '\'elle\' takes the same form of \'pouvoir\' as \'il\': elle peut, il peut. The time word goes at the end.',
  },

  c120: {
    summary: opens('Nous pouvons partir', 'We can leave'),
    parts: [NOUS, pouvons, partir],
  },

  c121: {
    summary: opens('Vous pouvez partir', 'You can leave'),
    parts: [VOUS, pouvez, partir],
  },

  c122: {
    summary: opens('Ils peuvent partir', 'They can leave'),
    parts: [ILS, peuvent, partir],
  },

  c123: {
    summary: opens('On peut partir ensemble', 'We can leave together'),
    parts: [ON, peut, partir, ensemble],
  },

  c124: {
    summary: opens('Elle ne peut pas travailler', 'She can\'t work'),
    parts: [ELLE, nePas, peut, travailler],
    whole:
      'With two verbs in the sentence, \'ne … pas\' closes around the conjugated one and the infinitive stays outside, behind \'pas\': elle ne peut pas travailler. The two halves never spread out to cover both verbs.',
  },

  c125: {
    summary: opens('Elles ne peuvent pas aider', 'They can\'t help'),
    parts: [ELLES, nePas, peuvent, aider],
  },

  c126: {
    summary: opens('Est-ce que tu peux manger avec mon ami ?', 'Can you eat with my friend?'),
    parts: [estCeQue, tu, peuxTu, mangerShort, avec, mon, ami],
    whole:
      'English asks this by moving \'can\' to the front. French moves nothing: \'est-ce que\' goes on the front of the ordinary statement and the rest stays exactly as it was.',
  },

  c127: {
    summary: opens('Est-ce que je peux entrer ?', 'Can I come in?'),
    parts: [estCeQue, je, peux, entrer],
    whole: 'This is the ordinary way to ask permission, and the careful one.',
  },

  c128: {
    summary: opens('Je peux entrer ?', 'Can I come in?'),
    parts: [JE, peux, entrer],
    whole:
      'Nothing has been added to make this a question — it is the plain statement \'je peux entrer\' with the voice rising at the end. This is what people use most in conversation; \'est-ce que je peux entrer ?\' is its slightly more careful twin.',
  },

  c129: {
    summary: opens('Tu peux entrer', 'You can come in'),
    parts: [TU, peuxTu, entrer],
  },

  c130: {
    summary: opens('Est-ce que je peux sortir ?', 'Can I go out?'),
    parts: [estCeQue, je, peux, sortir],
  },

  c131: {
    summary: opens('On ne peut pas sortir maintenant', 'We can\'t go out now'),
    parts: [ON, nePas, peut, sortir, maintenant],
  },

  c132: {
    summary: opens('Est-ce qu\'on peut rester ici ?', 'Can we stay here?'),
    parts: [
      estCeQuLower(
        'on',
        '\'on\' means \'we,\' and it takes the same verb form as \'il\' and \'elle\': on peut.',
      ),
      peut,
      rester,
      ici,
    ],
  },

  c133: {
    summary: opens('Nous ne pouvons pas rester', 'We can\'t stay'),
    parts: [NOUS, nePas, pouvons, rester],
  },

  c134: {
    summary: opens('Ils peuvent rester ici', 'They can stay here'),
    parts: [ILS, peuvent, rester, ici],
  },

  c135: {
    summary: opens('Est-ce que vous pouvez aider, s\'il vous plaît ?', 'Can you help, please?'),
    parts: [estCeQue, vous, pouvez, aider, silVousPlait],
    whole:
      'The polite word goes at the end, after the whole question, and it is separated by a comma.',
  },

  c136: {
    summary: opens('Pouvez-vous aider ?', 'Can you help?'),
    parts: [POUVEZ_VOUS, aider],
    whole:
      'This asks the same thing as \'est-ce que vous pouvez aider ?\' but sounds more formal. Swapping the verb and its subject is how French asks a polite question in a small set of fixed cases; everywhere else \'est-ce que\' does the work instead.',
  },

  c137: {
    summary: opens('Pouvez-vous rester ici, s\'il vous plaît ?', 'Can you stay here, please?'),
    parts: [POUVEZ_VOUS, rester, ici, silVousPlait],
  },

  c138: {
    summary: opens('Merci, c\'est très bien', 'Thank you, that\'s very good'),
    parts: [MERCI, cEst, tres, bien],
  },

  c139: {
    summary: opens('Oui, je peux', 'Yes, I can'),
    parts: [OUI, je, peux],
    whole:
      'English can answer with \'yes, I can\' and stop there. French does the same, and the verb it repeats is the one the question asked with.',
  },

  c140: {
    summary: opens('Non, je ne peux pas', 'No, I can\'t'),
    parts: [NON, je, nePas, peux],
    whole:
      'Two different \'no\'s in one answer: \'non\' answers the question, and \'ne … pas\' negates the sentence that follows it.',
  },

  c141: {
    summary: opens('Oui, vous pouvez entrer', 'Yes, you can come in'),
    parts: [OUI, vous, pouvez, entrer],
  },

  c142: {
    summary: opens('D\'accord, on peut manger maintenant', 'All right, we can eat now'),
    parts: [dAccord, on, peut, mangerShort, maintenant],
  },

  c143: {
    summary: opens('Peut-être, mais on est en retard', 'Maybe, but we are late'),
    parts: [peutEtre, mais, on, est, enRetard],
  },

  c144: {
    summary: opens('Non merci, je n\'ai pas faim', 'No thank you, I am not hungry'),
    parts: [NON, merci, je, nApostrophePas, ai, faim],
    whole:
      '\'non merci\' is the standard way to turn down an offer, and the sentence after it gives the reason.',
  },

  c145: {
    summary: opens('Est-ce que tu peux parler avec mon ami ?', 'Can you talk with my friend?'),
    parts: [estCeQue, tu, peuxTu, parler, avec, mon, ami],
  },

  c146: {
    summary: opens('Tu peux regarder ma voiture', 'You can look at my car'),
    parts: [TU, peuxTu, regarder, ma, voiture],
    whole:
      'Nothing stands between \'regarder\' and what is being looked at. The English \'at\' has no French counterpart here — it is already part of the verb.',
  },

  c147: {
    summary: opens('Il est ici pour aider', 'He is here to help'),
    parts: [IL, est, ici, pour, aider],
    whole:
      'The last two words give the reason: \'pour\' plus an infinitive answers the question \'what for?\'',
  },

  c148: {
    summary: opens('Il y a un problème, mais on peut aider', 'There is a problem, but we can help'),
    parts: [ilYA, un, probleme, mais, on, peut, aider],
  },

  c149: {
    summary: opens('Est-ce que tu es libre maintenant ?', 'Are you free now?'),
    parts: [estCeQue, tu, es, libre, maintenant],
  },

  c150: {
    summary: opens('Je veux partir, mais je ne peux pas', 'I want to leave, but I can\'t'),
    parts: [
      JE,
      veux,
      partir,
      mais,
      p('je', 'This is the subject pronoun meaning \'I,\' said again to open the second half.'),
      nePas,
      peux,
    ],
    whole:
      'The two halves put the block\'s two verbs against each other: \'vouloir\' is wanting something, \'pouvoir\' is being able to do it. French keeps them apart, and the second half needs no second verb after \'peux\' — what he can\'t do is already established by the first half.',
  },
}

export function explanationFor(cardId: string): CardExplanation | undefined {
  return EXPLANATIONS[cardId]
}
