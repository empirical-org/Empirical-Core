import { shallow } from 'enzyme';
import React from 'react';

import MyActivitiesTabs from '../../components/assignment_flow/my_activities_tabs.jsx';
import LessonPlannerContainer from '../LessonPlannerContainer.jsx';

describe('LessonPlannerContainer container', () => {

  it('should render MyActivitiesTabs component for teachers', () => {
    const wrapperTeachers = shallow(
      <LessonPlannerContainer location={{pathname: 'includes-teachers'}} />
    );
    const wrapperNotTeachers = shallow(
      <LessonPlannerContainer location={{pathname: 'does-not-include'}} />
    );
    expect(wrapperTeachers.find(MyActivitiesTabs).exists()).toBe(true);
    expect(wrapperNotTeachers.find(MyActivitiesTabs).exists()).toBe(false);
  });

  it('should render children', () => {
    const wrapper = shallow(
      <LessonPlannerContainer location={{pathname: ''}}>
        <h1>I am a child.</h1>
      </LessonPlannerContainer>
    );
    expect(wrapper.find('h1').text()).toBe('I am a child.');
  });

});
