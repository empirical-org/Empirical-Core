import React from 'react';
import { shallow } from 'enzyme';

import WelcomeModal from '../welcome_modal.tsx'

describe('WelcomeModal component', () => {

  const wrapper = shallow(
    <WelcomeModal
      cancel={() => {}}
    />
  );

  it('should render WelcomeModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
