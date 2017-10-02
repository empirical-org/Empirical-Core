import React from 'react';
import { shallow } from 'enzyme';

import BetaMini from '../beta_mini';

describe('BetaMini component', () => {

  it('should render', () => {
    expect(shallow(<BetaMini />)).toMatchSnapshot();
  });

});
