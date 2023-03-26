import { shallow } from 'enzyme';
import * as React from 'react';

import LockerIndex from '../lockerIndex';

describe('LockerIndex component', () => {
  const container = shallow(<LockerIndex personalLocker={{}} />);

  it('should render LockerIndex', () => {
    expect(container).toMatchSnapshot();
  });
});
