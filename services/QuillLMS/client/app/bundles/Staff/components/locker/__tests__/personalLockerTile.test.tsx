import { shallow } from 'enzyme';
import * as React from 'react';

import PersonalLockerTile from '../personalLockerTile';

describe('LockerTile component', () => {
  const mockProps = {
    handleDeleteLockerForSection: jest.fn(),
    handleSetLockerProperty: jest.fn(),
    locker: {},
    lockerKey: 'testLockerKey',
    sectionKey: 'testSectionKey',
  }

  const container = shallow(<PersonalLockerTile {...mockProps} />);

  it('should render LockerTile', () => {
    expect(container).toMatchSnapshot();
  });
});
