import React from 'react';
import { shallow } from 'enzyme';

import MyResources from '../my_resources';

import VideoMini from '../video_mini'
import TeacherResourcesMini from '../teacher_resources_mini'
import GoogleClassroomMini from '../google_classroom_mini'

describe('MyResources component', () => {

  it('should render My Resources header', () => {
    const wrapper = shallow(<MyResources />);
    expect(wrapper.find('.dashboard-header').text()).toBe('My Resources');
  });

  it('should render VideoMini, TeacherResourcesMini, and GoogleClassroomMini', () => {
    const wrapper = shallow(<MyResources />);
    expect(wrapper.find(VideoMini).exists()).toBe(true);
    expect(wrapper.find(TeacherResourcesMini).exists()).toBe(true);
    expect(wrapper.find(GoogleClassroomMini).exists()).toBe(true);
  });

});
