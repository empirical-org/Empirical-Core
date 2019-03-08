import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileActivity from '../student_profile_activity';

import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip.jsx'

describe('StudentProfileActivity component', () => {

  it('should render activity name', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{name: 'Activity'}}
      />
    );
    expect(wrapper.find('p.title').text()).toBe('Activity');
  });

  it('should render due date if one exists', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{due_date: '2017-03-25 00:00:00', name: 'Activity'}}
      />
    );
    expect(wrapper.find('.due-date').text()).toBe('03-25-2017');
  });

  it('should render invalid due date if due date is invalid', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{due_date: 'doge', name: 'Activity'}}
      />
    );
    expect(wrapper.find('.due-date').text()).toBe('Invalid date');
  });

  it('should not render due date if one does not exist', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find('.row-list-end').html()).toMatch('<span></span>');
  });

  it('should render "Completed" if the activity is finished and not repeatable', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{repeatable: 'f', max_percentage: '1', name: 'Activity'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Completed');
  });

  it('should render "Replay Activity" link if activity is finished and repeatable', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{max_percentage: '1', repeatable: 't', name: 'Activity', ca_id: '1024', activity_id: '100'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Replay Activity');
    expect(wrapper.find('a').prop('href')).toBe('/activity_sessions/classroom_units/1024/activities/100');
  });

  it('should render "Resume Activity" link', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{resume_link: '1', ca_id: '1024', name: 'Activity', activity_id: '100'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Resume Activity');
    expect(wrapper.find('a').prop('href')).toBe('/activity_sessions/classroom_units/1024/activities/100');
  });

  it('should render "Start Activity" link', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{resume_link: '0', ca_id: '1024', name: 'Activity', activity_id: '100'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Start Activity');
    expect(wrapper.find('a').prop('href')).toBe('/activity_sessions/classroom_units/1024/activities/100');
  });

  it('should render "Needs Teacher" if activity is locked', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{locked: 't', name: 'Activity'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Needs Teacher');
    expect(wrapper.find('a').exists()).toBe(false);
  });

  it('should render "Join Lesson" if activity is a Lesson', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{activity_classification_id: '6', ca_id: '1024', name: 'Activity', activity_id: '100'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Join Lesson');
    expect(wrapper.find('a').prop('href')).toBe('/activity_sessions/classroom_units/1024/activities/100');
  });

  it('should render "Join Lesson" if activity is a Lesson, even if in progress', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{activity_classification_id: '6', resume_link: '1', ca_id: '1024', name: 'Activity', activity_id: '100'}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Join Lesson');
    expect(wrapper.find('a').prop('href')).toBe('/activity_sessions/classroom_units/1024/activities/100');
  });

});
