import * as React from 'react';
import { shallow } from 'enzyme';

import { ExplanationSlide } from '../../../components/activitySlides/explanationSlide';

describe('ExplanationSlide Component', () => {
  const mockProps = {
    slideData: {
      buttonText: 'Next',
      header: 'Test Header',
      imageData: {
        imageAlt: 'test alt text',
        imageUrl: 'test.com'
      },
      isBeta: false,
      step: 1,
      subtext: 'test subtext'
    },
    onHandleClick: jest.fn()
  }
  let component = shallow(<ExplanationSlide {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
