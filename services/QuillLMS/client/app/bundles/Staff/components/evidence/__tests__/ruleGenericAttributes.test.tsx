import { shallow } from 'enzyme';
import * as React from 'react';

import { DropdownInput, Input, TextEditor } from '../../../../Shared/index';
import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';

const mockProps = {
  isUniversal: false,
  errors: {},
  ruleConceptUID: 'test-id',
  ruleNote: 'test description',
  ruleID: 17,
  ruleName: 'generic rule 17',
  ruleOptimal: false,
  ruleType: { value: 'plagiarism', label: 'Plagiarism'},
  setRuleConceptUID: jest.fn(),
  setRuleNote: jest.fn(),
  setRuleName: jest.fn(),
  setRuleOptimal: jest.fn(),
  setRuleType: jest.fn(),
  concepts: [
    { name: 'A | Concept | Name', uid: 'blah' },
    { name: 'Another | Concept | Name', uid: 'blahblah' }
  ]
};

describe('RuleGenericAttributes component', () => {
  let container = shallow(<RuleGenericAttributes {...mockProps} />);

  it('should render RuleGenericAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components', () => {
    // TextEditor: Rule Note (1)
    // Input: Name, Concept UID (2)
    // DropdownInput: Type, Note (2)
    expect(container.find(TextEditor).length).toEqual(1);
    expect(container.find(Input).length).toEqual(1);
    expect(container.find(DropdownInput).length).toEqual(3);
  });
});
