
import { AUTO_ML, PLAGIARISM, RULES_BASED_1, RULES_BASED_2, RULES_BASED_3 } from '../../../../constants/evidence';
import { mockRule } from '../../components/evidence/__mocks__/data';
import { calculatePercentageForResponses, getRefetchQueryString } from '../evidence/ruleHelpers';

describe('Evidence rule helper functions', () => {

  describe('#getRefetchQueryString', () => {
    const mockRulesHash = {
      [RULES_BASED_1]: { ...mockRule, rule_type: RULES_BASED_1 },
      [RULES_BASED_2]: { ...mockRule, rule_type: RULES_BASED_2 },
      [RULES_BASED_3]: { ...mockRule, rule_type: RULES_BASED_3 },
      [PLAGIARISM]: { ...mockRule, rule_type: PLAGIARISM },
      [AUTO_ML]: { ...mockRule, rule_type: AUTO_ML },
      'default': { ...mockRule, rule_type: 'other' }
    }
    const activityId = '17';
    it('should return the expected output for query string', () => {
      expect(getRefetchQueryString(mockRulesHash[RULES_BASED_1], activityId)).toEqual(`rules-${activityId}-${RULES_BASED_1}`);
      expect(getRefetchQueryString(mockRulesHash[RULES_BASED_2], activityId)).toEqual(`rules-${activityId}-${RULES_BASED_2}`);
      expect(getRefetchQueryString(mockRulesHash[RULES_BASED_3], activityId)).toEqual(`rules-${activityId}-${RULES_BASED_3}`);
      expect(getRefetchQueryString(mockRulesHash[PLAGIARISM], activityId)).toEqual(`rules-${activityId}-${PLAGIARISM}`);
      expect(getRefetchQueryString(mockRulesHash[AUTO_ML], activityId)).toEqual(`rules-${activityId}-${AUTO_ML}`);
      expect(getRefetchQueryString(mockRulesHash['default'], activityId)).toEqual(`rules-${activityId}`);
    });
  });
  describe('#calculatePercentageForResponses', () => {
    it('should return the expected percentage amount', () => {
      expect(calculatePercentageForResponses(3, 9)).toEqual('33.33');
      expect(calculatePercentageForResponses(3, 4)).toEqual('75.00');
    });
  });
});
