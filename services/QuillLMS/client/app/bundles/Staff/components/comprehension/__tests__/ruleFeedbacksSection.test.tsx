import * as React from 'react';
import { shallow } from 'enzyme';

import RuleFeedbacksSection from '../configureRules/ruleFeedbacksSection';
import RegexSection from '../configureRules/regexSection';
import { TextEditor } from '../../../../Shared/index'

const mockProps = {
  ruleType: 'Regex',
  firstPlagiarismFeedback: { text: '' },
  setFirstPlagiarismFeedback: { text: '' },
  secondPlagiarismFeedback: { text: '' },
  setSecondPlagiarismFeedback: { text: ''},
  regexFeedback: { text: ''},
  setRegexFeedback: jest.fn(),
  errors: {},
  handleAddRegexInput: jest.fn(),
  handleDeleteRegexRule: jest.fn(),
  handleSetRegexRule: jest.fn(),
  regexRules: [{id: 1, regex_text: 'test'}],
};

describe('RuleFeedbacksSection component', () => {
  let container = shallow(<RuleFeedbacksSection {...mockProps} />);

  it('should render RuleFeedbacksSection', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a TextEditor and RegexSection if ruleType is Regex', () => {
    // TextEditor: Feedback (1)
    // RegexSection (1)
    expect(container.find(TextEditor).length).toEqual(1);
    expect(container.find(RegexSection).length).toEqual(1);
  });
  it('should render a 2 TextEditor sections if ruleType is Plagiarism', () => {
    mockProps.ruleType = 'Plagiarism';
    container = shallow(<RuleFeedbacksSection {...mockProps} />);
    // TextEditor: First Plagiarism Feedback, Second Plagiarism Feedback (2)
    expect(container.find(TextEditor).length).toEqual(2);
  });
});
