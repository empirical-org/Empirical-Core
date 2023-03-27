import { shallow } from 'enzyme';
import React from 'react';

import AboutPremium from '../about_premium';

describe('AboutPremium component', () => {

  it('should render', () => {
    expect(shallow(<AboutPremium />)).toMatchSnapshot();
  });

});
