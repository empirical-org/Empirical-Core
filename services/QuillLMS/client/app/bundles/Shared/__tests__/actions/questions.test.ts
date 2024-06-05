import { reloadQuestionsIfNecessary } from '../../actions/questions';
import * as Grammar from '../../../Grammar/actions/questions';
import Connect from "../../../Connect/actions/questions";
import Diagnostic from "../../../Diagnostic/actions/questions";
import { PRODUCTION } from '../../../../constants/flagOptions';
import { CONNECT, DIAGNOSTIC, GRAMMAR } from '../../utils/constants';
import dispatch from '../../../Evidence/__mocks__/dispatch';

describe('#reloadQuestionsIfNecessary', () => {
  describe('the flag is not production', () => {
    it('returns null', () => {
      let newFun = reloadQuestionsIfNecessary("NOT PROD", "type");
      expect(newFun).toEqual(null);
    });
  });

  describe('the flag is production', () => {
    it('returns the loadQuestions function from connect if the activity type is CONNECT', () => {
      const loadQuestionsSpy = jest.spyOn(Connect, 'loadQuestions');
      dispatch(reloadQuestionsIfNecessary(PRODUCTION, CONNECT));
      expect(loadQuestionsSpy).toHaveBeenCalled();
    });
    it('returns the loadQuestions function from diagnostic if the activity type is DIAGNOSTIC', () => {
      const loadQuestionsSpy = jest.spyOn(Diagnostic, 'loadQuestions');
      dispatch(reloadQuestionsIfNecessary(PRODUCTION, DIAGNOSTIC));
      expect(loadQuestionsSpy).toHaveBeenCalled();
    });
    it('returns the listenToQuestions function from grammar if the activity type is GRAMMAR', () => {
      const loadQuestionsSpy = jest.spyOn(Grammar, 'startListeningToQuestions');
      dispatch(reloadQuestionsIfNecessary(PRODUCTION, GRAMMAR));
      expect(loadQuestionsSpy).toHaveBeenCalled();
    });
  });



});
