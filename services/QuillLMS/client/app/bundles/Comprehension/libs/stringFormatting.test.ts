import { highlightSpellingGrammar } from "./stringFormatting"


describe('stringFormatting', () => {
  describe('highlightSpellingGrammar', () => {
    it('basic', () => {
      const result = highlightSpellingGrammar('lorem ipsum', 'ipsum')
      expect(result).toEqual("lorem <b>ipsum</b>")
    });

    it('should accept an array for wordsToFormat arg', () => {
      const result = highlightSpellingGrammar('lorem ipsum foo', ['ipsum', 'foo'])
      expect(result).toEqual("lorem <b>ipsum</b> <b>foo</b>")
    });

    it('should highlight all instances of a matchword', () => {
      const result = highlightSpellingGrammar(`lorem ipsum lorem`, 'lorem')
      expect(result).toEqual(`<b>lorem</b> ipsum <b>lorem</b>`)
    });

    it('should highlight all of a word when a word substring is matched', () => {
      const result = highlightSpellingGrammar("lorem shouldn't ipsum", 'should')
      expect(result).toEqual(`lorem <b>shouldn't</b> ipsum`)
    });
  });
}); 