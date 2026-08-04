import { useEffect, useMemo, useState } from 'react'
import type { Card, Grade, ReviewChoice, ReviewDefaults } from '../types'
import { cardPhonetic, cardSpeech, cardText } from '../types'
import { buildFillBlank } from '../engine/fillBlank'
import { GRADES } from '../engine/srs'
import { CARDS } from '../data/cards'
import { ExplainPanel } from './ExplainPanel'

/** The options in the order they appear, "never" last as the way out of the deck. */
const CHOICES: ReviewChoice[] = [...GRADES, 'never']

/** What each button says. */
const CHOICE_LABEL: Record<ReviewChoice, string> = {
  again: 'Again',
  hard: 'Hard',
  good: 'Good',
  easy: 'Easy',
  never: 'Never',
}

interface FillBlankCardProps {
  card: Card
  onSpeak: (text: string) => void
  /** Whether the question stays covered until the learner flips it over. */
  listenFirst: boolean
  /** Whether to print the pronunciation line under the answered sentence. */
  showPhonetic: boolean
  /** Whether the English stands in for the audio, and so shows before the answer. */
  muteMode: boolean
  /** Called once the learner has answered and chosen when to see the card again. */
  onAnswer: (choice: ReviewChoice) => void
  /** When each grade would bring the card back, already worded for display. */
  schedule: Record<Grade, string>
  /** What a right and a wrong answer do unless the learner overrides them. */
  defaults: ReviewDefaults
  /** Called when an override should become the standing default for that outcome. */
  onSetDefault: (outcome: keyof ReviewDefaults, choice: ReviewChoice) => void
}

export function FillBlankCard({
  card,
  onSpeak,
  listenFirst,
  showPhonetic,
  muteMode,
  onAnswer,
  schedule,
  defaults,
  onSetDefault,
}: FillBlankCardProps) {
  const question = useMemo(() => buildFillBlank(card, CARDS), [card])
  const [picked, setPicked] = useState<string | null>(null)
  const [explaining, setExplaining] = useState(false)
  /** Set only if the learner overrode the interval the answer earned. */
  const [override, setOverride] = useState<ReviewChoice | null>(null)
  const [adjusting, setAdjusting] = useState(false)
  /** Set once the learner has turned this card over in listen-first mode. */
  const [flipped, setFlipped] = useState(false)

  // Reset for a new card during render rather than in an effect, so the reset
  // lands before the new card paints — an effect runs after render, which would
  // flash the previous card's answered state for one frame.
  const [shownCardId, setShownCardId] = useState(card.id)
  if (card.id !== shownCardId) {
    setShownCardId(card.id)
    setPicked(null)
    setExplaining(false)
    setOverride(null)
    setAdjusting(false)
    setFlipped(false)
  }

  /** Question covered: the learner is still listening and hasn't flipped it. */
  const gated = listenFirst && !flipped

  const speak = () => onSpeak(cardSpeech(card))

  // The sentence is spoken the moment the question loads — the audio is what
  // tells you which of the four words belongs in the gap. No gate: if the
  // browser refuses for want of a user activation, useSpeech parks the text and
  // delivers it on the next interaction, so nothing is lost and nothing is
  // asked of the learner.
  useEffect(() => {
    onSpeak(cardSpeech(card))
    // onSpeak is stable per selected voice; re-running on its identity would
    // double-play, so we key only on the card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id])

  const answered = picked !== null
  const correct = picked === question.answer
  // Answering already decides what happens to the card — the learner's own
  // default for that outcome, which starts as good/again and becomes whatever
  // they last overrode it to. Touching the interval is for the odd card the
  // default is wrong about: one they got but had to dig for, or missed but
  // actually know.
  const outcome: keyof ReviewDefaults = correct ? 'correct' : 'wrong'
  const choice: ReviewChoice = override ?? defaults[outcome]
  /** When the card comes back, or that it doesn't. */
  const when = choice === 'never' ? 'Never' : schedule[choice]

  // Replay on answering: the first hearing was the question, with a gap the
  // learner was trying to fill. This one lands against the complete sentence
  // now visible on screen, which is when the sound and the words connect.
  const choose = (choice: string) => {
    if (answered) return
    setPicked(choice)
    speak()
  }

  const choiceClass = (choice: string) => {
    if (!answered) return 'choice'
    if (choice === question.answer) return 'choice choice-correct'
    if (choice === picked) return 'choice choice-wrong'
    return 'choice choice-muted'
  }

  return (
    <div className="card">
      {/* The sentence still plays by itself when the card loads; this is for
          hearing it again, and it doubles as the way in when the browser
          refused the automatic play for want of a user gesture. */}
      <button type="button" className="play" onClick={speak} aria-label="Play sentence">
        ▶
      </button>

      {/* Covered until the learner flips it: with the French on screen the
          question is a reading exercise, and the ear never gets asked. How many
          hearings that takes is theirs to decide, so the wait ends on the button
          below rather than on the audio finishing. */}
      <p className={gated ? 'french french-covered' : 'french'}>
        {gated ? (
          <span className="listening">Listening…</span>
        ) : answered ? (
          cardText(card)
        ) : (
          <>
            {question.before}
            <span className="blank">{'_'.repeat(Math.max(4, question.answer.length))}</span>
            {question.after}
          </>
        )}
      </p>

      {/* What the voice just said, spelled for an English reader — the bridge
          between the sound and the spelling above it, which rarely look alike.
          It appears with the answer for the same reason the English does:
          before that, the sentence is a question. Switched off in settings by a
          learner who reads the French without it. */}
      {answered && showPhonetic && <p className="phonetic">{cardPhonetic(card)}</p>}

      {/* The translation marks the English counterpart of the word the gap took
          out, so bolding the highlighted segments points at the gloss of what
          was just filled in — on every card, whether or not it taught anything
          new. It reads plain only where the blanked word has no English word of
          its own (see data/cards.ts).

          It waits for the answer, because before that the sentence is the
          question. Mute mode is the exception: with no sound to go on, the
          English is the only clue to what belongs in the gap, so it moves up
          front and takes the audio's place. Not while the question is still
          covered, though — the two modes stack, and a listen-first card turns
          over with the English already there, which is the point: the ear gets
          the sentence first, then the meaning arrives with the choices. */}
      {(answered || (muteMode && !gated)) && (
        <p className="english">
          {card.translation.map((segment, i) => {
            const className = [segment.highlight && 'gloss-target', segment.implied && 'implied']
              .filter(Boolean)
              .join(' ')
            return segment.highlight ? (
              <strong key={i} className={className}>
                {segment.text}
              </strong>
            ) : (
              <span key={i} className={className || undefined}>
                {segment.text}
              </span>
            )
          })}
        </p>
      )}

      {/* Ends the wait. It stands where the choices will be, so the card doesn't
          reshuffle under the cursor when it turns over. It replays as it turns:
          the last hearing was of a sentence with nothing on screen, and this one
          lands with the gapped text in front of the learner, which is where the
          sound and the spelling meet. */}
      {gated && (
        <button
          type="button"
          className="flip"
          onClick={() => {
            setFlipped(true)
            speak()
          }}
        >
          Flip
        </button>
      )}

      {/* The words are part of the question, so they wait with it. */}
      <div className="choices">
        {!gated &&
          question.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              className={choiceClass(choice)}
              onClick={() => choose(choice)}
              disabled={answered}
            >
              {choice}
            </button>
          ))}
      </div>

      {/* Everything below waits for an answer: the panel names every word of the
          sentence, so opening it early would give the gap away.

          The interval is already decided — this only says what it is, and opens
          the four grades for the rare card where the default is wrong about the
          learner. Closed, it costs one line and no decision. */}
      {answered && (
        <>
          <div className="actions">
            <button type="button" className="explain-open" onClick={() => setExplaining(true)}>
              Explain
            </button>
            <button
              type="button"
              className={adjusting ? 'when when-open' : 'when'}
              onClick={() => setAdjusting(!adjusting)}
              aria-expanded={adjusting}
            >
              <span className="when-caret">{adjusting ? '▴' : '▾'}</span>
              Review again: {when}
            </button>
            <button type="button" className="next" onClick={() => onAnswer(choice)}>
              Next ›
            </button>
          </div>

          {adjusting && (
            <div className="schedule">
              {CHOICES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={option === choice ? 'grade grade-chosen' : 'grade'}
                  onClick={() => {
                    setOverride(option)
                    setAdjusting(false)
                    onSetDefault(outcome, option)
                  }}
                >
                  <span className="grade-label">{CHOICE_LABEL[option]}</span>
                  <span className="grade-when">
                    {option === 'never' ? 'Retired' : schedule[option]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {explaining && <ExplainPanel card={card} onClose={() => setExplaining(false)} />}
    </div>
  )
}
