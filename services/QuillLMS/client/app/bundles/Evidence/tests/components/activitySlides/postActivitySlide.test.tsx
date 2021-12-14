import * as React from 'react';
import { shallow } from 'enzyme';

import { PostActivitySlide } from '../../../components/activitySlides/postActivitySlide';

describe('PostActivitySlide Component', () => {
  const mockProps = {
    responses: {
      1: [{}],
      2: [{}],
      3: [{}]
    },
    user: 'Ru Paul'
  }
  let component = shallow(<PostActivitySlide {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
