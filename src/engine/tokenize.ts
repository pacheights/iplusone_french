/**
 * Normalize a stretch of French into comparable tokens for the i+1 validator.
 *
 * Handles the things that would otherwise break naive whitespace splitting:
 * - lowercasing and curly-apostrophe (’ -> ') normalization
 * - stripping surrounding punctuation
 * - elided clitics: j' -> je, c' -> ce, n' -> ne, l' -> le, qu' -> que, ...
 * - hyphenated forms (est-ce -> est, ce)
 * - atomic apostrophe words that must stay whole (aujourd'hui, quelqu'un)
 */

const ATOMIC = new Set(["aujourd'hui", "quelqu'un"])

const CLITIC: Record<string, string> = {
  "j'": 'je',
  "c'": 'ce',
  "n'": 'ne',
  "m'": 'me',
  "t'": 'te',
  "s'": 'se',
  "d'": 'de',
  "l'": 'le',
  "qu'": 'que',
  "jusqu'": 'jusque',
  "lorsqu'": 'lorsque',
  "puisqu'": 'puisque',
  "quoiqu'": 'quoique',
}

const STRIP = /^[.,!?;:«»"“”…()]+|[.,!?;:«»"“”…()]+$/g

export function tokenize(text: string): string[] {
  const norm = text.replace(/’/g, "'").toLowerCase()
  const out: string[] = []

  for (let word of norm.split(/\s+/)) {
    word = word.replace(STRIP, '')
    if (!word) continue
    if (ATOMIC.has(word)) {
      out.push(word)
      continue
    }
    for (const part of word.split('-')) {
      if (!part) continue
      if (ATOMIC.has(part)) {
        out.push(part)
        continue
      }
      if (part.includes("'")) {
        const segs = part.split("'")
        for (let k = 0; k < segs.length - 1; k++) {
          const clitic = segs[k] + "'"
          out.push(CLITIC[clitic] ?? clitic)
        }
        const last = segs[segs.length - 1]
        if (last) out.push(last)
      } else {
        out.push(part)
      }
    }
  }

  return out
}
