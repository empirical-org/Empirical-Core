import * as React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import { mockRule } from '../__mocks__/data';
import RuleViewForm from '../configureRules/ruleViewForm';

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

describe('RuleViewForm component', () => {
  const component = shallow(
    <MemoryRouter>
      <RuleViewForm {...mockProps} />
    </MemoryRouter>
  );

  it('should render RuleViewForm', () => {
    expect(component).toMatchSnapshot();
  });
});
