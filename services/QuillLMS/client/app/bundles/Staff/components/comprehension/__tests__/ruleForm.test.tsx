import * as React from 'react';
import { shallow } from 'enzyme';

import RuleForm from '../configureRules/ruleForm';
import RuleAttributesSection from '../configureRules/ruleAttributesSection';
import { Input, DropdownInput} from '../../../../Shared/index'

const mockRule = {
  id: 1,
  rule_type: 'Regex',
  name: 'remove all instances of "it contains methane"',
  universal: false,
  optimal: false,
  suborder: 0,
  concept_uid: 'a34qreadbgt6',
  prompt_ids: [1, 2],
  feedbacks: [
    {
      id: 7,
      rule_id: 1,
      text: 'Revise your work. Delete the phrase "it contains methane" because it repeats the first part of the sentence',
      description: null,
      order: 0,
      highlights: []
    }
  ],
  regex_ules: [
    { id: 1, regex_text: 'it contain(s)? methane gas', case_sensitive: false },
    { id: 2, regex_text: 'another reg(ex) line', case_sensitive: true },
    { id: 3, regex_text: 'some m?ore reg(ex', case_sensitive: false }
  ]
}
const mockProps = {
  rule: mockRule,
  activityData: {
    title: 'test',
    scored_level: '7',
    target_level: 7
  },
  activityId : '1',
  closeModal: jest.fn(),
  submitRule: jest.fn()
};

describe('RuleForm component', () => {
  const container = shallow(<RuleForm {...mockProps} />);

  it('should render RuleForm', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render an Input, TextEditor or checkbox component for each field', () => {
    // Dropdown Input: Rule Type (1), Optimal (1)
    // Input: Name (1)
    // RuleAttributesSection (1)
    expect(container.find(DropdownInput).length).toEqual(2);
    expect(container.find(Input).length).toEqual(1);
    expect(container.find(RuleAttributesSection).length).toEqual(1);
  });
  it('clicking the "x" button or "close" button should call closeModal prop', () => {
    container.find('#activity-close-button').simulate('click');
    container.find('#activity-cancel-button').simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalledTimes(2);
  });
  // TODO: fix this test
  // it('clicking submit button should submit activity', () => {
  //   container.find('#activity-submit-button').simulate('click');
  //   expect(mockProps.closeModal).toHaveBeenCalled();
  // });
});
