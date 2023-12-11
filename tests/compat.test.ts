import fs from 'fs';
import test from 'tape';

import Graphemer from '../lib';

function* iterateGraphemes(str: string): Iterable<string> {
  // @ts-expect-error -- TS version
  const segmenter = new Intl.Segmenter();
  for (const segment of segmenter.segment(str)) {
    yield segment.segment;
  }
}

/**
 * Breaks the given string into an array of grapheme clusters
 * @param str {string}
 * @returns {string[]}
 */
function splitGraphemes(str: string): string[] {
  return [...iterateGraphemes(str)];
}

const testData = fs.readFileSync('README.md', 'utf-8').split('\n');

test('compat test', (t) => {
  const splitter = new Graphemer();

  t.plan(testData.length);

  testData.forEach((input) => {
    const result = splitter.splitGraphemes(input);

    t.deepLooseEqual(result, splitGraphemes(input), input);
  });

  t.end();
});
