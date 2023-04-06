import { shallow } from 'enzyme';
import React from 'react';

import ReauthorizeCleverModal from '../reauthorize_clever_modal';

describe('ReauthorizeCleverModal component', () => {
  const close = () => {}

  const wrapper = shallow(
    <ReauthorizeCleverModal
      cleverLink=''
      close={close}
    />
  );

  it('should render ReauthorizeCleverModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
