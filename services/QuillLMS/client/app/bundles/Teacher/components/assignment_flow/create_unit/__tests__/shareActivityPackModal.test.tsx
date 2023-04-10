import { shallow } from 'enzyme';
import * as React from 'react';

import ShareActivityPackModal from '../share_activity_pack/shareActivityPackModal';

describe('ShareActivityPackModal component', () => {
  const mockProps = {
    activityPackData: {},
    closeModal: jest.fn(),
    singleActivity: {},
    unitId: '3'
  }
  // @ts-ignore
  const wrapper = shallow(<ShareActivityPackModal {...mockProps} />)
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
