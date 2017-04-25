import React from 'react';
import { shallow } from 'enzyme';

import AdminAccounts from '../AdminAccounts.jsx';

describe('AdminAccounts container', () => {

  it('should render', () => {
    expect(shallow(<AdminAccounts />)).toMatchSnapshot();
  });

});
