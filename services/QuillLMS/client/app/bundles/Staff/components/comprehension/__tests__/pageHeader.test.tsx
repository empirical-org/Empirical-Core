import * as React from 'react';
import { shallow } from 'enzyme';

import PageHeader from '../shared/pageHeader';

describe('PageHeader component', () => {
  const mockProps = {
    header: '',
    title: '',
    notes: ''
  }
  const container = shallow(<PageHeader {...mockProps} />);

  it('should render PageHeader', () => {
    expect(container).toMatchSnapshot();
  });
});
