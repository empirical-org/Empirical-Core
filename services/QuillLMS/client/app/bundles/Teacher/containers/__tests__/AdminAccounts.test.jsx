import { shallow } from 'enzyme';
import React from 'react';

import AdminAccounts from '../AdminAccounts.jsx';

describe('AdminAccounts container', () => {

  it('should render', () => {
    expect(shallow(<AdminAccounts />)).toMatchSnapshot();
  });

});
