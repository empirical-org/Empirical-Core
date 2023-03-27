import { shallow } from 'enzyme';
import * as React from 'react';

import TeamLocker from '../teamLocker';

describe('TeamLocker component', () => {
  const container = shallow(<TeamLocker />);

  it('should render TeamLocker', () => {
    expect(container).toMatchSnapshot();
  });
});
