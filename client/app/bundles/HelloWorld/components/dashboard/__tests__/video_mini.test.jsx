import React from 'react';
import { shallow } from 'enzyme';

import VideoMini from '../video_mini';

describe('VideoMini component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <VideoMini videoCode='https://www.youtube.com/embed/dQw4w9WgXcQ' />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
