import * as React from 'react';
import { shallow } from 'enzyme';

import { mockRule } from './data';

import RuleForm from '../configureRules/ruleForm';
import RuleGenericAttributes from '../configureRules/ruleGenericAttributes';
import RuleRegexAttributes from '../configureRules/ruleRegexAttributes';
import RulePrompts from '../configureRules/rulePrompts';

jest.mock('../../../helpers/comprehension/ruleHelpers', () => ({
  getInitialRuleType: jest.fn().mockImplementation(() => {
    return { value: 'rules-based-1', label: 'Sentence Structure Regex' }
   }),
  renderErrorsContainer: jest.fn().mockImplementation(() => {
    return <strong>error!</strong>
  }),
  formatInitialFeedbacks: jest.fn().mockImplementation(() => {
    return [{
      id: 7,
      description: null,
      order: 0,
      text: 'Revise your work. Delete the phrase "it contains methane" because it repeats the first part of the sentence',
      highlights_attributes: []
    }];
  })
}));

const mockProps = {
  rule: mockRule,
  activityData: {
    name: 'test',
    title: 'test',
    scored_level: '7',
    target_level: 7
  },
  activityId : '1',
  closeModal: jest.fn(),
  requestErrors: [],
  submitRule: jest.fn(),
  isUniversal: false
};

describe('RuleForm component', () => {
  let container = shallow(<RuleForm {...mockProps} />);

  it('should render RuleForm', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a RuleGenericAttributes component and other expected components', () => {
    expect(container.find(RuleGenericAttributes).length).toEqual(1);
    expect(container.find(RuleRegexAttributes).length).toEqual(1);
    expect(container.find(RulePrompts).length).toEqual(1);
  });
  it('clicking the "x" button or "close" button should call closeModal prop', () => {
    container.find('#activity-close-button').simulate('click');
    container.find('#activity-cancel-button').simulate('click');
    expect(mockProps.closeModal).toHaveBeenCalledTimes(2);
  });
  it('displays request errors if prop is present', () => {
    mockProps.requestErrors = ['feedback.text: text is too short'];
    container = shallow(<RuleForm {...mockProps} />);
    expect(container.find('strong').length).toEqual(1);
  });
});
