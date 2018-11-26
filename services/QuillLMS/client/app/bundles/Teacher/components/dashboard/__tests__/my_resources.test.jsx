import React from 'react';
import { shallow } from 'enzyme';

import MyResources from '../my_resources';

import TeacherResourcesMini from '../teacher_resources_mini';
import TeacherBestPracticesMini from '../teacher_best_practices_mini';
import ChampionInvitationMini from '../champion_invitation_mini';

describe('MyResources component', () => {

  it('should render My Resources header', () => {
    const wrapper = shallow(<MyResources />);
    expect(wrapper.find('.dashboard-header').text()).toBe('My Resources');
  });

  it('should render VideoMini, TeacherResourcesMini, and GoogleClassroomMini', () => {
    const wrapper = shallow(<MyResources />);
    expect(wrapper.find(TeacherResourcesMini).exists()).toBe(true);
    expect(wrapper.find(TeacherBestPracticesMini).exists()).toBe(true);
    expect(wrapper.find(ChampionInvitationMini).exists()).toBe(true);
  });

});
