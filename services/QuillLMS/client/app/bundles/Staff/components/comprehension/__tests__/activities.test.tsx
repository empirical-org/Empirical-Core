import * as React from 'react';
import { shallow } from 'enzyme';
import Activities from '../activities';
import 'whatwg-fetch';

describe('Activities component', () => {
  const container = shallow(<Activities />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
});
