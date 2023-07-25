import { shallow } from 'enzyme';
import React from 'react';

import ReauthorizeGoogleModal from '../reauthorize_google_modal';

describe('ReauthorizeGoogleModal component', () => {
  const close = () => {}

  const wrapper = shallow(
    <ReauthorizeGoogleModal
      close={close}
      googleLink=''
    />
  );

  it('should render ReauthorizeGoogleModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
