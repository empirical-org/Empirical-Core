import { pluralize, } from '../pluralize';

const SINGULAR = 'test'
const PLURAL = 'tests'

describe('pluralize function', () => {
  it('returns singular value if count is 1', () => {
    expect(pluralize(1, SINGULAR, PLURAL)).toBe(SINGULAR);
  });

  it('returns plural value if count is 0', () => {
    expect(pluralize(0, SINGULAR, PLURAL)).toBe(PLURAL);
  });

  it('returns plural if value is greater than 1', () => {
    expect(pluralize(2, SINGULAR, PLURAL)).toBe(PLURAL);
  });
});
