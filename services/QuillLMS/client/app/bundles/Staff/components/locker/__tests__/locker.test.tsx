import * as React from 'react';
import { shallow } from 'enzyme';

import TeamLocker from '../teamLocker';

describe('TeamLocker component', () => {
  const container = shallow(<TeamLocker />);

  it('should render TeamLocker', () => {
    expect(container).toMatchSnapshot();
  });
});
