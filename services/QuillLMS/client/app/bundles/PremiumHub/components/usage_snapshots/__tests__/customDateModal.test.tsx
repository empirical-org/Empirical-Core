import { shallow } from 'enzyme';
import * as React from 'react';

import CustomDateModal from '../customDateModal';

describe('CustomDateModal component', () => {
  const mockProps = {
    close: jest.fn(),
    setCustomDates: jest.fn(),
    passedStartDate: null,
    passedEndDate: null
  }
  const component = shallow(<CustomDateModal {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
