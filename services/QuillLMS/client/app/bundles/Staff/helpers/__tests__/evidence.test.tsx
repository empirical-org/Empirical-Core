
import { ALL, BECAUSE, BUT, SO } from '../../../../constants/evidence';
import { mockActivity } from '../../components/evidence/__mocks__/data';
import { getPromptConjunction } from '../evidence/promptHelpers';

describe('Evidence helper functions', () => {

  describe('#getPromptConjunction', () => {
    it('should return expected outputs for each prompt matching valid numerical or string prompt ID input', () => {
      expect(getPromptConjunction({ activity: mockActivity}, 7)).toEqual(BECAUSE);
      expect(getPromptConjunction({ activity: mockActivity}, '8')).toEqual(BUT);
      expect(getPromptConjunction({ activity: mockActivity}, 9)).toEqual(SO);
    });
    it('should return all if no valid prompt ID received', () => {
      expect(getPromptConjunction({ activity: mockActivity}, 17)).toEqual(ALL);
    });
  });
});
