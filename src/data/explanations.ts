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

// ─── devoir ─────────────────────────────────────────────────────────────────
const dois = p(
  'dois',
  'This is the verb \'devoir\' (to have to), conjugated for \'je.\' It means \'must\' or \'have to.\' \'devoir\' also carries a second, unrelated meaning — to owe someone something — which behaves differently and is not what is happening here.',
)
const doisTu = p(
  'dois',
  'This is the verb \'devoir\' (to have to), conjugated for \'tu.\' It means \'must\' or \'have to.\' The \'je\' and \'tu\' forms are spelled identically, so the subject in front is what separates them.',
)
const doit = p(
  'doit',
  'This is the verb \'devoir\' (to have to), conjugated for \'il,\' \'elle\' or \'on.\' It means \'must\' or \'has to.\' It sounds exactly like the \'dois\' used with \'je\' and \'tu\'; only the spelling changes.',
)
const devons = p(
  'devons',
  'This is the verb \'devoir\' (to have to), conjugated for \'nous.\' It means \'must\' or \'have to.\'',
)
const devez = p(
  'devez',
  'This is the verb \'devoir\' (to have to), conjugated for \'vous.\' It means \'must\' or \'have to.\' The \'-ez\' ending sounds like é.',
)
const doivent = p(
  'doivent',
  'This is the verb \'devoir\' (to have to), conjugated for \'ils\' or \'elles.\' It means \'must\' or \'have to.\' The \'-ent\' ending is silent, and the vowel shifts away from the \'nous\' and \'vous\' forms: nous devons, but ils doivent.',
)

// ─── Why, and obligation with nobody attached ───────────────────────────────
const POURQUOI = p(
  'Pourquoi',
  'This is a question word meaning \'why.\' It goes at the very front of the question, ahead of \'est-ce que,\' and everything after it keeps ordinary statement order.',
)
const parceQueNote =
  'This is a conjunction meaning \'because.\' It joins a reason onto a statement, and each half keeps its own subject and its own verb.'
const parceQue = p('parce que', parceQueNote)
const parceQuLower = (rest: string) =>
  p(
    `parce qu'${rest}`,
    `${parceQueNote} In front of a vowel 'que' drops its e and joins the next word with an apostrophe: parce que ${rest} → parce qu'${rest}.`,
  )
const ilFautNote =
  'This is a fixed expression meaning \'it is necessary to\' — the way French says something must be done without naming who has to do it. The \'il\' in it stands for nobody, just as \'it\' stands for nobody in \'it is raining.\' The verb behind it, \'falloir,\' appears in no other present-tense form, so the phrase is used whole.'
const ilFaut = p('Il faut', ilFautNote)
const faut = p('faut', ilFautNote)
const ilNeFautPas = p(
  'Il ne faut pas',
  'This is the negative of \'il faut,\' and it forbids rather than excuses: \'il faut rester\' means you have to stay, and \'il ne faut pas rester\' means you must not stay. It never means that the thing is optional — French says that another way entirely.',
)

// ─── Block 5 infinitives and words ──────────────────────────────────────────
const payer = p(
  'payer',
  'This is an infinitive verb meaning \'to pay.\' Paying for something takes no preposition in French — the thing follows the verb directly.',
)
const appeler = p(
  'appeler',
  'This is an infinitive verb meaning \'to call\' — on the phone, or calling out to someone.',
)
const demander = p(
  'demander',
  'This is an infinitive verb meaning \'to ask\' or \'to ask for.\' It is milder than the English \'to demand,\' which is a much stronger word: this is the ordinary, neutral way to ask.',
)
const trouver = p(
  'trouver',
  'This is an infinitive verb meaning \'to find\' — arriving at the thing. Searching for it, which may or may not succeed, is \'chercher.\'',
)
const chercher = p(
  'chercher',
  'This is an infinitive verb meaning \'to look for.\' The \'for\' is already inside the French verb, so nothing is added after it.',
)
const voudrais = p(
  'voudrais',
  'This is a softened form of \'veux\' (want), meaning \'would like.\' It is what people actually say when asking for something: \'je veux un café\' sounds blunt where \'je voudrais un café\' is an ordinary request. Treat it as a fixed politeness form.',
)
const argent = p(
  'argent',
  'This is a masculine noun meaning \'money.\' It starts with a vowel, so \'the money\' is \'l\'argent.\' The same word also names the metal silver.',
)
const dArgent = p(
  'd\'argent',
  'This is \'de\' plus \'argent\' (money), with \'de\' dropping its e in front of the vowel. After a negative, the word for \'some\' collapses into plain \'de,\' which is why nothing else stands in front of the noun here.',
)
const tot = p('tôt', 'This is an adverb meaning \'early.\' It goes at the end of the sentence.')
const tard = p(
  'tard',
  'This is an adverb meaning \'late,\' in the sense of at a late hour. It is a separate idea from \'en retard,\' which is late for something — you can arrive \'tard\' without being \'en retard,\' if nobody was waiting.',
)
const vite = p(
  'vite',
  'This is an adverb meaning \'quickly\' or \'fast.\' It describes how something is done and follows the verb.',
)
const important = p(
  'important',
  'This is an adjective meaning \'important.\' A feminine subject writes \'importante,\' and the final t is then heard; a plural adds -s.',
)
const malades = p(
  'malades',
  'This is the adjective \'malade\' (sick) with the -s that matches a plural subject. The -s is silent.',
)
const avec = p('avec', 'This is a preposition meaning \'with.\'')
const bien = p(
  'bien',
  'This is an adverb meaning \'good\' or \'well.\' Said of a situation it means that it works, that it suits — rather than describing the quality of a thing.',
)
const on = p('on', onNote)

// ─── Block 6: getting to a place ────────────────────────────────────────────
const aPlaceNote =
  'This is a preposition meaning \'to\' or \'at.\' French uses the one word for both, so it is the verb in front that decides which one English says: \'je vais à la gare\' is going to the station, \'je suis à la gare\' is being at it.'
const aPlace = p('à', aPlaceNote)
const laArticle = p(
  'la',
  'This is the definite article meaning \'the,\' used in front of a feminine noun. The masculine form is \'le.\'',
)
const au = p(
  'au',
  'This is \'à\' (to, at) and \'le\' (the) written as one word. In front of a masculine noun the two always contract — \'à le travail\' is never written — while the feminine \'à la\' stays as it is.',
)
const aL = p(
  'à l\'',
  'This is \'à\' (to, at) in front of a noun starting with a vowel, where both \'le\' and \'la\' shorten to \'l\'.\' The vowel, not the gender, is what decides this form.',
)
const enVille = p(
  'en ville',
  'This is a fixed expression meaning \'into town\' or \'in town.\' Most places take \'à\' and an article — au bureau, à la gare — but \'ville\' takes \'en\' and no article at all, and the two words travel together.',
)

const maison = p(
  'maison',
  'This is a feminine singular noun meaning \'house\': la maison, ma maison. Behind \'à la\' it is also how French says \'home\' — \'à la maison\' is at home, and \'je vais à la maison\' is I am going home.',
)
const travail = p(
  'travail',
  'This is a masculine singular noun meaning \'work\' — the job, and the place it is done: le travail, au travail.',
)
const bureau = p(
  'bureau',
  'This is a masculine singular noun meaning \'office\': le bureau, au bureau. It also means the desk standing in one.',
)
const marche = p(
  'marché',
  'This is a masculine singular noun meaning \'market\' — the open-air kind, food sold from stalls: le marché, au marché.',
)
const restaurant = p(
  'restaurant',
  'This is a masculine singular noun meaning \'restaurant\': le restaurant, au restaurant.',
)
const gare = p(
  'gare',
  'This is a feminine singular noun meaning \'station,\' the train kind: la gare, à la gare. A bus station is \'la gare routière.\'',
)
const ecole = p(
  'école',
  'This is a feminine singular noun meaning \'school.\' It starts with a vowel, so \'la\' shortens to \'l\'\': l\'école, à l\'école.',
)

// ─── aller ──────────────────────────────────────────────────────────────────
const vais = p(
  'vais',
  'This is the verb \'aller\' (to go), conjugated for \'je.\' It means \'am going.\'',
)
const vas = p(
  'vas',
  'This is the verb \'aller\' (to go), conjugated for \'tu.\' It means \'are going.\'',
)
const va = p(
  'va',
  'This is the verb \'aller\' (to go), conjugated for \'il,\' \'elle\' or \'on.\' It means \'is going.\'',
)
const allons = p(
  'allons',
  'This is the verb \'aller\' (to go), conjugated for \'nous.\' It means \'are going.\' The \'nous\' and \'vous\' forms are the two that keep the \'all-\' of the infinitive; the rest of the present tense is built on \'v-\'.',
)
const allez = p(
  'allez',
  'This is the verb \'aller\' (to go), conjugated for \'vous.\' It means \'are going.\' The \'-ez\' ending sounds like é.',
)
const vont = p(
  'vont',
  'This is the verb \'aller\' (to go), conjugated for \'ils\' or \'elles.\' It means \'are going.\' The \'-ont\' ending is heard, unlike the silent \'-ent\' of most verbs.',
)
const allerInf = p('aller', `This is an infinitive verb meaning 'to go.' ${infinitiveNote}`)

/** The near future, explained on the card that opens it and on the two that lean hardest on it. */
const nearFuture =
  'A conjugated \'aller\' with an infinitive behind it says something is about to happen. French builds it exactly as English does — \'je vais manger,\' I am going to eat — and it is the everyday way to talk about the future, far more common in speech than the future tense proper.'

// ─── How things are going ───────────────────────────────────────────────────
const COMMENT = p(
  'Comment',
  'This is a question word meaning \'how.\' It goes at the very front of the question.',
)
const commentAllezVous = p(
  'Comment allez-vous',
  'This is the formal way to ask how someone is. The verb and its pronoun swap places and are joined with a hyphen — \'allez-vous\' rather than \'vous allez\' — which is what makes it a question without \'est-ce que.\' Word for word it asks \'how are you going,\' because French asks after health with \'aller\' rather than \'être.\'',
)
const CA_VA = p(
  'Ça va',
  'This is a fixed expression built from \'ça\' (that, it) and \'va\' (goes). With a rise at the end it asks \'how are you?\' or \'is everything all right?\'; said flat it answers \'I\'m fine.\' It is the most-used sentence in spoken French, and it covers health, mood and how something is turning out.',
)
const demain = p(
  'demain',
  'This is an adverb meaning \'tomorrow.\' French usually puts it at the end of the sentence.',
)
const aujourdhui = p(
  'aujourd\'hui',
  'This is an adverb meaning \'today.\' The apostrophe sits inside the word and never comes apart.',
)
const mal = p(
  'mal',
  'This is an adverb meaning \'badly.\' It is the opposite of \'bien,\' and like \'bien\' it follows the verb.',
)

// ─── Block 7: faire ─────────────────────────────────────────────────────────
const faireNote =
  'This is an infinitive verb meaning \'to do\' or \'to make.\' English keeps those two apart — you make a cake but do the dishes — and French does not: \'faire\' covers both, and which one English says is decided by what follows it.'
const faireInf = p('faire', `${faireNote} ${infinitiveNote}`)
const faireShort = p(
  'faire',
  `${faireNote} It follows straight on from the conjugated verb in front of it, with nothing in between.`,
)
const faireIrregular =
  '\'faire\' is irregular, so its forms are learned one at a time: je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font.'
const fais = p(
  'fais',
  `This is the verb 'faire' (to do, to make), conjugated for 'je' and 'tu' — one spelling serves both. It means 'do.' ${faireIrregular}`,
)
const fait = p(
  'fait',
  'This is the verb \'faire\' (to do, to make), conjugated for \'il,\' \'elle\' and \'on.\' It means \'does.\' The final -t is silent, so it sounds exactly like the \'je\' and \'tu\' form \'fais.\'',
)
const faisons = p(
  'faisons',
  'This is the verb \'faire\' (to do, to make), conjugated for \'nous.\' It means \'do.\' It is said \'fuh-zon\': the ai here is not the \'eh\' of \'fais\' but a swallowed uh, which happens in this form alone.',
)
const faites = p(
  'faites',
  'This is the verb \'faire\' (to do, to make), conjugated for \'vous.\' It means \'do.\' Almost every French verb ends its \'vous\' form in -ez; this one does not, and \'vous faisez\' does not exist.',
)
const font = p(
  'font',
  'This is the verb \'faire\' (to do, to make), conjugated for \'ils\' and \'elles.\' It means \'do.\' The \'-ont\' ending is heard, unlike the silent \'-ent\' of most verbs.',
)
const sport = p(
  'sport',
  'This is a masculine singular noun meaning \'sport.\' French has no single verb for playing sport — it says \'faire du sport,\' doing sport, and that is the ordinary way to talk about exercise of any kind.',
)
const cuisine = p(
  'cuisine',
  'This is a feminine singular noun meaning \'kitchen,\' and behind \'faire\' it is the cooking: \'faire la cuisine\' is to cook. It takes \'la\' and not \'de la\' — the cooking is the whole job, not an amount of it.',
)
const menage = p(
  'ménage',
  'This is a masculine singular noun meaning \'housework\': \'faire le ménage\' is to clean the house. Like \'la cuisine\' it takes a plain \'le,\' where \'sport\' takes \'du.\'',
)

// ─── Asking what ────────────────────────────────────────────────────────────
const questCeQueNote =
  'This is the question word \'what,\' asking after the thing a verb is done to. It is \'que\' (what) with \'est-ce que\' behind it, and the whole four-word block sits at the front of the question; everything after it keeps ordinary statement order.'
const questCeQue = p('Qu\'est-ce que', questCeQueNote)
const questCeQuLower = (rest: string) =>
  p(
    `Qu'est-ce qu'${rest}`,
    `${questCeQueNote} In front of a vowel the last 'que' drops its e and joins the next word with an apostrophe: qu'est-ce que ${rest} → qu'est-ce qu'${rest}.`,
  )
const quoi = p(
  'quoi',
  'This is the question word \'what\' in the form it takes after a verb. \'Tu fais quoi ?\' asks exactly what \'qu\'est-ce que tu fais ?\' asks, with the statement left standing and the question carried by the rise of the voice — it is what French speakers say to each other, where the longer form suits a stranger or a written question.',
)

// ─── The weather ────────────────────────────────────────────────────────────
const ilFaitNote =
  'French makes the weather with \'faire\': \'il fait chaud\' is word for word \'it makes hot.\' The \'il\' stands for nobody, just as \'it\' stands for nobody in \'it is raining,\' and the verb never changes person. \'il est chaud\' would be about a thing being hot to the touch, not about the day.'
const ilFait = p('Il fait', ilFaitNote)
const faitWeather = p('fait', ilFaitNote)
const ilImpersonal = p(
  'Il',
  'This is the subject pronoun \'il\' standing for nobody at all. French will not leave a verb without a subject, so weather sentences borrow it the way English borrows \'it\' in \'it is raining.\'',
)
const chaud = p(
  'chaud',
  'This is an adjective meaning \'hot.\' The final d is silent. A feminine thing is \'chaude,\' where the d is heard.',
)
const froid = p(
  'froid',
  'This is an adjective meaning \'cold.\' The final d is silent. A feminine thing is \'froide,\' where the d is heard.',
)
const froidAvoir = p(
  'froid',
  'This is the adjective \'cold\' used with \'avoir\': French says you have cold rather than that you are cold, the same way it does with \'avoir faim\' (to be hungry) and \'avoir soif\' (to be thirsty), and no article comes in between.',
)
const beau = p(
  'beau',
  'This is an adjective meaning \'beautiful,\' and of the weather it means fine or nice out. A feminine thing is \'belle\' — an irregular pair, not the usual added -e.',
)
const quelTempsFaitIl = p(
  'Quel temps fait-il',
  'This is the fixed way to ask what the weather is like. \'quel\' means \'what\' or \'which,\' \'temps\' is the same noun that means \'time\' — French uses the one word for both — and the verb swaps places with its pronoun and joins it with a hyphen, \'fait-il\' rather than \'il fait,\' which is what makes it a question without \'est-ce que.\'',
)
const aussi = p(
  'aussi',
  'This is an adverb meaning \'too\' or \'also.\' It goes at the end of the sentence, where English puts \'too.\'',
)

// ─── Block 8: the -er pattern ───────────────────────────────────────────────
const erPattern =
  'Regular -er verbs all take the same six endings on the stem left when -er is dropped: -e, -es, -e, -ons, -ez, -ent. parler → je parle, tu parles, il/elle parle, nous parlons, vous parlez, ils/elles parlent. This is by far the largest group of verbs in French, so the pattern is worth more than any single verb in it.'
const parle = p(
  'parle',
  `This is the verb 'parler' (to speak, to talk), conjugated for 'je,' 'il,' 'elle' and 'on' — one spelling covers all four. ${erPattern}`,
)
const parles = p(
  'parles',
  'This is the verb \'parler\' (to speak, to talk), conjugated for \'tu.\' The -es ending is silent, so it sounds exactly like the \'je\' form \'parle.\'',
)
const parlons = p(
  'parlons',
  'This is the verb \'parler\' (to speak, to talk), conjugated for \'nous.\' The -ons ending is the one ending of a regular -er verb that is always clearly heard.',
)
const parlez = p(
  'parlez',
  'This is the verb \'parler\' (to speak, to talk), conjugated for \'vous.\' The -ez ending sounds like é.',
)
const parlent = p(
  'parlent',
  'This is the verb \'parler\' (to speak, to talk), conjugated for \'ils\' and \'elles.\' The -ent ending is written and never pronounced, so this sounds exactly like the \'je\' and \'il\' form \'parle.\'',
)
const ILS_lower = p(
  'ils',
  'This is the subject pronoun meaning \'they,\' used for a group of men or for any mixed group.',
)

const television = p(
  'télévision',
  'This is a feminine singular noun meaning \'television\': la télévision, une télévision. French keeps the article where English drops it — \'je regarde la télévision\' is I watch television.',
)
const regarderForms =
  'It is a regular -er verb: je regarde, tu regardes, il/elle regarde, nous regardons, vous regardez, ils/elles regardent.'
const regarde = p(
  'regarde',
  `This is the verb 'regarder' (to watch, to look at), conjugated for 'je,' 'il,' 'elle' and 'on.' ${regarderForms}`,
)
const regardons = p(
  'regardons',
  `This is the verb 'regarder' (to watch, to look at), conjugated for 'nous.' ${regarderForms}`,
)
const regardez = p(
  'regardez',
  `This is the verb 'regarder' (to watch, to look at), conjugated for 'vous.' ${regarderForms}`,
)
const regardent = p(
  'regardent',
  `This is the verb 'regarder' (to watch, to look at), conjugated for 'ils' and 'elles.' The -ent is silent, so it sounds the same as 'regarde.' ${regarderForms}`,
)

const musique = p(
  'musique',
  'This is a feminine singular noun meaning \'music\': la musique, de la musique.',
)
const ecouterForms =
  'It is a regular -er verb: j\'écoute, tu écoutes, il/elle écoute, nous écoutons, vous écoutez, ils/elles écoutent.'
const ecouterNote = `'écouter' means 'to listen to,' and the 'to' is already inside it — French says 'j'écoute la musique' with nothing between the verb and what is listened to. ${ecouterForms}`
const jEcoute = p(
  'J\'écoute',
  `This is two words joined: 'je' (I) and 'écoute,' the verb 'écouter' conjugated for 'je.' In front of a vowel 'je' drops its e and joins on with an apostrophe: je écoute → j'écoute. ${ecouterNote}`,
)
const ecoute = p('écoute', `This is the verb 'écouter', conjugated for 'il,' 'elle' or 'on.' ${ecouterNote}`)
const ecouterInf = p(
  'écouter',
  `This is an infinitive verb meaning 'to listen' or 'to listen to.' ${infinitiveNote}`,
)

const habiterForms =
  'It is a regular -er verb: j\'habite, tu habites, il/elle habite, nous habitons, vous habitez, ils/elles habitent.'
const jHabite = p(
  'J\'habite',
  `This is two words joined: 'je' (I) and 'habite,' the verb 'habiter' (to live, to reside) conjugated for 'je.' The h is silent, so 'je' elides in front of it exactly as it would before a vowel: je habite → j'habite. ${habiterForms}`,
)
const habites = p(
  'habites',
  `This is the verb 'habiter' (to live, to reside), conjugated for 'tu.' It is about where someone's home is, not about being alive. ${habiterForms}`,
)
const habitent = p(
  'habitent',
  `This is the verb 'habiter' (to live, to reside), conjugated for 'ils' and 'elles.' ${habiterForms}`,
)

const donnerForms =
  'It is a regular -er verb: je donne, tu donnes, il/elle donne, nous donnons, vous donnez, ils/elles donnent.'
const donne = p(
  'donne',
  `This is the verb 'donner' (to give), conjugated for 'je,' 'il,' 'elle' and 'on.' ${donnerForms}`,
)
const donnez = p('donnez', `This is the verb 'donner' (to give), conjugated for 'vous.' ${donnerForms}`)

const aimerForms =
  'It is a regular -er verb: j\'aime, tu aimes, il/elle aime, nous aimons, vous aimez, ils/elles aiment.'
const aimerNote = `'aimer' covers both 'to like' and 'to love' — of a thing it is liking, of a person it is loving, and 'aimer bien' is what French says when it wants to like a person without loving them. ${aimerForms}`
const jAime = p(
  'J\'aime',
  `This is two words joined: 'je' (I) and 'aime,' the verb 'aimer' conjugated for 'je,' with 'je' dropping its e in front of the vowel: je aime → j'aime. ${aimerNote}`,
)
const aimes = p('aimes', `This is the verb 'aimer', conjugated for 'tu.' ${aimerNote}`)
const aimons = p('aimons', `This is the verb 'aimer', conjugated for 'nous.' ${aimerNote}`)

const penserForms =
  'It is a regular -er verb: je pense, tu penses, il/elle pense, nous pensons, vous pensez, ils/elles pensent.'
const pense = p(
  'pense',
  `This is the verb 'penser' (to think), conjugated for 'je,' 'il,' 'elle' and 'on.' ${penserForms}`,
)
const penses = p('penses', `This is the verb 'penser' (to think), conjugated for 'tu.' ${penserForms}`)

const personne = p(
  'personne',
  'This is a feminine singular noun meaning \'person\': la personne, une personne. It stays feminine whoever it refers to — a man is still \'une personne.\' On its own, without an article and next to a negative, the same word means \'nobody,\' which is a different word doing a different job.',
)
const deux = p(
  'deux',
  'This is the number \'two.\' The x is silent on its own, but it links onto a following vowel as a z: \'deux amis\' comes out deu-zamis.',
)
const personnes = p(
  'personnes',
  'This is the plural of \'personne\' (person). French adds -s in the plural and the -s is silent. Where English switches to \'people,\' French just counts persons: deux personnes.',
)

// ─── Block 9: more -er verbs, adverbs, frequency ────────────────────────────
const travaillons = p(
  'travaillons',
  'This is the verb \'travailler\' (to work), conjugated for \'nous.\' Every verb whose infinitive ends in -er takes the same six endings on the stem left when -er is dropped — travailler → travaille, travailles, travaille, travaillons, travaillez, travaillent — so an infinitive and the pattern together are enough to build any of its forms.',
)
const travaille = p(
  'travaille',
  'This is the verb \'travailler\' (to work), conjugated for \'je,\' \'il,\' \'elle\' and \'on.\' It is a regular -er verb: je travaille, tu travailles, il/elle travaille, nous travaillons, vous travaillez, ils/elles travaillent.',
)

const arriverForms =
  'It is a regular -er verb: j\'arrive, tu arrives, il/elle arrive, nous arrivons, vous arrivez, ils/elles arrivent.'
const arriverNote = `'arriver' means 'to arrive,' and on its own 'j'arrive' is what French says for 'I'm on my way' or 'coming!' ${arriverForms}`
const jArrive = p(
  'J\'arrive',
  `This is two words joined: 'je' (I) and 'arrive,' the verb 'arriver' conjugated for 'je,' with 'je' dropping its e in front of the vowel. ${arriverNote}`,
)
const arrivez = p('arrivez', `This is the verb 'arriver' (to arrive), conjugated for 'vous.' ${arriverForms}`)
const arrivent = p(
  'arrivent',
  `This is the verb 'arriver' (to arrive), conjugated for 'ils' and 'elles.' The -ent is silent. ${arriverForms}`,
)

const commencerForms =
  'It is a regular -er verb apart from one spelling: je commence, tu commences, il/elle commence, nous commençons, vous commencez, ils/elles commencent.'
const commence = p(
  'commence',
  `This is the verb 'commencer' (to start, to begin), conjugated for 'je,' 'il,' 'elle' and 'on.' ${commencerForms}`,
)
const commences = p('commences', `This is the verb 'commencer' (to start), conjugated for 'tu.' ${commencerForms}`)
const commencons = p(
  'commençons',
  'This is the verb \'commencer\' (to start), conjugated for \'nous.\' The c takes a cedilla — ç — because a plain c in front of o would be said like a k: \'commencons\' would come out ko-man-kon. The cedilla keeps the s sound the rest of the verb has. It is the only form of this verb that needs it.',
)
const commencez = p('commencez', `This is the verb 'commencer' (to start), conjugated for 'vous.' ${commencerForms}`)
const commencent = p(
  'commencent',
  `This is the verb 'commencer' (to start), conjugated for 'ils' and 'elles.' ${commencerForms}`,
)

const arreterForms =
  'It is a regular -er verb: j\'arrête, tu arrêtes, il/elle arrête, nous arrêtons, vous arrêtez, ils/elles arrêtent.'
const jArrete = p(
  'J\'arrête',
  `This is two words joined: 'je' (I) and 'arrête,' the verb 'arrêter' (to stop) conjugated for 'je,' with 'je' dropping its e in front of the vowel. The circumflex on the ê is a scar where an old s used to be — the same s English kept in 'arrest.' ${arreterForms}`,
)
const arrete = p(
  'arrête',
  `This is the verb 'arrêter' (to stop), conjugated for 'je,' 'il,' 'elle' and 'on.' ${arreterForms}`,
)
const arretez = p('arrêtez', `This is the verb 'arrêter' (to stop), conjugated for 'vous.' ${arreterForms}`)

const oublierForms =
  'It is a regular -er verb: j\'oublie, tu oublies, il/elle oublie, nous oublions, vous oubliez, ils/elles oublient.'
const jOublie = p(
  'J\'oublie',
  `This is two words joined: 'je' (I) and 'oublie,' the verb 'oublier' (to forget) conjugated for 'je,' with 'je' dropping its e in front of the vowel. ${oublierForms}`,
)
const oubliez = p('oubliez', `This is the verb 'oublier' (to forget), conjugated for 'vous.' ${oublierForms}`)
const oublierInf = p('oublier', `This is an infinitive verb meaning 'to forget.' ${infinitiveNote}`)

const toujours = p(
  'toujours',
  'This is an adverb meaning \'always.\' It goes straight after the verb, where English puts it in front of one: \'je parle toujours vite\' is word for word \'I speak always fast.\'',
)
const souvent = p(
  'souvent',
  'This is an adverb meaning \'often.\' Like other short adverbs of frequency it follows the verb rather than coming before it.',
)
const beaucoup = p(
  'beaucoup',
  'This is an adverb meaning \'a lot\' or \'much.\' It follows the verb: \'j\'aime beaucoup la musique\' is I like music a lot. The final p is silent.',
)
const assez = p(
  'assez',
  'This is an adverb meaning \'enough.\' It follows the verb, where English puts it after the whole phrase: \'vous ne parlez pas assez\' is you don\'t speak enough. It also means \'fairly\' in front of an adjective.',
)
const deja = p(
  'déjà',
  'This is an adverb meaning \'already.\' Both accents lean in different directions and both matter: é is said like ay, à is said like ah.',
)

const neJamaisNote =
  'This is the French negative for \'never,\' and like the ordinary negative it comes in two pieces around the verb. \'jamais\' takes the place of \'pas\' rather than joining it: je ne parle pas becomes je ne parle jamais, and \'ne parle pas jamais\' is not French. In ordinary speech the \'ne\' is dropped and only \'jamais\' is heard.'
const neJamais = p('ne … jamais', neJamaisNote)
const nApostropheJamais = p(
  'n\' … jamais',
  `${neJamaisNote} Before a vowel 'ne' drops its e and joins the next word with an apostrophe: ne écoutent → n'écoutent.`,
)
const ca = p('ça', 'This is a pronoun meaning \'that\' or \'it.\' It stands in for a thing, an idea or a whole situation, and never changes shape.')
const elleLower = p(
  'elle',
  'This is the subject pronoun meaning \'she.\' It also means \'it\' when the thing being talked about is a feminine noun.',
)
const aimeLower = p(
  'aime',
  `This is the verb 'aimer', conjugated for 'il,' 'elle' or 'on.' ${aimerNote}`,
)
const ecoutent = p(
  'écoutent',
  `This is the verb 'écouter', conjugated for 'ils' and 'elles.' The -ent is silent. ${ecouterNote}`,
)

// ─── Block 10: stem-changing -er verbs ──────────────────────────────────────
const stemRule =
  'The stem moves in the four forms where the ending is silent — je, tu, il/elle and ils/elles — and stays exactly as the infinitive has it at nous and vous, where the ending is heard. The sound is what drives it: when nothing follows, the last vowel of the stem has to carry the word.'
const mange = p(
  'mange',
  'This is the verb \'manger\' (to eat), conjugated for \'je,\' \'il,\' \'elle\' and \'on.\' It takes the ordinary -er endings everywhere except at \'nous.\'',
)
const mangeons = p(
  'mangeons',
  'This is the verb \'manger\' (to eat), conjugated for \'nous.\' The e of the stem survives in front of the -ons, which no other form needs: a g followed by o is said like the g in \'go,\' and \'mangons\' would come out man-gon. The e keeps the soft zh sound the rest of the verb has.',
)

const appelerForms =
  'je appelle → j\'appelle, tu appelles, il/elle appelle, nous appelons, vous appelez, ils/elles appellent.'
const jAppelle = p(
  'J\'appelle',
  `This is two words joined: 'je' (I) and 'appelle,' the verb 'appeler' (to call) conjugated for 'je.' The l doubles here and stays single at nous and vous — ${appelerForms} ${stemRule}`,
)

const payerForms = 'je paie, tu paies, il/elle paie, nous payons, vous payez, ils/elles paient.'
const paie = p(
  'paie',
  `This is the verb 'payer' (to pay), conjugated for 'je,' 'il,' 'elle' and 'on.' The y of the infinitive becomes i: ${payerForms} 'payer' means to pay *for* something, and French puts no word between the verb and what is paid for — 'elle paie le café.' ${stemRule}`,
)
const payons = p(
  'payons',
  `This is the verb 'payer' (to pay), conjugated for 'nous.' The y comes back here, where the ending is heard. ${payerForms}`,
)

const essayerForms = 'j\'essaie, tu essaies, il/elle essaie, nous essayons, vous essayez, ils/elles essaient.'
const jEssaie = p(
  'J\'essaie',
  `This is two words joined: 'je' (I) and 'essaie,' the verb 'essayer' (to try) conjugated for 'je,' with 'je' dropping its e in front of the vowel. The y turns to i the same way 'payer' does: ${essayerForms} ${stemRule}`,
)
const essayez = p('essayez', `This is the verb 'essayer' (to try), conjugated for 'vous.' ${essayerForms}`)
const essayerInf = p('essayer', `This is an infinitive verb meaning 'to try.' ${infinitiveNote}`)

const prefererForms =
  'je préfère, tu préfères, il/elle préfère, nous préférons, vous préférez, ils/elles préfèrent.'
const prefere = p(
  'préfère',
  `This is the verb 'préférer' (to prefer), conjugated for 'je,' 'il,' 'elle' and 'on.' The second é flips to è: ${prefererForms} An é is a tight, closed sound; an è is open, like the e in 'bed.' ${stemRule}`,
)
const preferons = p(
  'préférons',
  `This is the verb 'préférer' (to prefer), conjugated for 'nous.' Both accents point the same way here, as they do in the infinitive. ${prefererForms}`,
)

const acheterForms = 'j\'achète, tu achètes, il/elle achète, nous achetons, vous achetez, ils/elles achètent.'
const jAchete = p(
  'J\'achète',
  `This is two words joined: 'je' (I) and 'achète,' the verb 'acheter' (to buy) conjugated for 'je.' A bare e in the stem takes a grave accent: ${acheterForms} ${stemRule}`,
)
const achete = p(
  'achète',
  `This is the verb 'acheter' (to buy), conjugated for 'je,' 'il,' 'elle' and 'on.' ${acheterForms}`,
)
const achetez = p('achetez', `This is the verb 'acheter' (to buy), conjugated for 'vous.' ${acheterForms}`)
const appelez = p('appelez', `This is the verb 'appeler' (to call), conjugated for 'vous.' One l here, as at nous. ${stemRule}`)
const appellent = p(
  'appellent',
  `This is the verb 'appeler' (to call), conjugated for 'ils' and 'elles.' The -ent is silent, so it sounds exactly like 'appelle.' ${appelerForms}`,
)
const essaient = p(
  'essaient',
  `This is the verb 'essayer' (to try), conjugated for 'ils' and 'elles.' The -ent is silent, so it sounds exactly like 'essaie.' ${essayerForms}`,
)
const achetes = p('achètes', `This is the verb 'acheter' (to buy), conjugated for 'tu.' ${acheterForms}`)
const arrive = p(
  'arrive',
  `This is the verb 'arriver' (to arrive), conjugated for 'il,' 'elle,' 'on' — and for any single thing, which is what a noun subject counts as. ${arriverForms}`,
)
const arretent = p(
  'arrêtent',
  `This is the verb 'arrêter' (to stop), conjugated for 'ils' and 'elles.' ${arreterForms}`,
)

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
    whole: '"c\'est ça" is an everyday phrase in its own right: that\'s it, that\'s right, exactly.',
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
    whole: `${secondVerb} And where English can say 'he wants to eat but doesn't have time,' French repeats the subject: il veut … mais il n'a pas ….`,
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

  // ───────────────────────────────────────────────────────────────────────────
  // Block 5 — devoir
  // ───────────────────────────────────────────────────────────────────────────
  c151: {
    summary: opens('Je dois travailler', 'I have to work'),
    parts: [JE, dois, travailler],
    whole: `Like the other verbs of obligation and ability, 'devoir' is followed by a second verb. ${secondVerb}`,
  },

  c152: {
    summary: opens('Tu dois travailler', 'You have to work'),
    parts: [TU, doisTu, travailler],
    whole:
      'Three verbs are built this way — \'vouloir,\' \'pouvoir\' and \'devoir\' all leave their \'je\' and \'tu\' forms spelled identically: je veux / tu veux, je peux / tu peux, je dois / tu dois. Nothing on the verb marks which one it is, so the pronoun carries the whole distinction.',
  },

  c153: {
    summary: opens('Il doit travailler', 'He has to work'),
    parts: [IL, doit, travailler],
  },

  c154: {
    summary: opens('Elle doit rester ici', 'She has to stay here'),
    parts: [ELLE, doit, rester, ici],
  },

  c155: {
    summary: opens('Nous devons partir', 'We have to leave'),
    parts: [NOUS, devons, partir],
  },

  c156: {
    summary: opens('Vous devez rester', 'You have to stay'),
    parts: [VOUS, devez, rester],
  },

  c157: {
    summary: opens('Ils doivent travailler', 'They have to work'),
    parts: [ILS, doivent, travailler],
  },

  c158: {
    summary: opens('On doit partir maintenant', 'We have to leave now'),
    parts: [ON, doit, partir, maintenant],
  },

  c159: {
    summary: opens('Pourquoi est-ce que tu dois partir ?', 'Why do you have to leave?'),
    parts: [POURQUOI, estCeQue, tu, doisTu, partir],
    whole:
      'The question word comes first and \'est-ce que\' follows it; after that the sentence keeps the order it would have as a plain statement.',
  },

  c160: {
    summary: opens('Je dois partir parce que je suis fatigué', 'I have to leave because I am tired'),
    parts: [JE, dois, partir, parceQue, je, suis, fatigue],
    whole:
      'Two full sentences joined by \'parce que,\' each with its own subject and verb. \'parce que\' is the answer \'pourquoi\' asks for.',
  },

  c161: {
    summary: opens('Pourquoi est-ce qu\'elles doivent rester ?', 'Why do they have to stay?'),
    parts: [
      POURQUOI,
      estCeQuLower(
        'elles',
        '\'elles\' means \'they\' for a group in which everyone is female.',
      ),
      doivent,
      rester,
    ],
  },

  c162: {
    summary: opens(
      'Elles doivent rester parce qu\'elles sont malades',
      'They have to stay because they are sick',
    ),
    parts: [ELLES, doivent, rester, parceQuLower('elles'), sont, malades],
  },

  c163: {
    summary: opens(
      'On ne peut pas manger parce qu\'on doit partir',
      'We can\'t eat because we have to leave',
    ),
    parts: [ON, nePas, peut, mangerShort, parceQuLower('on'), doit, partir],
    whole:
      'Each half has its own two verbs: a conjugated one and an infinitive behind it. The negative in the first half wraps only the conjugated verb.',
  },

  c164: {
    summary: opens('Il faut partir', 'We have to leave'),
    parts: [ilFaut, partir],
    whole:
      'Nobody is named as having to leave. English has to pick a subject — \'we have to,\' \'you have to,\' \'one must\' — but French leaves it open, and who is meant comes from the situation.',
  },

  c165: {
    summary: opens('Il faut travailler', 'You have to work'),
    parts: [ilFaut, travailler],
  },

  c166: {
    summary: opens('Est-ce qu\'il faut payer ?', 'Do we have to pay?'),
    parts: [
      estCeQuLower('il', 'The \'il\' here belongs to \'il faut\' and stands for nobody.'),
      faut,
      payer,
    ],
  },

  c167: {
    summary: opens('Il faut manger quelque chose', 'You have to eat something'),
    parts: [ilFaut, mangerShort, quelqueChose],
  },

  c168: {
    summary: opens('Il ne faut pas rester ici', 'You must not stay here'),
    parts: [ilNeFautPas, rester, ici],
    whole:
      'Negating \'il faut\' turns it into a prohibition, not a release. This sentence says that staying is forbidden — never that it is optional.',
  },

  c169: {
    summary: opens('Il faut de l\'argent', 'You need money'),
    parts: [ilFaut, deL, argent],
    whole:
      'Word for word this is \'it is necessary to have some money.\' \'il faut\' can be followed by a thing as well as by a verb, and then it means that the thing is needed.',
  },

  c170: {
    summary: opens('Je dois appeler mon ami', 'I have to call my friend'),
    parts: [JE, dois, appeler, mon, ami],
  },

  c171: {
    summary: opens('Est-ce que tu peux appeler maintenant ?', 'Can you call now?'),
    parts: [estCeQue, tu, peuxTu, appeler, maintenant],
  },

  c172: {
    summary: opens('Il faut demander', 'You have to ask'),
    parts: [ilFaut, demander],
  },

  c173: {
    summary: opens('On doit trouver une voiture', 'We have to find a car'),
    parts: [ON, doit, trouver, une, voiture],
  },

  c174: {
    summary: opens('Je ne peux pas trouver ma voiture', 'I can\'t find my car'),
    parts: [JE, nePas, peux, trouver, ma, voiture],
  },

  c175: {
    summary: opens('Il faut chercher mon ami', 'We have to look for my friend'),
    parts: [ilFaut, chercher, mon, ami],
    whole:
      'Nothing stands between \'chercher\' and what is being looked for. The English \'for\' has no French counterpart here — it is already inside the verb.',
  },

  c176: {
    summary: opens(
      'Pourquoi est-ce que tu dois chercher une voiture ?',
      'Why do you have to look for a car?',
    ),
    parts: [POURQUOI, estCeQue, tu, doisTu, chercher, une, voiture],
  },

  c177: {
    summary: opens('Je voudrais un café, s\'il vous plaît', 'I\'d like a coffee, please'),
    parts: [JE, voudrais, un, cafe, silVousPlait],
    whole:
      'This is the standard way to order or ask for something. \'un café\' is one cup of it, and the polite phrase goes at the end after a comma.',
  },

  c178: {
    summary: opens('Je dois partir tôt', 'I have to leave early'),
    parts: [JE, dois, partir, tot],
  },

  c179: {
    summary: opens('Elle doit travailler tard', 'She has to work late'),
    parts: [ELLE, doit, travailler, tard],
  },

  c180: {
    summary: opens('Il faut manger vite', 'You have to eat quickly'),
    parts: [ilFaut, mangerShort, vite],
  },

  c181: {
    summary: opens('C\'est important', 'It\'s important'),
    parts: [CEST, important],
  },

  c182: {
    summary: opens('Pourquoi est-ce que c\'est important ?', 'Why is it important?'),
    parts: [POURQUOI, estCeQue, cEst, important],
  },

  c183: {
    summary: opens('Je veux partir, mais je dois travailler', 'I want to leave, but I have to work'),
    parts: [
      JE,
      veux,
      partir,
      mais,
      p('je', 'This is the subject pronoun meaning \'I,\' said again to open the second half.'),
      dois,
      travailler,
    ],
    whole:
      'Wanting and having to are two different verbs in French, and this sentence sets one against the other. Both take a plain infinitive behind them.',
  },

  c184: {
    summary: opens(
      'On doit payer, mais on n\'a pas d\'argent',
      'We have to pay, but we don\'t have any money',
    ),
    parts: [
      ON,
      doit,
      payer,
      mais,
      p('on', 'This is the subject pronoun meaning \'we,\' said again to open the second half.'),
      nApostrophePas,
      a,
      dArgent,
    ],
  },

  c185: {
    summary: opens(
      'Il faut chercher une voiture parce qu\'on doit partir tôt',
      'We have to look for a car because we have to leave early',
    ),
    parts: [ilFaut, chercher, une, voiture, parceQuLower('on'), doit, partir, tot],
    whole:
      'Two obligations in one sentence, said two different ways: \'il faut\' names nobody, and \'on doit\' names a \'we.\'',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 6 — aller
  // ───────────────────────────────────────────────────────────────────────────

  c186: {
    summary: opens('C\'est ma maison', 'It\'s my house'),
    parts: [CEST, ma, maison],
  },

  c187: {
    summary: opens('Mon ami est à la maison', 'My friend is at home'),
    parts: [mon, ami, est, aPlace, laArticle, maison],
    whole:
      'French says where someone is with \'à\' and an article, and English drops both: \'à la maison\' is three words for the one word \'home.\'',
  },

  c188: {
    summary: opens('C\'est mon travail', 'It\'s my work'),
    parts: [CEST, mon, travail],
  },

  c189: {
    summary: opens('Il est au travail', 'He is at work'),
    parts: [IL, est, au, travail],
    whole:
      'English says \'at work\' with no \'the\'; French cannot leave the article out, so the \'the\' is sitting inside \'au.\'',
  },

  c190: {
    summary: opens('Je veux aller au travail', 'I want to go to work'),
    parts: [JE, veux, allerInf, au, travail],
  },

  c191: {
    summary: opens('Je vais au travail', 'I am going to work'),
    parts: [JE, vais, au, travail],
    whole:
      'French has one present tense where English has two: \'je vais\' is both \'I go\' and \'I am going,\' and the situation decides which one English says.',
  },

  c192: {
    summary: opens('Tu vas au travail', 'You are going to work'),
    parts: [TU, vas, au, travail],
  },

  c193: {
    summary: opens('Il va au travail', 'He is going to work'),
    parts: [IL, va, au, travail],
  },

  c194: {
    summary: opens('Elle va au travail', 'She is going to work'),
    parts: [ELLE, va, au, travail],
  },

  c195: {
    summary: opens('Nous allons au travail', 'We are going to work'),
    parts: [NOUS, allons, au, travail],
  },

  c196: {
    summary: opens('Vous allez au travail', 'You are going to work'),
    parts: [VOUS, allez, au, travail],
  },

  c197: {
    summary: opens('Ils vont au travail', 'They are going to work'),
    parts: [ILS, vont, au, travail],
  },

  c198: {
    summary: opens('Elles vont au travail', 'They are going to work'),
    parts: [ELLES, vont, au, travail],
  },

  c199: {
    summary: opens('On va au travail', 'We are going to work'),
    parts: [ON, va, au, travail],
    whole:
      '\'on\' takes the same verb form as \'il\' and \'elle\' — one person\'s worth of verb — even though it means \'we\' here.',
  },

  c200: {
    summary: opens('Est-ce que tu vas à la maison ?', 'Are you going home?'),
    parts: [estCeQue, tu, vas, aPlace, laArticle, maison],
  },

  c201: {
    summary: opens('On va au bureau', 'We are going to the office'),
    parts: [ON, va, au, bureau],
  },

  c202: {
    summary: opens('Où est le bureau ?', 'Where is the office?'),
    parts: [ouWhere, est, le, bureau],
    whole:
      'After \'où\' the verb comes before its subject — \'où est le bureau\' rather than \'où le bureau est.\' This is how the question is actually asked.',
  },

  c203: {
    summary: opens('Elle ne va pas au bureau', 'She is not going to the office'),
    parts: [ELLE, nePas, va, au, bureau],
  },

  c204: {
    summary: opens('Il faut chercher du pain au marché', 'One has to look for bread at the market'),
    parts: [ilFaut, chercher, du, pain, au, marche],
    whole:
      '\'au\' is doing \'at\' here and \'to\' in \'je vais au marché\' — the same word either way, because French does not separate being somewhere from going there.',
  },

  c205: {
    summary: opens('Nous allons au restaurant', 'We are going to the restaurant'),
    parts: [NOUS, allons, au, restaurant],
  },

  c206: {
    summary: opens('Ils ont des amis au restaurant', 'They have some friends at the restaurant'),
    parts: [ILS, ont, des, amis, au, restaurant],
  },

  c207: {
    summary: opens('Vous allez à la gare ?', 'Are you going to the station?'),
    parts: [VOUS, allez, aPlace, laArticle, gare],
    whole:
      'This is a statement asked as a question, with nothing changed but the rise of the voice at the end.',
  },

  c208: {
    summary: opens('Le bus va à la gare', 'The bus goes to the station'),
    parts: [le, bus, va, aPlace, laArticle, gare],
    whole:
      'The subject here is a thing rather than a person, and nothing about the verb changes: \'va\' is the form for any single subject, he, she or it.',
  },

  c209: {
    summary: opens(
      'Vous êtes à la gare, mais il n\'y a pas de bus',
      'You are at the station, but there is no bus',
    ),
    parts: [
      VOUS,
      etes,
      aPlace,
      laArticle,
      gare,
      mais,
      p('il n\'y a pas', ilNYAPas.note),
      deNeg,
      bus,
    ],
  },

  c210: {
    summary: opens('Mon ami va à l\'école', 'My friend is going to school'),
    parts: [mon, ami, va, aL, ecole],
  },

  c211: {
    summary: opens('Est-ce que tu vas à l\'école ou au travail ?', 'Are you going to school or to work?'),
    parts: [estCeQue, tu, vas, aL, ecole, ou, au, travail],
    whole:
      'Two destinations, two different shapes of the same preposition: \'à l\'\' in front of a vowel, \'au\' in front of a masculine noun.',
  },

  c212: {
    summary: opens('On va en ville', 'We are going into town'),
    parts: [ON, va, enVille],
  },

  c213: {
    summary: opens('Comment est-ce qu\'on va en ville ?', 'How do we go into town?'),
    parts: [
      COMMENT,
      estCeQuLower('on', '\'on\' means \'we\' here — the way French normally says it.'),
      va,
      enVille,
    ],
    whole:
      'A question word goes in front of \'est-ce que,\' and everything behind it keeps ordinary statement order.',
  },

  c214: {
    summary: opens('Je vais manger', 'I am going to eat'),
    parts: [JE, vais, mangerShort],
    whole: nearFuture,
  },

  c215: {
    summary: opens('Tu vas manger ?', 'Are you going to eat?'),
    parts: [TU, vas, mangerShort],
  },

  c216: {
    summary: opens('On va payer demain', 'We are going to pay tomorrow'),
    parts: [ON, va, payer, demain],
  },

  c217: {
    summary: opens('Elle va travailler aujourd\'hui', 'She is going to work today'),
    parts: [ELLE, va, travailler, aujourdhui],
  },

  c218: {
    summary: opens('Je ne vais pas travailler aujourd\'hui', 'I am not going to work today'),
    parts: [JE, nePas, vais, travailler, aujourdhui],
    whole:
      'The negative closes around \'vais\' alone. The infinitive stays outside it, behind \'pas\' — never \'je vais ne pas travailler.\'',
  },

  c219: {
    summary: opens('Est-ce que vous allez rester là ?', 'Are you going to stay there?'),
    parts: [estCeQue, vous, allez, rester, la],
  },

  c220: {
    summary: opens(
      'Ils vont manger et boire au restaurant',
      'They are going to eat and drink at the restaurant',
    ),
    parts: [ILS, vont, mangerShort, et, boire, au, restaurant],
    whole:
      'One conjugated verb can carry two infinitives: \'vont\' is said once, and \'manger\' and \'boire\' hang off it side by side.',
  },

  c221: {
    summary: opens('Nous allons chercher une voiture', 'We are going to look for a car'),
    parts: [NOUS, allons, chercher, une, voiture],
    whole:
      '\'chercher\' already means \'to look for,\' so nothing stands between it and its object: French says \'chercher une voiture,\' never \'chercher pour une voiture.\'',
  },

  c222: {
    summary: opens('Vous voulez aller en ville ?', 'Do you want to go into town?'),
    parts: [vous, voulez, allerInf, enVille],
  },

  c223: {
    summary: opens(
      'Nous avons besoin d\'une voiture pour aller à la gare',
      'We need a car to go to the station',
    ),
    parts: [
      NOUS,
      avons,
      besoin,
      p(
        'd\'',
        'This is the preposition \'de\' (of), the fixed last piece of \'avoir besoin de\' — it never drops away. In front of a vowel it shortens to \'d\'.\'',
      ),
      une,
      voiture,
      pour,
      allerInf,
      aPlace,
      laArticle,
      gare,
    ],
  },

  c224: {
    summary: opens('Il faut aller au travail tôt', 'One has to go to work early'),
    parts: [ilFaut, allerInf, au, travail, tot],
  },

  c225: {
    summary: opens(
      'Je suis content parce qu\'on va aller au restaurant demain',
      'I am glad because we are going to go to the restaurant tomorrow',
    ),
    parts: [
      JE,
      suis,
      p(
        'content',
        'This is an adjective meaning \'glad\' or \'pleased\' — happy about something in particular. A woman writes \'contente,\' and there the final t is heard; a group writes \'contents\' or \'contentes.\'',
      ),
      parceQuLower('on'),
      va,
      allerInf,
      au,
      restaurant,
      demain,
    ],
    whole:
      'The infinitive behind \'va\' is \'aller\' itself, which is why the verb appears twice: the first is the near future, the second is the going. French says it without blinking.',
  },

  c226: {
    summary: opens('Ça va ?', 'How are you?'),
    parts: [CA_VA],
  },

  c227: {
    summary: opens('Ça va bien', 'It\'s going well'),
    parts: [CA_VA, bien],
  },

  c228: {
    summary: opens('Ça va mal aujourd\'hui', 'It\'s going badly today'),
    parts: [CA_VA, mal, aujourdhui],
  },

  c229: {
    summary: opens('Comment allez-vous ?', 'How are you?'),
    parts: [commentAllezVous],
    whole:
      'This is the formal counterpart of \'ça va ?\' — said to someone addressed as \'vous,\' or in a situation that calls for care.',
  },

  c230: {
    summary: opens('Je vais bien, merci', 'I am well, thank you'),
    parts: [
      JE,
      p(
        'vais',
        'This is the verb \'aller\' (to go), conjugated for \'je.\' Health and how things are going take \'aller\' in French, so \'je vais bien\' — word for word \'I go well\' — is how you say you are well. \'je suis bien\' means something else entirely: comfortable, well placed.',
      ),
      bien,
      merci,
    ],
  },

  c231: {
    summary: opens('Ça va, mais je suis très fatigué', 'It\'s all right, but I am very tired'),
    parts: [CA_VA, mais, je, suis, tres, fatigue],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 7 — faire
  // ───────────────────────────────────────────────────────────────────────────
  c232: {
    summary: opens('Je vais faire quelque chose maintenant', 'I\'m going to do something now'),
    parts: [JE, vais, faireInf, quelqueChose, maintenant],
    whole: nearFuture,
  },

  c233: {
    summary: opens('Il faut faire du sport', 'One has to do sport'),
    parts: [ilFaut, faireShort, du, sport],
  },

  c234: {
    summary: opens('Nous voulons faire du sport ensemble', 'We want to do sport together'),
    parts: [NOUS, voulons, faireShort, du, sport, ensemble],
  },

  c235: {
    summary: opens('Je fais du sport', 'I do sport'),
    parts: [JE, fais, du, sport],
  },

  c236: {
    summary: opens('Tu fais du sport', 'You do sport'),
    parts: [TU, fais, du, sport],
    whole:
      'The \'je\' and \'tu\' forms of \'faire\' are the same word on the page and the same sound in the ear: je fais, tu fais. Only the pronoun in front tells them apart.',
  },

  c237: {
    summary: opens('Il fait du sport', 'He does sport'),
    parts: [IL, fait, du, sport],
  },

  c238: {
    summary: opens('Elle fait du sport', 'She does sport'),
    parts: [ELLE, fait, du, sport],
  },

  c239: {
    summary: opens('Nous faisons du sport', 'We do sport'),
    parts: [NOUS, faisons, du, sport],
  },

  c240: {
    summary: opens('Vous faites du sport', 'You do sport'),
    parts: [VOUS, faites, du, sport],
  },

  c241: {
    summary: opens('Ils font du sport', 'They do sport'),
    parts: [ILS, font, du, sport],
  },

  c242: {
    summary: opens('Elles font du sport', 'They do sport'),
    parts: [ELLES, font, du, sport],
  },

  c243: {
    summary: opens('On fait du sport', 'We do sport'),
    parts: [ON, fait, du, sport],
  },

  c244: {
    summary: opens('Je ne fais pas de sport', 'I don\'t do sport'),
    parts: [
      JE,
      nePas,
      fais,
      p(
        'de',
        'After a negative, \'du,\' \'de la\' and \'de l\'\' all flatten to plain \'de\': je fais du sport → je ne fais pas de sport.',
      ),
      sport,
    ],
  },

  c245: {
    summary: opens('Ils font du sport avec des amis', 'They do sport with friends'),
    parts: [ILS, font, du, sport, avec, des, amis],
  },

  c246: {
    summary: opens('Je vais faire la cuisine', 'I\'m going to do the cooking'),
    parts: [JE, vais, faireShort, laArticle, cuisine],
  },

  c247: {
    summary: opens('Est-ce que tu fais la cuisine ?', 'Do you do the cooking?'),
    parts: [estCeQue, tu, fais, laArticle, cuisine],
    whole:
      'English needs \'do\' twice over to ask this — once to make the question, once for the verb itself. French makes the question with \'est-ce que\' and leaves the verb alone.',
  },

  c248: {
    summary: opens('Il faut faire le ménage', 'One has to do the housework'),
    parts: [ilFaut, faireShort, le, menage],
  },

  c249: {
    summary: opens('Ils ne veulent pas faire le ménage', 'They don\'t want to do the housework'),
    parts: [ILS, nePas, veulent, faireShort, le, menage],
    whole:
      'The negative closes around the conjugated verb only — \'ne veulent pas\' — and the infinitive stays outside it, behind \'pas.\'',
  },

  c250: {
    summary: opens(
      'On fait le ménage, mais on n\'a pas le temps',
      'We\'re doing the housework, but we don\'t have time',
    ),
    parts: [ON, fait, le, menage, mais, on, nApostrophePas, a, leNeg, temps],
  },

  c251: {
    summary: opens('Nous pouvons faire le ménage demain', 'We can do the housework tomorrow'),
    parts: [NOUS, pouvons, faireShort, le, menage, demain],
  },

  c252: {
    summary: opens('Je suis occupé, je fais le ménage', 'I am busy, I\'m doing the housework'),
    parts: [JE, suis, occupe, je, fais, le, menage],
    whole:
      'French has one present tense where English has two: \'je fais\' is both \'I do\' and \'I am doing,\' and only the situation says which one English would use.',
  },

  c253: {
    summary: opens('Qu\'est-ce que tu fais ?', 'What are you doing?'),
    parts: [questCeQue, tu, fais],
  },

  c254: {
    summary: opens('Tu fais quoi ?', 'What are you doing?'),
    parts: [TU, fais, quoi],
  },

  c255: {
    summary: opens('Qu\'est-ce que c\'est ?', 'What is it?'),
    parts: [questCeQue, cEst],
    whole:
      'Word for word this is \'what is it that it is\' — French asks it with the verb twice and finds nothing odd in it. The four words never come apart, so \'qu\'est c\'est\' is not a thing anyone writes.',
  },

  c256: {
    summary: opens('Qu\'est-ce qu\'on va faire aujourd\'hui ?', 'What are we going to do today?'),
    parts: [questCeQuLower('on'), va, faireShort, aujourdhui],
  },

  c257: {
    summary: opens('Qu\'est-ce que vous faites ici ?', 'What do you do here?'),
    parts: [questCeQue, vous, faites, ici],
  },

  c258: {
    summary: opens('Qu\'est-ce qu\'ils font au bureau ?', 'What are they doing at the office?'),
    parts: [questCeQuLower('ils'), font, au, bureau],
  },

  c259: {
    summary: opens('Le café est chaud', 'The coffee is hot'),
    parts: [le, cafe, est, chaud],
  },

  c260: {
    summary: opens('Il fait chaud aujourd\'hui', 'It is hot today'),
    parts: [ilFait, chaud, aujourdhui],
  },

  c261: {
    summary: opens(
      'Il fait chaud, j\'ai soif et je veux de l\'eau',
      'It is hot, I am thirsty and I want water',
    ),
    parts: [ilFait, chaud, jApostropheAi, soif, et, je, veux, deL, eau],
  },

  c262: {
    summary: opens('Il fait froid', 'It is cold'),
    parts: [ilFait, froid],
  },

  c263: {
    summary: opens('Il fait froid, mais je vais sortir', 'It is cold, but I\'m going to go out'),
    parts: [ilFait, froid, mais, je, vais, sortir],
  },

  c264: {
    summary: opens('Est-ce qu\'il fait froid en ville ?', 'Is it cold in town?'),
    parts: [
      estCeQuLower(
        'il',
        'The \'il\' it joins onto stands for nobody — it is the empty subject weather sentences are built on.',
      ),
      faitWeather,
      froid,
      enVille,
    ],
  },

  c265: {
    summary: opens('Est-ce que vous avez froid ?', 'Are you cold?'),
    parts: [estCeQue, vous, avez, froidAvoir],
    whole:
      '\'avoir froid\' is about the person and \'il fait froid\' is about the day: \'vous avez froid\' asks whether you feel cold, where \'il fait froid\' says the weather is.',
  },

  c266: {
    summary: opens('Il fait beau', 'It is nice out'),
    parts: [ilFait, beau],
  },

  c267: {
    summary: opens(
      'Il ne fait pas beau, je vais rester à la maison',
      'It is not nice out, I\'m going to stay home',
    ),
    parts: [ilImpersonal, nePas, faitWeather, beau, je, vais, rester, aPlace, laArticle, maison],
  },

  c268: {
    summary: opens('Quel temps fait-il ?', 'What is the weather like?'),
    parts: [quelTempsFaitIl],
  },

  c269: {
    summary: opens(
      'Il fait beau aujourd\'hui, on va faire du sport',
      'It is nice out today, we\'re going to do sport',
    ),
    parts: [ilFait, beau, aujourdhui, on, va, faireShort, du, sport],
  },

  c270: {
    summary: opens('Vous faites du sport aussi ?', 'Do you do sport too?'),
    parts: [VOUS, faites, du, sport, aussi],
    whole:
      'This is a statement asked as a question, with nothing changed but the rise of the voice at the end.',
  },

  c271: {
    summary: opens('On peut faire du sport ou aller en ville', 'We can do sport or go into town'),
    parts: [ON, peut, faireShort, du, sport, ou, allerInf, enVille],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 8 — regular -er verbs
  // ───────────────────────────────────────────────────────────────────────────
  c272: {
    summary: opens('Je parle vite', 'I speak fast'),
    parts: [JE, parle, vite],
  },

  c273: {
    summary: opens('Tu parles vite', 'You speak fast'),
    parts: [TU, parles, vite],
  },

  c274: {
    summary: opens('Il parle vite', 'He speaks fast'),
    parts: [IL, parle, vite],
    whole:
      'The \'il\' form and the \'je\' form of a regular -er verb are the same word — je parle, il parle. Only the pronoun in front tells them apart.',
  },

  c275: {
    summary: opens('Elle parle vite', 'She speaks fast'),
    parts: [ELLE, parle, vite],
  },

  c276: {
    summary: opens('Nous parlons vite', 'We speak fast'),
    parts: [NOUS, parlons, vite],
  },

  c277: {
    summary: opens('Vous parlez vite', 'You speak fast'),
    parts: [VOUS, parlez, vite],
  },

  c278: {
    summary: opens('Ils parlent vite', 'They speak fast'),
    parts: [ILS, parlent, vite],
    whole:
      'Said aloud, this sentence and \'il parle vite\' are the same sound. The -ent is silent, and before a consonant both \'il\' and \'ils\' reduce to a bare \'i\' — so nothing in the audio separates one person from several. The written pronoun is the only thing that does.',
  },

  c279: {
    summary: opens('Elles parlent vite', 'They speak fast'),
    parts: [ELLES, parlent, vite],
  },

  c280: {
    summary: opens('On parle vite', 'We speak fast'),
    parts: [ON, parle, vite],
  },

  c281: {
    summary: opens('Ils ne parlent pas vite', 'They don\'t speak fast'),
    parts: [ILS, nePas, parlent, vite],
  },

  c282: {
    summary: opens('Je parle avec des amis au bureau', 'I talk with friends at the office'),
    parts: [JE, parle, avec, des, amis, au, bureau],
  },

  c283: {
    summary: opens('Pourquoi est-ce qu\'ils ne parlent pas ?', 'Why don\'t they talk?'),
    parts: [
      POURQUOI,
      estCeQuLower('ils', 'Everything after it keeps ordinary statement order.'),
      nePas,
      parlent,
    ],
  },

  c284: {
    summary: opens('On parle un peu, mais on doit travailler', 'We talk a little, but we have to work'),
    parts: [ON, parle, unPeu, mais, on, doit, travailler],
  },

  c285: {
    summary: opens('Il y a une télévision à la maison', 'There is a television at home'),
    parts: [ilYA, une, television, aPlace, laArticle, maison],
  },

  c286: {
    summary: opens('Je regarde la télévision', 'I watch television'),
    parts: [JE, regarde, laArticle, television],
    whole:
      '\'regarder\' is one word for what English splits into \'look at\' and \'watch,\' and it needs no preposition after it: the thing looked at follows the verb directly.',
  },

  c287: {
    summary: opens('Nous regardons la télévision ensemble', 'We watch television together'),
    parts: [NOUS, regardons, laArticle, television, ensemble],
  },

  c288: {
    summary: opens('Est-ce que vous regardez la télévision ?', 'Do you watch television?'),
    parts: [estCeQue, vous, regardez, laArticle, television],
  },

  c289: {
    summary: opens(
      'Ils regardent la télévision, mais ils ne parlent pas',
      'They watch television, but they don\'t talk',
    ),
    parts: [ILS, regardent, laArticle, television, mais, ILS_lower, nePas, parlent],
  },

  c290: {
    summary: opens('Elle ne regarde pas la télévision', 'She doesn\'t watch television'),
    parts: [ELLE, nePas, regarde, laArticle, television],
  },

  c291: {
    summary: opens('Il y a de la musique au restaurant', 'There is music at the restaurant'),
    parts: [ilYA, deLa, musique, au, restaurant],
  },

  c292: {
    summary: opens('J\'écoute la musique', 'I listen to music'),
    parts: [jEcoute, laArticle, musique],
  },

  c293: {
    summary: opens('On écoute la musique et on ne parle pas', 'We listen to music and we don\'t talk'),
    parts: [ON, ecoute, laArticle, musique, et, on, nePas, parle],
  },

  c294: {
    summary: opens('J\'habite en ville', 'I live in town'),
    parts: [jHabite, enVille],
  },

  c295: {
    summary: opens('Où est-ce que tu habites ?', 'Where do you live?'),
    parts: [ouWhere, estCeQue, tu, habites],
  },

  c296: {
    summary: opens('Est-ce qu\'elles habitent ensemble ?', 'Do they live together?'),
    parts: [
      estCeQuLower('elles', 'The group being asked about is entirely female.'),
      habitent,
      ensemble,
    ],
  },

  c297: {
    summary: opens('Je donne un peu d\'argent', 'I give a little money'),
    parts: [JE, donne, unPeu, dArgent],
  },

  c298: {
    summary: opens('Qu\'est-ce que vous donnez ?', 'What do you give?'),
    parts: [questCeQue, vous, donnez],
  },

  c299: {
    summary: opens('On ne donne pas d\'argent', 'We don\'t give money'),
    parts: [ON, nePas, donne, dArgent],
  },

  c300: {
    summary: opens('J\'aime la musique', 'I like music'),
    parts: [jAime, laArticle, musique],
  },

  c301: {
    summary: opens('Est-ce que tu aimes le café ?', 'Do you like coffee?'),
    parts: [estCeQue, tu, aimes, le, cafe],
  },

  c302: {
    summary: opens('Nous aimons faire du sport', 'We like to do sport'),
    parts: [NOUS, aimons, faireShort, du, sport],
  },

  c303: {
    summary: opens('Elle pense vite', 'She thinks fast'),
    parts: [ELLE, pense, vite],
  },

  c304: {
    summary: opens('Qu\'est-ce que tu penses ?', 'What do you think?'),
    parts: [questCeQue, tu, penses],
  },

  c305: {
    summary: opens('Je ne pense pas', 'I don\'t think so'),
    parts: [JE, nePas, pense],
    whole:
      'English needs a \'so\' to finish this — \'I don\'t think so\' — and French does not: \'je ne pense pas\' stands complete, with nothing standing in for the thing not thought.',
  },

  c306: {
    summary: opens('Il y a une personne ici', 'There is a person here'),
    parts: [ilYA, une, personne, ici],
  },

  c307: {
    summary: opens('Il y a deux personnes ici', 'There are two people here'),
    parts: [ilYA, deux, personnes, ici],
  },

  c308: {
    summary: opens('Est-ce que la personne parle vite ?', 'Does the person speak fast?'),
    parts: [estCeQue, laArticle, personne, parle, vite],
  },

  c309: {
    summary: opens('Est-ce que vous avez de la musique ?', 'Do you have music?'),
    parts: [estCeQue, vous, avez, deLa, musique],
  },

  c310: {
    summary: opens('Vous pouvez parler ou écouter', 'You can speak or listen'),
    parts: [VOUS, pouvez, parler, ou, ecouterInf],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 9 — more -er verbs, adverbs, frequency
  // ───────────────────────────────────────────────────────────────────────────
  c311: { summary: opens('Nous travaillons ensemble', 'We work together'), parts: [NOUS, travaillons, ensemble] },
  c312: { summary: opens('J\'arrive maintenant', 'I\'m arriving now'), parts: [jArrive, maintenant] },
  c313: { summary: opens('Est-ce que vous arrivez tôt ?', 'Do you arrive early?'), parts: [estCeQue, vous, arrivez, tot] },
  c314: { summary: opens('Ils n\'arrivent pas', 'They aren\'t arriving'), parts: [ILS, nApostrophePas, arrivent] },
  c315: { summary: opens('On commence maintenant', 'We start now'), parts: [ON, commence, maintenant] },
  c316: { summary: opens('Est-ce que tu commences le travail ?', 'Are you starting work?'), parts: [estCeQue, tu, commences, le, travail] },
  c317: { summary: opens('Nous commençons le travail', 'We start work'), parts: [NOUS, commencons, le, travail] },
  c318: { summary: opens('Ils ne commencent pas tôt', 'They don\'t start early'), parts: [ILS, nePas, commencent, tot] },
  c319: { summary: opens('J\'arrête le travail', 'I stop work'), parts: [jArrete, le, travail] },
  c320: { summary: opens('Pourquoi est-ce que vous arrêtez ?', 'Why are you stopping?'), parts: [POURQUOI, estCeQue, vous, arretez] },
  c321: {
    summary: opens('On arrête maintenant, il n\'y a pas de problème', 'We stop now, there is no problem'),
    parts: [ON, arrete, maintenant, ilNYAPas, deNeg, probleme],
  },
  c322: { summary: opens('J\'oublie le problème', 'I forget the problem'), parts: [jOublie, le, probleme] },
  c323: { summary: opens('Est-ce que vous oubliez le travail ?', 'Do you forget work?'), parts: [estCeQue, vous, oubliez, le, travail] },
  c324: {
    summary: opens('Je ne veux pas oublier mon ami', 'I don\'t want to forget my friend'),
    parts: [JE, nePas, veux, oublierInf, mon, ami],
  },
  c325: {
    summary: opens('Je parle toujours vite', 'I always speak fast'),
    parts: [JE, parle, toujours, vite],
    whole:
      'The adverb sits between the verb and what follows it, which is where French keeps this kind of word. English moves it in front of the verb instead.',
  },
  c326: { summary: opens('Il est toujours en retard', 'He is always late'), parts: [IL, est, toujours, enRetard] },
  c327: { summary: opens('On travaille toujours ensemble', 'We always work together'), parts: [ON, travaille, toujours, ensemble] },
  c328: { summary: opens('Elle écoute souvent la musique', 'She often listens to music'), parts: [ELLE, ecoute, souvent, laArticle, musique] },
  c329: {
    summary: opens('Est-ce que vous parlez souvent avec des amis ?', 'Do you often talk with friends?'),
    parts: [estCeQue, vous, parlez, souvent, avec, des, amis],
  },
  c330: { summary: opens('Nous allons souvent boire du café', 'We often go to drink coffee'), parts: [NOUS, allons, souvent, boire, du, cafe] },
  c331: { summary: opens('J\'aime beaucoup la musique', 'I like music a lot'), parts: [jAime, beaucoup, laArticle, musique] },
  c332: { summary: opens('Est-ce que tu penses beaucoup ?', 'Do you think a lot?'), parts: [estCeQue, tu, penses, beaucoup] },
  c333: {
    summary: opens('Peut-être, mais on ne parle pas beaucoup', 'Maybe, but we don\'t talk much'),
    parts: [peutEtre, mais, on, nePas, parle, beaucoup],
  },
  c334: { summary: opens('Vous ne parlez pas assez', 'You don\'t speak enough'), parts: [VOUS, nePas, parlez, assez] },
  c335: { summary: opens('Est-ce que c\'est assez ?', 'Is that enough?'), parts: [estCeQue, cEst, assez] },
  c336: { summary: opens('Elle ne donne pas assez', 'She doesn\'t give enough'), parts: [ELLE, nePas, donne, assez] },
  c337: { summary: opens('Il est déjà tard', 'It is already late'), parts: [IL, est, deja, tard] },
  c338: { summary: opens('Est-ce que vous commencez déjà ?', 'Are you already starting?'), parts: [estCeQue, vous, commencez, deja] },
  c339: { summary: opens('On est déjà en ville', 'We\'re already in town'), parts: [ON, est, deja, enVille] },
  c340: { summary: opens('Je ne parle jamais vite', 'I never speak fast'), parts: [JE, neJamais, parle, vite] },
  c341: { summary: opens('Elle ne regarde jamais la télévision', 'She never watches television'), parts: [ELLE, neJamais, regarde, laArticle, television] },
  c342: { summary: opens('Ils n\'écoutent jamais la musique', 'They never listen to music'), parts: [ILS, nApostropheJamais, ecoutent, laArticle, musique] },
  c343: {
    summary: opens('On ne donne jamais d\'argent', 'We never give money'),
    parts: [ON, neJamais, donne, dArgent],
    whole:
      'A negative flattens the article behind it whichever negative it is: \'de l\'argent\' becomes \'d\'argent\' after \'jamais\' exactly as it would after \'pas.\'',
  },
  c344: { summary: opens('Vous n\'êtes jamais en retard', 'You are never late'), parts: [VOUS, nApostropheJamais, etes, enRetard] },
  c345: { summary: opens('Tu as toujours faim', 'You are always hungry'), parts: [TU, as, toujours, faim] },
  c346: { summary: opens('Nous sommes toujours ensemble', 'We are always together'), parts: [NOUS, sommes, toujours, ensemble] },
  c347: { summary: opens('Il veut souvent parler ou écouter', 'He often wants to talk or listen'), parts: [IL, veut, souvent, parler, ou, ecouterInf] },
  c348: { summary: opens('Ils peuvent entrer maintenant', 'They can come in now'), parts: [ILS, peuvent, entrer, maintenant] },
  c349: { summary: opens('Oui, d\'accord, on commence', 'Yes, okay, we start'), parts: [OUI, dAccord, on, commence] },
  c350: {
    summary: opens('Non, elle n\'aime pas ça et elle ne regarde jamais', 'No, she doesn\'t like that and she never watches'),
    parts: [NON, elleLower, nApostrophePas, aimeLower, ca, et, elleLower, neJamais, regarde],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Block 10 — stem-changing -er verbs
  // ───────────────────────────────────────────────────────────────────────────
  c351: { summary: opens('Je mange du pain', 'I eat bread'), parts: [JE, mange, du, pain] },
  c352: {
    summary: opens('Nous mangeons du pain', 'We eat bread'),
    parts: [NOUS, mangeons, du, pain],
    whole:
      'This is the one form of \'manger\' that is not built the ordinary way, and the reason is spelling rather than grammar: French writes what it needs in order to keep the sound.',
  },
  c353: {
    summary: opens('Mon ami mange au restaurant', 'My friend eats at the restaurant'),
    parts: [mon, ami, mange, au, restaurant],
    whole:
      'A noun subject takes the same form as \'il\' or \'elle\' — one person or thing doing the verb, whether it is named or pointed at with a pronoun.',
  },
  c354: { summary: opens('J\'appelle mon ami', 'I call my friend'), parts: [jAppelle, mon, ami] },
  c355: {
    summary: opens('Est-ce que vous appelez le bureau ?', 'Are you calling the office?'),
    parts: [estCeQue, vous, appelez, le, bureau],
  },
  c356: { summary: opens('Elles appellent souvent', 'They call often'), parts: [ELLES, appellent, souvent] },
  c357: { summary: opens('Elle paie le café', 'She pays for the coffee'), parts: [ELLE, paie, le, cafe] },
  c358: { summary: opens('Nous payons ensemble', 'We pay together'), parts: [NOUS, payons, ensemble] },
  c359: {
    summary: opens('La personne ne paie jamais', 'The person never pays'),
    parts: [laArticle, personne, neJamais, paie],
  },
  c360: { summary: opens('J\'essaie la voiture', 'I try the car'), parts: [jEssaie, laArticle, voiture] },
  c361: {
    summary: opens('Est-ce que vous essayez aussi ?', 'Are you trying too?'),
    parts: [estCeQue, vous, essayez, aussi],
  },
  c362: {
    summary: opens('Ils essaient ou ils arrêtent', 'They try or they stop'),
    parts: [ILS, essaient, ou, ILS_lower, arretent],
  },
  c363: { summary: opens('On préfère le café', 'We prefer coffee'), parts: [ON, prefere, le, cafe] },
  c364: { summary: opens('Nous préférons le pain', 'We prefer bread'), parts: [NOUS, preferons, le, pain] },
  c365: {
    summary: opens('Mon ami préfère rester ici', 'My friend prefers to stay here'),
    parts: [mon, ami, prefere, rester, ici],
  },
  c366: { summary: opens('J\'achète du pain au marché', 'I buy bread at the market'), parts: [jAchete, du, pain, au, marche] },
  c367: {
    summary: opens('Vous achetez une voiture ?', 'You are buying a car?'),
    parts: [VOUS, achetez, une, voiture],
    whole:
      'This is a statement asked as a question, with nothing changed but the rise of the voice at the end.',
  },
  c368: {
    summary: opens('Est-ce que tu achètes du café ?', 'Are you buying coffee?'),
    parts: [estCeQue, tu, achetes, du, cafe],
  },
  c369: { summary: opens('Le bus arrive tôt', 'The bus arrives early'), parts: [le, bus, arrive, tot] },
  c370: { summary: opens('C\'est assez ?', 'Is that enough?'), parts: [CEST, assez] },
  c371: {
    summary: opens('Ils ont du pain, mais il n\'y a pas de café', 'They have bread, but there is no coffee'),
    parts: [ILS, ont, du, pain, mais, ilNYAPas, deNeg, cafe],
  },
  c372: {
    summary: opens('Il fait froid, mais le café est chaud', 'It is cold, but the coffee is hot'),
    parts: [ilFait, froid, mais, le, cafe, est, chaud],
  },
  c373: {
    summary: opens('Ça va, on mange avec des amis', 'It\'s fine, we eat with friends'),
    parts: [CA_VA, on, mange, avec, des, amis],
  },
  c374: {
    summary: opens('Vous devez essayer et payer', 'You have to try and pay'),
    parts: [VOUS, devez, essayerInf, et, payer],
  },
  c375: {
    summary: opens('Il fait beau, on achète du café au marché', 'It is nice out, we buy coffee at the market'),
    parts: [ilFait, beau, on, achete, du, cafe, au, marche],
  },
}

export function explanationFor(cardId: string): CardExplanation | undefined {
  return EXPLANATIONS[cardId]
}
