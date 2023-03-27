import { shallow } from 'enzyme';
import React from 'react';

import WelcomeModal from '../welcome_modal.tsx';

describe('WelcomeModal component', () => {

  const wrapper = shallow(
    <WelcomeModal
      cancel={jest.fn()}
      size={{ height:  900, width: 600 }}
    />
  );

  it('should render WelcomeModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
