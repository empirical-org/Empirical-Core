import * as React from 'react';
import { mount } from 'enzyme';
import Activities from '../activities';
import 'whatwg-fetch';

describe('Activities component', () => {
  const container = mount(<Activities location={{}} match={{}} />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
});
