import * as React from 'react';
import { shallow } from 'enzyme';

import RuleAttributesSection from '../configureRules/ruleAttributesSection';
import RegexSection from '../configureRules/regexSection';
import { TextEditor } from '../../../../Shared/index'

const mockProps = {
  ruleType: 'Regex',
  plagiarismText: { text: '' },
  setPlagiarismText: jest.fn(),
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

describe('RuleAttributesSection component', () => {
  let container = shallow(<RuleAttributesSection {...mockProps} />);

  it('should render RuleAttributesSection', () => {
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
    container = shallow(<RuleAttributesSection {...mockProps} />);
    // TextEditor: Plagiarism Text, First Plagiarism Feedback, Second Plagiarism Feedback (3)
    expect(container.find(TextEditor).length).toEqual(3);
  });
});
