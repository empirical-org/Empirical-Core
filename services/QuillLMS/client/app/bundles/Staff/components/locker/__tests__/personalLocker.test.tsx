import { shallow } from 'enzyme';
import * as React from 'react';

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
