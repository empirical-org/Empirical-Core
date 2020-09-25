import 'whatwg-fetch'
import * as React from 'react';
import { shallow } from 'enzyme';

import { fillInBlankQuestionWithOneAttempt, conceptsFeedback } from '../../../test/studentLessonData'
import PlayFillInBlankQuestion from '../fillInBlank';

describe('PlayFillInBlankQuestion component', () => {
  const wrapper = shallow(
    <PlayFillInBlankQuestion
      conceptsFeedback={conceptsFeedback}
      dispatch={() => {}}
      nextQuestion={() => {}}
      question={fillInBlankQuestionWithOneAttempt}
      submitResponse={() => {}}
    />
  )

  it('#generateInputs will return array of inputs from last attempt if it exists', () => {
    const promptArray = fillInBlankQuestionWithOneAttempt.prompt.split('___')
    const generatedInputs = wrapper.instance().generateInputs(promptArray)
    expect(generatedInputs[0]).toBe(['the'][0]);
  })

})
