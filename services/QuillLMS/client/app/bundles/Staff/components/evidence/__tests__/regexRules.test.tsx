import { shallow } from 'enzyme';
import * as React from 'react';

import { Input } from '../../../../Shared/index';
import RegexRules from '../configureRules/regexRules';
jest.mock('string-strip-html', () => ({
  default: jest.fn()
}))

const mockRegexRules = {
  'regex-rule-0': {
    id: 1,
    regex_text: 'it contain(s)? methane gas',
    case_sensitive: false
  },
  'regex-rule-1': {
    id: 2,
    regex_text: 'another reg(ex) line',
    case_sensitive: true
  },
  'regex-rule-2': {
    id: 3,
    regex_text: 'some m?ore reg(ex',
    case_sensitive: false
  }
}
const mockProps = {
  errors: {},
  handleAddRegexInput: jest.fn(),
  handleDeleteRegexRule: jest.fn(),
  handleSetRegexRule: jest.fn(),
  handleSetRegexRuleSequence: jest.fn(),
  regexRules: mockRegexRules
};

describe('RegexRules component', () => {
  const container = shallow(<RegexRules {...mockProps} />);

  it('should render RegexRules', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render an Input for each field', () => {
    // Input: Regex Rules (3)
    // input of type checkbox (3)
    expect(container.find(Input).length).toEqual(3);
  });
  it('should render a checkbox for each regex rule that has case sensitivity', () => {
    expect(container.find('#regex-case-sensitive-0').props().checked).toEqual(false);
    expect(container.find('#regex-case-sensitive-1').props().checked).toEqual(true);
    expect(container.find('#regex-case-sensitive-2').props().checked).toEqual(false);
  });
  it('clicking each checkbox should call handleSetRegexRule', () => {
    container.find('#regex-case-sensitive-0').simulate('change', { target: { checked: true }});
    container.find('#regex-case-sensitive-1').simulate('change', { target: { checked: true }});
    container.find('#regex-case-sensitive-2').simulate('change', { target: { checked: true }});
    expect(mockProps.handleSetRegexRule).toHaveBeenCalledTimes(3);
  });
  it('clicking each delete button should call handleDeleteRegexRule', () => {
    container.find('#remove-regex-button').at(0).simulate('click');
    container.find('#remove-regex-button').at(1).simulate('click');
    container.find('#remove-regex-button').at(2).simulate('click');
    expect(mockProps.handleDeleteRegexRule).toHaveBeenCalledTimes(3);
  });
  it('clicking add regex button should call handleAddRegexInput', () => {
    container.find('#add-regex-button').simulate('click');
    expect(mockProps.handleAddRegexInput).toHaveBeenCalled();
  });
});
