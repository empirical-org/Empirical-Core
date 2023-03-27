
import { highlightGrammar, highlightSpelling } from "./stringFormatting";


describe('stringFormatting', () => {
  describe('highlightSpelling', () => {
    it('basic', () => {
      const result = highlightSpelling('lorem ipsum', 'ipsum')
      expect(result).toEqual("lorem <b>ipsum</b>")
    });

    it('should accept an array for wordsToFormat arg', () => {
      const result = highlightSpelling('lorem ipsum foo', ['ipsum', 'foo'])
      expect(result).toEqual("lorem <b>ipsum</b> <b>foo</b>")
    });

    it('should highlight all instances of a matchword', () => {
      const result = highlightSpelling(`lorem ipsum lorem`, 'lorem')
      expect(result).toEqual(`<b>lorem</b> ipsum <b>lorem</b>`)
    });

    it('should highlight all of a word when a word substring is matched', () => {
      const result = highlightSpelling("lorem shouldn't ipsum", 'should')
      expect(result).toEqual(`lorem <b>shouldn't</b> ipsum`)
    });
    it('should highlight all of a word when a word substring is matched', () => {
      const result = highlightSpelling("lorem shouldn't ipsum", 'should')
      expect(result).toEqual(`lorem <b>shouldn't</b> ipsum`)
    });
    it('should not highlight nonbreaking space character', () => {
      const result = highlightSpelling("&nbsp lorem ipsum shouldn't", "&nbsp")
      expect(result).toEqual(`&nbsp lorem ipsum shouldn't`)
    });
  });

  describe('highlightGrammar', () => {
    it('return the original string input when highlights are empty', () => {
      const result = highlightGrammar('lorem ipsum', [])
      expect(result).toEqual('lorem ipsum')
    });

    it('should bold, given 1 highlight', () => {
      const result = highlightGrammar('lorem ipsum', [{character: 6, text: "ipsum"}])
      expect(result).toEqual('lorem <b>ipsum</b>')
    });

    it('should not bold a phrase before the given character', () => {
      const result = highlightGrammar('lorem ipsum ipsum', [{character: 8, text: "ipsum"}])
      expect(result).toEqual('lorem ipsum <b>ipsum</b>')
    });

    it('should not bold a phrase twice', () => {
      const result = highlightGrammar('lorem ipsum ipsum', [{character: 1, text: "ipsum"}])
      expect(result).toEqual('lorem <b>ipsum</b> ipsum')
    });

    it('should handle multiple, offsorted highlights', () => {
      const highlights = [
        { character: 18, text: "lorem" },
        { character: 6, text: "ipsum" }
      ]
      const result = highlightGrammar('lorem ipsum ipsum lorem', highlights)
      expect(result).toEqual('lorem <b>ipsum</b> ipsum <b>lorem</b>')
    });

    // This is because the offsets are calculated from the start of the prompt + entry string,
    // not just the entry
    it('should incorporate promptLength param', () => {
      const highlights = [
        { character: 11, text: "they" },
        { character: 16, text: "is" }
      ]
      const result = highlightGrammar('they is great.', highlights, 10)
      expect(result).toEqual("<b>they</b> <b>is</b> great.")
    });

  });
});
