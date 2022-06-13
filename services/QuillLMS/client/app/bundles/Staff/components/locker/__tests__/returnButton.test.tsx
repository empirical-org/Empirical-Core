import * as React from 'react';
import { shallow } from 'enzyme';

import ReturnButton from '../returnButton';

describe('ReturnButton component', () => {
  const mockProps = {
    history: {},
    buttonLabel: 'test label',
    backLink: '/test-back-link'
  }
  const container = shallow(<ReturnButton {...mockProps} />);

  it('should render ReturnButton', () => {
    expect(container).toMatchSnapshot();
  });
});
