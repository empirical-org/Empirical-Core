import React from 'react';
import { shallow } from 'enzyme';

import StudentProfileActivities from '../student_profile_activities';

import StudentProfileActivity from '../student_profile_activity';

describe('StudentProfileActivities component', () => {

  describe('with at least one activity', () => {
    it('should render a <StudentProfileActivity /> component for each activity', () => {
      const wrapper = shallow(
        <StudentProfileActivities
          data={[ { id: 'foo' }, { id: 'bar' } ]}
          header={''}
        />
      );
      expect(wrapper.find(StudentProfileActivity).length).toBe(2);
      expect(wrapper.find(StudentProfileActivity).at(0).props().data.id).toBe('foo');
      expect(wrapper.find(StudentProfileActivity).at(1).props().data.id).toBe('bar');
    });

    it('should render the appropriate header', () => {
      const wrapper = shallow(
        <StudentProfileActivities
          data={[{}]}
          header={'I am header'}
        />
      );
      expect(wrapper.find('div.header').text()).toMatch('I am header');
    });

    it('should render the due date column if there is a due date', () => {
      const wrapper = shallow(
        <StudentProfileActivities
          data={[{due_date: 'I am due date'}]}
          header={''}
        />
      );
      expect(wrapper.find('.header-list-due-date').exists()).toBe(true);
      expect(wrapper.find('.header-list-due-date').text()).toBe('Due Date');
    });

    it('should not render the due date column if there is no due date', () => {
      const wrapper = shallow(
        <StudentProfileActivities
          data={[{}]}
          header={''}
        />
      );
      expect(wrapper.find('.header-list').html()).toMatch('<span></span>');
    });

    it('should render appropriate count', () => {
      const wrapper = shallow(
        <StudentProfileActivities
          data={[{}, {}]}
          header={''}
          count={7}
        />
      );
      expect(wrapper.find('.header-list-counter').text()).toBe('2 of 7');
    });
  })

  it('should render nothing if there are no activities', () => {
    const wrapper = shallow(
      <StudentProfileActivities
        data={[]}
        header={''}
      />
    );
    expect(wrapper.html()).toBe('<span></span>');
  });
});
