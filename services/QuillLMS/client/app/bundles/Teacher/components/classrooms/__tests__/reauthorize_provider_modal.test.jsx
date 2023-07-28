import { shallow } from 'enzyme';
import React from 'react';

import ReauthorizeProviderModal from '../reauthorize_provider_modal';

describe('ReauthorizeProviderModal component', () => {
  const close = () => {}

  const wrapper = shallow(
    <ReauthorizeProviderModal
      close={close}
      link=''
      provider='Google'
    />
  );

  it('should render ReauthorizeProviderModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
