import * as React from 'react';
import { shallow } from 'enzyme';

import PersonalLocker from '../personalLocker';

describe('PersonalLocker component', () => {
  const mockProps = {
    history: {},
    personalLocker: { preferences: {} }
  }

  const container = shallow(<PersonalLocker {...mockProps} />);

  it('should render PersonalLocker', () => {
    expect(container).toMatchSnapshot();
  });
});
