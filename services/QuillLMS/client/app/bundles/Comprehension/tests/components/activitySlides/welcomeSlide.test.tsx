import * as React from 'react';
import { shallow } from 'enzyme';

import { WelcomeSlide } from '../../../components/activitySlides/welcomeSlide';

describe('WelcomeSlide Component', () => {
  const mockProps = {
    onHandleClick: jest.fn()
  }
  let component = shallow(<WelcomeSlide {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
