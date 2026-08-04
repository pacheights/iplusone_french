/**
 * `npm run reuse` — the staleness ledger, printed.
 *
 * Run this before writing a block. The top of the list is what the block's open
 * slots should be filled with (md/rules.md rule 4); the quota check underneath
 * is what `npm test` enforces.
 */
import { blocksOf, checkReuse, stalenessReport, subjectOf } from '../src/engine/reuse'

const SILENT_BLOCKS = 2

const blocks = blocksOf()
const latest = blocks.at(-1)!
console.log(
  `deck: ${blocks.reduce((n, b) => n + b.cards.length, 0)} cards, ` +
    `blocks 1–${latest.block.n} (last: ${latest.block.verb})\n`,
)

const report = stalenessReport()
const stale = report.filter((r) => r.blocksSilent >= SILENT_BLOCKS)

console.log(`── silent ${SILENT_BLOCKS}+ blocks — fill open slots with these first ──`)
console.log('   (• = on the clock: the deck owes it, the scheduler will not cover it)\n')
for (const r of stale) {
  const blocksSilent = `${r.blocksSilent} block${r.blocksSilent === 1 ? '' : 's'}`
  console.log(
    `  ${r.clocked ? '•' : ' '} ${r.surface.padEnd(16)} last c${String(r.lastSeen).padEnd(5)}` +
      ` ${blocksSilent.padEnd(9)} ${r.gloss}`,
  )
}
const clocked = stale.filter((r) => r.clocked).length
console.log(`\n  ${stale.length} of ${report.length} elements stale · ${clocked} on the clock\n`)

console.log('── who is doing the verb ──\n')
for (const { block, cards } of blocks) {
  const subjects = cards.map(subjectOf)
  const person = subjects.filter((s) => s === 'person').length
  const noun = subjects.filter((s) => s === 'noun').length
  const impersonal = subjects.length - person - noun
  const pct = Math.round(((noun + impersonal) / subjects.length) * 100)
  console.log(
    `  block ${String(block.n).padStart(2)}  ${String(pct).padStart(3)}% not a person` +
      `  (${String(noun).padStart(2)} noun, ${String(impersonal).padStart(2)} impersonal,` +
      ` ${String(person).padStart(2)} pronoun)  ${'█'.repeat(Math.round(pct / 4))}`,
  )
}
console.log()

// Reporting only — `npm test` is what fails on a violation (engine/reuse.test.ts).
const violations = checkReuse()
if (violations.length === 0) {
  console.log('── quotas: all enforced blocks pass ──')
} else {
  console.log('── quota violations ──')
  for (const v of violations) console.log(`  block ${v.block} [${v.kind}] ${v.detail}`)
}
