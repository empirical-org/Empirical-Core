import { shallow } from 'enzyme';
import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';

import LockerApp from '../lockerApp';

describe('LockerApp component', () => {
  const container = shallow(
    <MemoryRouter>
      <LockerApp />
    </MemoryRouter>
  );
  it('should render LockerApp', () => {
    expect(container.find('withRouter(LockerApp)').length).toEqual(1);
  });
});
