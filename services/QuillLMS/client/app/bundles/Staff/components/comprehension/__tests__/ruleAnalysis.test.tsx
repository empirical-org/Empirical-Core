import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import RuleAnalysis from '../rulesAnalysis/ruleAnalysis';
import 'whatwg-fetch';

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
  },
  history: createMemoryHistory(),
  location: createLocation('')
}

describe('RuleAnalysis component', () => {
  const container = shallow(<RuleAnalysis {...mockProps} />);

  it('should render RuleAnalysis', () => {
    expect(container).toMatchSnapshot();
  });
});
