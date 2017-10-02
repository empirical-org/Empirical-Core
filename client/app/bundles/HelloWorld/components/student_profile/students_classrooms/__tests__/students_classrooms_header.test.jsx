import React from 'react';
import { shallow, mount } from 'enzyme';

import StudentsClassroomsHeader from '../students_classrooms_header';

const twoClassrooms = [{id: 1, teacher: 'Mr. Novas', name: 'Class'},
{id: 2, teacher: 'Mr. McKendrick', name: 'Other Class'}]

const fiveClassrooms = [
  {id: 1, teacher: 'Mr. Novas', name: 'Class'},
  {id: 2, teacher: 'Mr. McKendrick', name: 'Other Class'},
  {id: 2, teacher: 'Mr. Gault', name: 'Other Other Class'},
  {id: 2, teacher: 'Mr. Thameen', name: 'Other Other Other Class'},
  {id: 2, teacher: 'Ms. Monk', name: 'Other Other Other Other Class'},
  {id: 2, teacher: 'Ms. Friedberg', name: 'Other Other Other Other Other Class'},
]

describe('StudentsClassroomsHeader component', () => {

  it('should render classroom name and teacher for every classroom on state change', () => {
    const wrapper = shallow(
      <StudentsClassroomsHeader />
    );
    expect(wrapper.find('.classroom-box').exists()).toBe(false);
    wrapper.setState({classrooms: twoClassrooms,
      defaultClassroomNumber: 5
    });
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
    wrapper.setState({classrooms: twoClassrooms});
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

  describe('dropdown', () => {
      const wrapper = shallow(
        <StudentsClassroomsHeader
          currentClassroomId={1}
        />
      );

      it('does not render if there are fewer classrooms than the defaultClassroomNumber', () => {
        wrapper.setState({classrooms: twoClassrooms,
        defaultClassroomNumber: 3});
        expect(wrapper.find('.dropdown-tab')).toHaveLength(0)
      })

      it('does not render if there are equal classrooms to the defaultClassroomNumber', () => {
        wrapper.setState({classrooms: twoClassrooms,
        defaultClassroomNumber: 2});
        expect(wrapper.find('.dropdown-tab')).toHaveLength(0)
      })

      describe ('if there are more classrooms than the defaultClassroomNumber', () => {

        it('renders if there are more classrooms than the defaultClassroomNumber', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3});
          expect(wrapper.find('.dropdown-tab')).toHaveLength(1)
        })

        it('will display the number of hidden classes', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3});
          const numberOfHiddenClasses = wrapper.state('classrooms').length - wrapper.state('defaultClassroomNumber')
          expect(wrapper.find('.dropdown-tab').text()).toEqual(`${numberOfHiddenClasses} More Classes`)
        })

        it('will toggle the dropdown on click', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3});
          wrapper.find('.dropdown-tab').simulate('click')
          expect(wrapper.state('showDropdownBoxes')).toBe(true)
        })

        it('will toggle the dropdown on click', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3, showDropdownBoxes: true});
          wrapper.find('.dropdown-tab').simulate('click')
          expect(wrapper.state('showDropdownBoxes')).toBe(false)
        })

        it('will render no dropdown items if closed', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3});
          expect(wrapper.find('.dropdown-classrooms').find('li')).toHaveLength(0)
        })

        it('will render as many dropdown items as hidden classes if open', () => {
          wrapper.setState({ classrooms: fiveClassrooms, defaultClassroomNumber: 3, showDropdownBoxes: true});
          const numberOfHiddenClasses = wrapper.state('classrooms').length - wrapper.state('defaultClassroomNumber')
          expect(wrapper.find('.dropdown-classrooms').find('li')).toHaveLength(numberOfHiddenClasses)
        })

      })
    })

});
