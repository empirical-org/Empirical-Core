import React from 'react';
import { shallow, mount } from 'enzyme';

import StudentsClassroomsHeader from '../students_classrooms_header';

describe('StudentsClassroomsHeader component', () => {

  it('should render classroom name and teacher for every classroom on state change', () => {
    const wrapper = shallow(
      <StudentsClassroomsHeader />
    );
    expect(wrapper.find('.classroom-box').exists()).toBe(false);
    wrapper.setState({classrooms: [
      {id: 1, teacher: 'Mr. Novas', name: 'Class'},
      {id: 2, teacher: 'Mr. McKendrick', name: 'Other Class'}
    ]});
    expect(wrapper.find('.classroom-box').length).toBe(2);
    expect(wrapper.find('.classroom-box').at(0).text()).toMatch('Mr. Novas');
    expect(wrapper.find('.classroom-box').at(1).text()).toMatch('Mr. McKendrick');
    expect(wrapper.find('.classroom-box').at(0).text()).toMatch('Class');
    expect(wrapper.find('.classroom-box').at(1).text()).toMatch('Other Class');
  });

  it('should render active class for selected classroom in props', () => {
    const wrapper = shallow(
      <StudentsClassroomsHeader
        currentClassroomId={1}
      />
    );
    wrapper.setState({classrooms: [
      {id: 1, teacher: 'Mr. Novas', name: 'Class'},
      {id: 2, teacher: 'Mr. McKendrick', name: 'Other Class'}
    ]});
    expect(wrapper.find('.classroom-box').at(0).props().className).toMatch('active');
    expect(wrapper.find('.classroom-box').at(1).props().className).not.toMatch('active');
  });

  it('should handle onclick events with fetchData prop', () => {
    const mockFetchData = jest.fn();
    const wrapper = mount(
      <StudentsClassroomsHeader
        currentClassroomId={1}
        fetchData={mockFetchData}
      />
    );
    wrapper.setState({classrooms: [
      {id: 1, teacher: 'Mr. Novas', name: 'Class'}
    ]});
    wrapper.find('.classroom-box').at(0).simulate('click');
    expect(mockFetchData.mock.calls.length).toBe(1);
    expect(mockFetchData.mock.calls[0][0]).toBe(1);
  });
});
