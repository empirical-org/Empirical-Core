import * as React from 'react';
import { shallow } from 'enzyme';

import ScrollBox from '../scrollBox';

describe('ScrollBox component', () => {
  const mockProps = {
    activeSection: '',
    sections: [{ title: 'one', ref: <div />}, { title: 'two', ref: <div />}, { title: 'three', ref: <div />}],
    setActiveSection: jest.fn()
  }
  const component = shallow(<ScrollBox {...mockProps} />)
  it('should render ScrollBox', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render three sections', () => {
    expect(component.find('button').length).toEqual(3);
  });
});
