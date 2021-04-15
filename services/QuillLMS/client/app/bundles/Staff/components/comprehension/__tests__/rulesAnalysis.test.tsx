import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';

import RulesAnalysis from '../rulesAnalysis/rulesAnalysis';
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

describe('RulesAnalysis component', () => {
  const container = shallow(<RulesAnalysis {...mockProps} />);

  it('should render RulesAnalysis', () => {
    expect(container).toMatchSnapshot();
  });
});
