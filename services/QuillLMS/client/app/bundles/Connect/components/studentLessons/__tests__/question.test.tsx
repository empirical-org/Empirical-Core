import { shallow } from 'enzyme';
import * as React from 'react';
import 'whatwg-fetch';
import {
  getGradedResponsesWithCallback, getMultipleChoiceResponseOptionsWithCallback
} from '../../../actions/responses.js';
import { conceptsFeedback, sentenceCombiningQuestionWithOneAttempt } from '../../../test/studentLessonData';
import submitQuestionResponse from '../../renderForQuestions/submitResponse.js';
import PlayLessonQuestion from '../question.tsx';


// required function mocks
getGradedResponsesWithCallback = jest.fn();
getMultipleChoiceResponseOptionsWithCallback = jest.fn()
submitQuestionResponse = jest.fn();


describe('PlayLessonQuestion component', () => {
  const wrapper = shallow(
    <PlayLessonQuestion
      conceptsFeedback={conceptsFeedback}
      dispatch={() => {}}
      nextQuestion={() => {}}
      question={sentenceCombiningQuestionWithOneAttempt}
    />
  )

  it("will set state.response to be the last attempt's submission on load", () => {
    expect(wrapper.state().response).toBe(sentenceCombiningQuestionWithOneAttempt.attempts[0].response.text);
  })

})
