import { shallow } from 'enzyme';
import * as React from 'react';

import { TextEditor } from '../../../../Shared/index';
import RegexRules from '../configureRules/regexRules';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';

const mockProps = {
  errors: {},
  regexFeedback: [{ text: 'test regex feedback'}],
  regexRules: [{id: 1, text: 'test1'}, {id: 1, text: 'test2'}],
  rulesToUpdate: [],
  rulesToCreate: [],
  rulesToDelete: [],
  setRulesToDelete: jest.fn(),
  setRegexRules: jest.fn(),
  setRulesToUpdate: jest.fn(),
  setRulesToCreate: jest.fn(),
  setRegexFeedback: jest.fn(),
};

describe('RuleRegexAttributes component', () => {
  let container = shallow(<RuleRegexAttributes {...mockProps} />);

  it('should render RuleRegexAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components', () => {
    // TextEditor: Regex Feedback (1)
    expect(container.find(TextEditor).length).toEqual(1);
  });
  it('should render a RegexRules component if rules exist', () => {
    expect(container.find(RegexRules).length).toEqual(1);
  });
});
