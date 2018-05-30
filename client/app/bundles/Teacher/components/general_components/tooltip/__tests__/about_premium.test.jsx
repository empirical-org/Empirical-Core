import React from 'react';
import { shallow } from 'enzyme';

import AboutPremium from '../about_premium';

describe('AboutPremium component', () => {

  it('should render', () => {
    expect(shallow(<AboutPremium />)).toMatchSnapshot();
  });

});
