import { shallow } from 'enzyme';
import * as React from 'react';

import TurkSessionButton from '../gatherResponses/turkSessionButton';

describe('TurkSessionButton component', () => {
  const mockProps = {
    id: 17,
    value: 'maracuja',
    label: 'copy',
    clickHandler: jest.fn()
  }
  const container = shallow(<TurkSessionButton {...mockProps} />);

  it('should render TurkSessionButton', () => {
    expect(container).toMatchSnapshot();
  });
  it('should call clickHandler prop on button click', () => {
    container.find('button').simulate('click');
    expect(mockProps.clickHandler).toHaveBeenCalledWith();
  });
});
