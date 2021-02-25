import * as React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import 'whatwg-fetch';

import Activities from '../activities';

describe('Activities component', () => {
  const container = mount(
    <MemoryRouter>
      <Activities location={{}} match={{ params: { activityId: '17'} }} />
    </MemoryRouter>
  );

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });
});
