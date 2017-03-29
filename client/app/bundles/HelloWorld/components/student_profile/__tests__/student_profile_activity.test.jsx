import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileActivity from '../student_profile_activity';

import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip.jsx'

describe('StudentProfileActivity component', () => {

  it('should render <ActivityIconWithTooltip /> component with correct props', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{foo: 'bar', activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find(ActivityIconWithTooltip).exists()).toBe(true);
    expect(wrapper.find(ActivityIconWithTooltip).props().data.foo).toBe('bar');
    expect(wrapper.find(ActivityIconWithTooltip).props().context).toBe('studentProfile');
  });

  it('should render activity name', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find('p.title').text()).toBe('Activity');
  });

  it('should render due date if one exists', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{due_date: 'foo', activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find('.due-date').text()).toBe('foo');
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
        data={{activity: {repeatable: false, name: 'Activity'}}}
        finished={true}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Completed');
  });

  it('should render "Replay Activity" link if activity is finished and repeatable', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{activity: {repeatable: true, name: 'Activity'}, link: 'foo.bar'}}
        finished={true}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Replay Activity');
    expect(wrapper.find('a').prop('href')).toBe('foo.bar');
  });

  it('should render "Resume Activity" link if activity is started', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{state: 'started', link: 'foo.bar', activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Resume Activity');
    expect(wrapper.find('a').prop('href')).toBe('foo.bar');
  });

  it('should render "Start Activity" link if activity is not started', () => {
    const wrapper = shallow(
      <StudentProfileActivity
        data={{link: 'foo.bar', activity: {name: 'Activity'}}}
      />
    );
    expect(wrapper.find('.row-list-end').text()).toMatch('Start Activity');
    expect(wrapper.find('a').prop('href')).toBe('foo.bar');
  });

});
