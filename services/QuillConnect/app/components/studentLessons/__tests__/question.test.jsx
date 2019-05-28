import React from 'react';
import { shallow } from 'enzyme';
import { sentenceCombiningQuestion, conceptsFeedback } from './data.ts'

import PlayLessonQuestion from '../question.tsx';

describe('PlayLessonQuestion component', () => {
  const wrapper = shallow(
    <PlayLessonQuestion
      question={sentenceCombiningQuestion}
      nextQuestion={() => {}}
      dispatch={() => {}}
      conceptsFeedback={conceptsFeedback}
    />
  )

  it("will set state.response to be the last attempt's submission on load", () => {
    expect(wrapper.state().response).toBe(sentenceCombiningQuestion.attempts[0].response.text);
  })

})
