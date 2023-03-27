import { shallow } from 'enzyme';
import * as React from 'react';

import { LandingPage } from '../landingPage';

describe('LandingPage Component', () => {
  const mockProps = {
    begin: jest.fn(),
    session: {},
    translate: jest.fn(),
    language: 'english',
    diagnosticID: '-LyFRZvbHAmooTTIIVE2'
  }
  let component = shallow(<LandingPage {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
  it('should display translated landing page text if language is not English', () => {
    mockProps.language = 'spanish';
    component = shallow(<LandingPage {...mockProps} />);
    expect(component.find('h1').at(1).props().children).toEqual('Actividad de emplazamiento de Quill')
  });
});
