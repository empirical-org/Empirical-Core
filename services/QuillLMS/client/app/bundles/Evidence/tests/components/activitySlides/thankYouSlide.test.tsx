import { mount } from 'enzyme';
import * as React from 'react';

import ThankYouSlide from '../../../components/activitySlides/thankYouSlide';

describe('ThankYouSlide Component', () => {
  let component = mount(<ThankYouSlide />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
