import React from 'react';
import { shallow } from 'enzyme';
import { sentenceCombiningQuestionWithOneAttempt, conceptsFeedback } from './data.ts'

import PlayLessonQuestion from '../question.tsx';

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
