import { shallow } from 'enzyme';
import * as React from 'react';

import { Input } from '../../../../Shared/index';
import RuleSemanticAttributes from '../configureRules/ruleSemanticAttributes';

const mockProps = {
  errors: {},
  ruleLabelName: 'semantic rule',
  ruleLabelNameDisabled: false,
  ruleLabelStatus: 'active',
  setRuleLabelName: jest.fn()
};

describe('RuleSemanticAttributes component', () => {
  const container = shallow(<RuleSemanticAttributes {...mockProps} />);

  it('should render RuleSemanticAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render an Input for label name and p tag for label status', () => {
    // Input: Rule label name
    // p tag: Rule label status
    expect(container.find(Input).length).toEqual(1);
    expect(container.find('p').at(3).props().children).toEqual(mockProps.ruleLabelStatus);
  });
});
