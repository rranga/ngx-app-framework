import { mergeIdRefs, uniqueId } from './id';
import {
  optionalNumberAttribute,
  optionalStringAttribute,
  patternAttribute,
} from './transforms';
import { readValidity, sameValidity, VALID_CONTROL } from './validity';

function validityState(overrides: Partial<ValidityState>): ValidityState {
  return {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    valid: true,
    ...overrides,
  };
}

describe('form utilities', () => {
  describe('mergeIdRefs', () => {
    it('merges lists, dropping blanks and duplicates in order', () => {
      expect(mergeIdRefs('a b', null, ' b  c ', undefined, '')).toBe('a b c');
    });

    it('returns null when there are no ids', () => {
      expect(mergeIdRefs(null, '', '  ')).toBeNull();
    });
  });

  it('uniqueId generates distinct ids with the prefix', () => {
    const first = uniqueId('ngx-test');
    const second = uniqueId('ngx-test');

    expect(first).toMatch(/^ngx-test-\d+$/);
    expect(first).not.toBe(second);
  });

  describe('readValidity', () => {
    it('returns the shared valid snapshot when valid', () => {
      expect(readValidity(validityState({}))).toBe(VALID_CONTROL);
    });

    it('lists errors in priority order', () => {
      const validity = readValidity(
        validityState({ valid: false, stepMismatch: true, valueMissing: true }),
      );

      expect(validity).toEqual({
        valid: false,
        errors: ['valueMissing', 'stepMismatch'],
      });
    });

    it('compares snapshots structurally', () => {
      const a = readValidity(validityState({ valid: false, tooLong: true }));
      const b = readValidity(validityState({ valid: false, tooLong: true }));

      expect(sameValidity(a, b)).toBe(true);
      expect(sameValidity(a, VALID_CONTROL)).toBe(false);
    });
  });

  describe('transforms', () => {
    it.each([
      [undefined, undefined],
      [null, undefined],
      ['', undefined],
      ['abc', undefined],
      ['3', 3],
      [4, 4],
    ])('optionalNumberAttribute(%j) -> %j', (input, expected) => {
      expect(optionalNumberAttribute(input)).toBe(expected);
    });

    it.each([
      [undefined, undefined],
      ['', undefined],
      [5, '5'],
      ['any', 'any'],
    ])('optionalStringAttribute(%j) -> %j', (input, expected) => {
      expect(optionalStringAttribute(input)).toBe(expected);
    });

    it('patternAttribute passes strings and ignores Signal Forms RegExp arrays', () => {
      expect(patternAttribute('[0-9]+')).toBe('[0-9]+');
      expect(patternAttribute([/abc/])).toBeUndefined();
      expect(patternAttribute('')).toBeUndefined();
    });
  });
});
