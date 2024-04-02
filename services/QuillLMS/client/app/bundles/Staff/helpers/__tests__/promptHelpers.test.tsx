import { mockPrompts } from '../../components/evidence/__mocks__/data';
import { trimmedPrompt } from '../evidence/promptHelpers';

describe('Evidence prompt helper functions', () => {

  describe('#trimmedPrompt', () => {
    it('should remove trailing white spaces', () => {
      const prompt = mockPrompts[0];
      prompt.text = ' This is a test prompt with spaces because ';
      expect(trimmedPrompt(prompt).text).toEqual('This is a test prompt with spaces because');
    });
  });
});
