import React from 'react';
import { shallow } from 'enzyme';

import LessonPlannerContainer from '../LessonPlannerContainer.jsx';
import UnitTabs from '../../components/lesson_planner/unit_tabs.jsx'

describe('LessonPlannerContainer container', () => {

  it('should render unitTabs component for teachers', () => {
    const wrapperTeachers = shallow(
      <LessonPlannerContainer location={{pathname: 'includes-teachers'}} />
    );
    const wrapperNotTeachers = shallow(
      <LessonPlannerContainer location={{pathname: 'does-not-include'}} />
    );
    expect(wrapperTeachers.find(UnitTabs).exists()).toBe(true);
    expect(wrapperNotTeachers.find(UnitTabs).exists()).toBe(false);
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
