import { shallow } from 'enzyme';
import * as React from 'react';
import 'whatwg-fetch';
import { conceptsFeedback, sentenceFragmentQuestionWithOneAttempt } from '../../../test/studentLessonData.ts';

import PlaySentenceFragment from '../sentenceFragmentTemplateComponentML.tsx';

describe('PlaySentenceFragment component', () => {
  const wrapper = shallow(
    <PlaySentenceFragment
      conceptsFeedback={conceptsFeedback}
      currentKey="-KX7X8sXKemipQF_BmrU"
      dispatch={() => {}}
      markIdentify={() => {}}
      marking="diagnostic"
      nextQuestion={() => {}}
      question={sentenceFragmentQuestionWithOneAttempt}
      updateAttempts={() => {}}
    />
  )

  it("will set state.response to be the last attempt's submission on load", () => {
    expect(wrapper.state().response).toBe(sentenceFragmentQuestionWithOneAttempt.attempts[0].response.text);
  })

})
