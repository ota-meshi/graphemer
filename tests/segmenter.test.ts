import fs from 'fs';
import test from 'tape';

import { testDataFromLine } from './utils';

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

/**
 * Returns the number of grapheme clusters in the given string
 * @param str {string}
 * @returns {number}
 */
function countGraphemes(str: string): number {
  return splitGraphemes(str).length;
}

const testData = fs
  .readFileSync('tests/GraphemeBreakTest.txt', 'utf-8')
  .split('\n')
  .filter((line) => line != null && line.length > 0 && !line.startsWith('#'))
  .map((line) => line.split('#')[0])
  .map(testDataFromLine);

test('splitGraphemes with Intl.Segmenter returns properly split list from string', (t) => {
  t.plan(testData.length);

  testData.forEach(({ input, expected }) => {
    const result = splitGraphemes(input);

    t.deepLooseEqual(result, expected);
  });

  t.end();
});

test('iterateGraphemes with Intl.Segmenter returns properly split iterator from string', (t) => {
  t.plan(testData.length);

  testData.forEach(({ input, expected }) => {
    const result = iterateGraphemes(input);

    t.deepLooseEqual([...result], expected);
  });

  t.end();
});

test('countGraphemes with Intl.Segmenter returns the correct number of graphemes in string', (t) => {
  t.plan(testData.length);

  testData.forEach(({ input, expected }) => {
    const result = countGraphemes(input);

    t.equal(result, expected.length);
  });

  t.end();
});
