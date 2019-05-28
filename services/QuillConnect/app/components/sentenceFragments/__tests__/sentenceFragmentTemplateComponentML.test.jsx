import React from 'react';
import { shallow } from 'enzyme';
import { sentenceFragmentQuestionWithOneAttempt, conceptsFeedback } from '../../studentLessons/__tests__/data.ts'

import PlaySentenceFragment from '../sentenceFragmentTemplateComponentML.tsx';

describe('PlaySentenceFragment component', () => {
  const wrapper = shallow(
    <PlaySentenceFragment
      question={sentenceFragmentQuestionWithOneAttempt}
      currentKey="-KX7X8sXKemipQF_BmrU"
      markIdentify={() => {}}
      marking="diagnostic"
      nextQuestion={() => {}}
      dispatch={() => {}}
      conceptsFeedback={conceptsFeedback}
      updateAttempts={() => {}}
    />
  )

  it("will set state.response to be the last attempt's submission on load", () => {
    expect(wrapper.state().response).toBe(sentenceFragmentQuestionWithOneAttempt.attempts[0].response.text);
  })

})
