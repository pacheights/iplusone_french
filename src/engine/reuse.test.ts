import { describe, expect, it } from 'vitest'
import type { Card } from '../types'
import { CARDS } from '../data/cards'
import { ELEMENTS } from '../data/elements'
import {
  BLOCKS,
  ENFORCED_FROM,
  SUBJECTS_FROM,
  blocksOf,
  checkReuse,
  stalenessReport,
  subjectOf,
} from './reuse'

/** A rest card in the next block, not yet written; only its French matters. */
const card = (id: string, french: string): Card => ({
  id,
  segments: [{ text: french }],
  translation: [{ text: '—' }],
})

/** The real deck plus a synthetic block 11, which starts at card 376. */
const withBlock11 = (...french: string[]): Card[] => [
  ...CARDS,
  ...french.map((f, i) => card(`x${i}`, f)),
]

describe('blocksOf', () => {
  it('splits the written deck at the block boundaries', () => {
    const blocks = blocksOf()
    expect(blocks.map((b) => b.block.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(blocks.map((b) => b.cards.length)).toEqual([43, 33, 39, 35, 35, 46, 40, 39, 40, 25])
  })

  it('omits blocks with no cards written yet', () => {
    expect(blocksOf().some((b) => b.block.n === 11)).toBe(false)
    expect(BLOCKS.some((b) => b.n === 11)).toBe(true)
  })
})

/** Everything checkReuse reports except the subject mix, which has its own tests. */
const reuseOnly = (cards: Card[]) => checkReuse(cards).filter((v) => v.kind !== 'subjects')

describe('checkReuse', () => {
  it('passes the written deck — blocks 1-5 grandfathered, blocks 6-10 enforced', () => {
    expect(checkReuse()).toEqual([])
    expect(ENFORCED_FROM).toBe(6)
  })

  it('flags a block that revives nothing', () => {
    const violations = checkReuse(withBlock11('Je suis ici'))
    expect(violations.map((v) => v.kind).sort()).toEqual([
      'articles',
      'connectors',
      'plural-verbs',
      'subjects',
    ])
    expect(violations.every((v) => v.block === 11)).toBe(true)
  })

  it('passes a block that meets all three quotas', () => {
    // Subjects are a separate rule with its own test; these fixtures are about
    // which old words come back, so they are all pronouns on purpose.
    expect(
      reuseOnly(
        withBlock11(
          'Nous avons des amis et du pain',
          "Vous voulez de la viande ou de l'eau, mais il n'y a pas de viande",
        ),
      ),
    ).toEqual([])
  })

  it('counts distinct verbs, not distinct forms', () => {
    // avons and avez are both avoir, so this is one verb revived, not two.
    const detail = checkReuse(
      withBlock11("Nous avons des amis et du pain, mais vous avez soif ou vous n'avez pas de café"),
    ).find((v) => v.kind === 'plural-verbs')?.detail
    expect(detail).toContain('1 earlier verb')
    expect(detail).toContain('avoir')
  })

  it('sees a form wrapped in ne … pas', () => {
    // "n'avons" puts ne between the pronoun and the verb; the form still counts.
    const violations = reuseOnly(
      withBlock11(
        "Nous n'avons pas de pain et nous ne voulons pas des amis ou de la viande, mais du café",
      ),
    )
    expect(violations).toEqual([])
  })

  it('names which verbs a short block did revive', () => {
    const detail = checkReuse(withBlock11('Nous devons partir')).find(
      (v) => v.kind === 'plural-verbs',
    )?.detail
    expect(detail).toContain('1 earlier verb ')
    expect(detail).toContain('devoir')
  })
})

describe('who is doing the verb', () => {
  const subject = (french: string) => subjectOf(card('x', french))

  it('reads past whatever opens the sentence', () => {
    expect(subject('Est-ce que le bus est en retard ?')).toBe('noun')
    expect(subject('Pourquoi est-ce que tu parles vite ?')).toBe('person')
    expect(subject('Oui, d\'accord, on commence')).toBe('person')
  })

  it('counts an inverted question by its pronoun, not its verb', () => {
    expect(subject('Comment allez-vous ?')).toBe('person')
    expect(subject('Pouvez-vous aider ?')).toBe('person')
  })

  it('calls the empty subjects impersonal', () => {
    expect(subject('Il y a un bus')).toBe('impersonal')
    expect(subject('Il faut travailler')).toBe('impersonal')
    expect(subject('Il fait chaud')).toBe('impersonal')
    expect(subject('Quel temps fait-il ?')).toBe('impersonal')
    expect(subject('C\'est ma maison')).toBe('impersonal')
    expect(subject('Ça va bien')).toBe('impersonal')
  })

  it('does not mistake a weather il for a person, or a person for weather', () => {
    expect(subject('Il fait du sport')).toBe('person')
    expect(subject('Il ne fait pas beau')).toBe('impersonal')
  })

  it('flags a block that is all pronouns, and only from block 11', () => {
    expect(SUBJECTS_FROM).toBe(11)
    const allPronouns = Array.from({ length: 8 }, () => 'Je parle vite')
    const violation = checkReuse(withBlock11(...allPronouns)).find((v) => v.kind === 'subjects')
    expect(violation?.block).toBe(11)
    expect(violation?.detail).toContain('not a person')
    expect(violation?.detail).toContain('plain noun')
  })

  it('passes a block that carries its share of things', () => {
    const mixed = [
      'Le bus est en retard',
      'Le café est chaud',
      'Mon ami travaille ici',
      'La voiture est ici',
      'Il y a un problème',
      'Je parle vite',
      'Tu parles vite',
      'On parle vite',
    ]
    expect(checkReuse(withBlock11(...mixed)).some((v) => v.kind === 'subjects')).toBe(false)
  })
})

describe('stalenessReport', () => {
  it('puts the longest-silent elements first', () => {
    const report = stalenessReport()
    const surfaces = report.slice(0, 6).map((r) => r.surface)
    expect(surfaces).toContain('regarder')
    expect(report[0].lastSeen).toBeLessThan(report.at(-1)!.lastSeen)
  })

  it('measures silence in blocks, counting from the last written block', () => {
    const regarder = stalenessReport().find((r) => r.id === 'regarder')!
    expect(regarder.lastSeen).toBe(146)
    expect(regarder.blocksSilent).toBe(6)
  })

  it('clocks every conjugated form without needing a mark', () => {
    const report = stalenessReport()
    expect(report.find((r) => r.id === 'ils_ont')!.clocked).toBe(true)
    expect(report.find((r) => r.id === 'vous_voulez')!.clocked).toBe(true)
    // Retrieve-class words are the scheduler's, so they stay off the clock.
    expect(report.find((r) => r.id === 'content')!.clocked).toBe(false)
    expect(report.find((r) => r.id === 'boire')!.clocked).toBe(false)
  })

  it('clocks an element marked in the inventory', () => {
    // Blocks 1-5 predate the field; block 6 marks the place prepositions, and
    // the ledger flags them without a quota needing to name them.
    const marked = ELEMENTS.filter((el) => el.clock).map((el) => el.id)
    expect(marked).toContain('au')
    const clockedInReport = stalenessReport().filter((r) => r.clocked)
    // A bundled regular -er verb is glossed "(regarder — all six forms)"; it is
    // on the clock for the same reason, its persons still go quiet.
    expect(
      clockedInReport.every(
        (r) => marked.includes(r.id) || / forms?\)/.test(r.gloss),
      ),
    ).toBe(true)
  })

  it('finds a form that only ever appears wrapped in negation', () => {
    // Nothing in the inventory should report as never-seen: every element
    // appears at minimum on the card that teaches it.
    expect(stalenessReport().length).toBe(
      new Set(CARDS.filter((c) => c.element).map((c) => c.element)).size,
    )
  })
})
