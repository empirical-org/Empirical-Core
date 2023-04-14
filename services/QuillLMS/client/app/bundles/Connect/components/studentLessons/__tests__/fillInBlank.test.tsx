import { shallow } from 'enzyme';
import * as React from 'react';
import stripHtml from "string-strip-html";
import 'whatwg-fetch';

import { conceptsFeedback, fillInBlankQuestionWithOneAttempt } from '../../../test/studentLessonData';
import PlayFillInBlankQuestion from '../fillInBlank';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));
const mockAnon = () => jest.fn();

describe('PlayFillInBlankQuestion component', () => {
  const wrapper = shallow(
    <PlayFillInBlankQuestion
      conceptsFeedback={conceptsFeedback}
      dispatch={mockAnon}
      nextQuestion={mockAnon}
      question={fillInBlankQuestionWithOneAttempt}
      submitResponse={mockAnon}
    />
  );
  it('#generateInputs will return array of inputs from last attempt if it exists', () => {
    const numberOfInputVals = fillInBlankQuestionWithOneAttempt.prompt.match(/___/g).length
    const generatedInputs = wrapper.instance().generateInputs(numberOfInputVals)
    expect(generatedInputs[0]).toBe([''][0]);
  });
  it('#zipInputsAndText combines text and inputs, and strips html from string output', () => {
    wrapper.setState({
      inputVals: ["want", "my", "brother's"],
      fillInBlank: ["I ", " ", " ", " <em>big, red</em> bicycle."]
    });
    wrapper.instance().zipInputsAndText();
    expect(stripHtml).toHaveBeenCalled();
  });
});
