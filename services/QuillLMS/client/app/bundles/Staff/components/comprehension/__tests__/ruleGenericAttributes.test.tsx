import * as React from 'react';
import { shallow } from 'enzyme';

import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import { DropdownInput, Input, TextEditor } from '../../../../Shared/index'

const mockProps = {
  isUniversal: false,
  errors: {},
  ruleConceptUID: 'test-id',
  ruleDescription: 'test description',
  ruleID: 17,
  ruleName: 'generic rule 17',
  ruleOptimal: false,
  ruleType: { value: 'plagiarism', label: 'Plagiarism'},
  setRuleConceptUID: jest.fn(),
  setRuleDescription: jest.fn(),
  setRuleName: jest.fn(),
  setRuleOptimal: jest.fn(),
  setRuleType: jest.fn()
};

describe('RuleGenericAttributes component', () => {
  let container = shallow(<RuleGenericAttributes {...mockProps} />);

  it('should render RuleGenericAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components', () => {
    // TextEditor: Rule Description (1)
    // Input: Name, Concept UID (2)
    // DropdownInput: Type, Description (2)
    expect(container.find(TextEditor).length).toEqual(1);
    expect(container.find(Input).length).toEqual(2);
    expect(container.find(DropdownInput).length).toEqual(2);
  });
});
