import { shallow } from 'enzyme';
import * as React from 'react';

import { CreateNewAccounts } from '../createNewAccounts';

describe('CreateNewAccounts component', () => {
  const mockProps = {
    schools : [{ id: 1, name: "Test School" }]
  }
  const component = shallow(<CreateNewAccounts {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
