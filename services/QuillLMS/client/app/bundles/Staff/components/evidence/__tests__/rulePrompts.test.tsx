import { shallow } from 'enzyme';
import * as React from 'react';

import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import RulePrompts from '../configureRules/rulePrompts';

const mockProps = {
  errors: {},
  rulePrompts: {
    [BECAUSE]: { id: 1, checked: true },
    [BUT]: { id: 2, checked: false },
    [SO]: { id: 3, checked: true },
  },
  setRulePrompts: jest.fn()
};

describe('RulePrompts component', () => {
  let container = shallow(<RulePrompts {...mockProps} />);

  it('should render RulePrompts', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the 3 checkboxes', () => {
    expect(container.find('input').length).toEqual(3);
  });
  it('should have box checked if checked value is true', () => {
    expect(container.find('input').at(0).props().checked).toBeTruthy();
    expect(container.find('input').at(1).props().checked).toBeFalsy();
    expect(container.find('input').at(2).props().checked).toBeTruthy();
  });
});
