import React from 'react';
import { shallow } from 'enzyme';

import ArchivedClassroomsManager from '../ArchivedClassroomsManager.jsx';

describe('ArchivedClassroomsManager container', () => {
  const wrapperTeacher = shallow(<ArchivedClassroomsManager role='teacher' />);
  const wrapperStudent = shallow(<ArchivedClassroomsManager role='student' />);
  const classrooms = {
    'active': [
      {
        id: 1,
        className: 'Example Class 1',
        teacherName: 'Mr. 1',
        classcode: 'example-one',
        createdDate: 'February 6, 2017',
        joinDate: 'April 28, 2017',
        studentCount: 7
      },
      {
        id: 2,
        className: 'Example Class 2',
        teacherName: 'Mr. 2',
        classcode: 'example-two',
        createdDate: 'February 6, 2017',
        joinDate: 'April 28, 2017',
        studentCount: 11
      },
      {
        id: 3,
        className: 'Example Class 3',
        teacherName: 'Mr. 3',
        classcode: 'example-three',
        createdDate: 'February 6, 2017',
        joinDate: 'April 28, 2017',
        studentCount: 14
      }
    ],
    'inactive': [
      {
        id: 4,
        className: 'Example Class 4',
        teacherName: 'Mr. 4',
        classcode: 'example-four',
        createdDate: 'February 6, 2017',
        joinDate: 'April 28, 2017',
        studentCount: 2
      },
      {
        id: 5,
        className: 'Example Class 5',
        teacherName: 'Mr. 5',
        classcode: 'example-five',
        createdDate: 'February 6, 2017',
        joinDate: 'April 28, 2017',
        studentCount: 24
      }
    ]
  };
  wrapperTeacher.setState({classrooms: classrooms});
  wrapperStudent.setState({classrooms: classrooms});

  //TODO: test getInitialState
  //TODO: test componentDidMount
    //TODO: test getClassrooms()
  //TODO: test classAction()

  it('should render link to add a class if role is teacher', () => {
    expect(wrapperTeacher.find('.btn').text()).toBe('Add a Class');
    expect(wrapperTeacher.find('.btn').prop('href')).toBe('/teachers/classrooms/new');
  });

  it('should render link to join a class if role is student', () => {
    expect(wrapperStudent.find('.btn').text()).toBe('Join a Class');
    expect(wrapperStudent.find('.btn').prop('href')).toBe('/students_classrooms/add_classroom');
  });

  it('should render loading if no classrooms have loaded', () => {
    wrapperTeacher.setState({classrooms: null});
    expect(wrapperTeacher.text()).toMatch('loading');
    wrapperTeacher.setState({classrooms: classrooms});
  });

  describe('active classrooms section', () => {
    it('header should render', () => {
      expect(wrapperTeacher.text()).toMatch('Active Classes');
    });

    it('should render appropriate table header for teachers', () => {
      expect(wrapperTeacher.first('thead').find('th').at(0).text()).toBe('Class Name');
      expect(wrapperTeacher.first('thead').find('th').at(1).text()).toBe('Classcode');
      expect(wrapperTeacher.first('thead').find('th').at(2).text()).toBe('Student Count');
      expect(wrapperTeacher.first('thead').find('th').at(3).text()).toBe('Date Created');
      expect(wrapperTeacher.first('thead').find('th').at(4).text()).toBe('Edit Students');
      expect(wrapperTeacher.first('thead').find('th').at(5).text()).toBe('');
    });

    it('should render appropriate table header for students', () => {
      expect(wrapperStudent.first('thead').find('th').at(0).text()).toBe('Teacher Name');
      expect(wrapperStudent.first('thead').find('th').at(1).text()).toBe('Class Name');
      expect(wrapperStudent.first('thead').find('th').at(2).text()).toBe('Date Joined');
      expect(wrapperStudent.first('thead').find('th').at(3).text()).toBe('');
    });

    it('should render appropriate table rows for teachers', () => {
      wrapperTeacher.instance().classAction = jest.fn();
      expect(wrapperTeacher.find('tr').at(1).find('td').at(0).text()).toBe('Example Class 1');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(1).text()).toBe('example-one');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(2).text()).toBe('7');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(3).text()).toBe('February 6, 2017');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(4).text()).toBe('Edit Students');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(4).find('a').props().href).toBe('/teachers/classrooms/1/students');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(5).text()).toBe('Archive');
      expect(wrapperTeacher.find('tr').at(1).find('td').at(5).find('span').props().className).toBe('archive ExampleClass1');
      wrapperTeacher.find('tr').at(1).find('td').at(5).find('span').simulate('click');
      expect(wrapperTeacher.instance().classAction.mock.calls[0][0]).toBe('Archive');
      expect(wrapperTeacher.instance().classAction.mock.calls[0][1]).toBe(1);
      expect(wrapperTeacher.find('tr').at(2).find('td').at(0).text()).toBe('Example Class 2');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(1).text()).toBe('example-two');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(2).text()).toBe('11');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(3).text()).toBe('February 6, 2017');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(4).text()).toBe('Edit Students');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(4).find('a').props().href).toBe('/teachers/classrooms/2/students');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(5).text()).toBe('Archive');
      expect(wrapperTeacher.find('tr').at(2).find('td').at(5).find('span').props().className).toBe('archive ExampleClass2');
      wrapperTeacher.find('tr').at(2).find('td').at(5).find('span').simulate('click');
      expect(wrapperTeacher.instance().classAction.mock.calls[1][0]).toBe('Archive');
      expect(wrapperTeacher.instance().classAction.mock.calls[1][1]).toBe(2);
      expect(wrapperTeacher.find('tr').at(3).find('td').at(0).text()).toBe('Example Class 3');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(1).text()).toBe('example-three');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(2).text()).toBe('14');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(3).text()).toBe('February 6, 2017');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(4).text()).toBe('Edit Students');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(4).find('a').props().href).toBe('/teachers/classrooms/3/students');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(5).text()).toBe('Archive');
      expect(wrapperTeacher.find('tr').at(3).find('td').at(5).find('span').props().className).toBe('archive ExampleClass3');
      wrapperTeacher.find('tr').at(3).find('td').at(5).find('span').simulate('click');
      expect(wrapperTeacher.instance().classAction.mock.calls[2][0]).toBe('Archive');
      expect(wrapperTeacher.instance().classAction.mock.calls[2][1]).toBe(3);
    });

    it('should render appropriate table rows for students', () => {
      wrapperStudent.instance().classAction = jest.fn();
      expect(wrapperStudent.find('tr').at(1).find('td').at(0).text()).toBe('Mr. 1');
      expect(wrapperStudent.find('tr').at(1).find('td').at(1).text()).toBe('Example Class 1');
      expect(wrapperStudent.find('tr').at(1).find('td').at(2).text()).toBe('April 28, 2017');
      wrapperStudent.find('tr').at(1).find('td').at(3).find('span').simulate('click');
      expect(wrapperStudent.instance().classAction.mock.calls[0][0]).toBe('Archive');
      expect(wrapperStudent.instance().classAction.mock.calls[0][1]).toBe(1);
      expect(wrapperStudent.find('tr').at(2).find('td').at(0).text()).toBe('Mr. 2');
      expect(wrapperStudent.find('tr').at(2).find('td').at(1).text()).toBe('Example Class 2');
      expect(wrapperStudent.find('tr').at(2).find('td').at(2).text()).toBe('April 28, 2017');
      wrapperStudent.find('tr').at(2).find('td').at(3).find('span').simulate('click');
      expect(wrapperStudent.instance().classAction.mock.calls[1][0]).toBe('Archive');
      expect(wrapperStudent.instance().classAction.mock.calls[1][1]).toBe(2);
      expect(wrapperStudent.find('tr').at(3).find('td').at(0).text()).toBe('Mr. 3');
      expect(wrapperStudent.find('tr').at(3).find('td').at(1).text()).toBe('Example Class 3');
      expect(wrapperStudent.find('tr').at(3).find('td').at(2).text()).toBe('April 28, 2017');
      wrapperStudent.find('tr').at(3).find('td').at(3).find('span').simulate('click');
      expect(wrapperStudent.instance().classAction.mock.calls[2][0]).toBe('Archive');
      expect(wrapperStudent.instance().classAction.mock.calls[2][1]).toBe(3);
    });
  });

  describe('inactive classrooms section', () => {
    it('header should render', () => {
      expect(wrapperTeacher.text()).toMatch('Inactive Classes');
    });

    it('should render appropriate table header for teachers', () => {
      expect(wrapperTeacher.find('thead').at(1).find('th').at(0).text()).toBe('Class Name');
      expect(wrapperTeacher.find('thead').at(1).find('th').at(1).text()).toBe('Classcode');
      expect(wrapperTeacher.find('thead').at(1).find('th').at(2).text()).toBe('Student Count');
      expect(wrapperTeacher.find('thead').at(1).find('th').at(3).text()).toBe('Date Created');
      expect(wrapperTeacher.find('thead').at(1).find('th').at(4).text()).toBe('');
      expect(wrapperTeacher.find('thead').at(1).find('th').at(5).text()).toBe('');
    });

    it('should render appropriate table header for students', () => {
      expect(wrapperStudent.find('thead').at(1).find('th').at(0).text()).toBe('Teacher Name');
      expect(wrapperStudent.find('thead').at(1).find('th').at(1).text()).toBe('Class Name');
      expect(wrapperStudent.find('thead').at(1).find('th').at(2).text()).toBe('Date Joined');
      expect(wrapperStudent.find('thead').at(1).find('th').at(3).text()).toBe('');
    });

    it('should render appropriate table rows for teachers', () => {
      wrapperTeacher.instance().classAction = jest.fn();
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(0).text()).toBe('Example Class 4');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(1).text()).toBe('example-four');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(2).text()).toBe('2');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(3).text()).toBe('February 6, 2017');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(4).text()).toBe('');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(5).text()).toBe('Unarchive');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(5).find('span').props().className).toBe('unarchive ExampleClass4');
      wrapperTeacher.find('tbody').at(1).find('tr').at(0).find('td').at(5).find('span').simulate('click');
      expect(wrapperTeacher.instance().classAction.mock.calls[0][0]).toBe('Unarchive');
      expect(wrapperTeacher.instance().classAction.mock.calls[0][1]).toBe(4);
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(0).text()).toBe('Example Class 5');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(1).text()).toBe('example-five');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(2).text()).toBe('24');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(3).text()).toBe('February 6, 2017');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(4).text()).toBe('');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(5).text()).toBe('Unarchive');
      expect(wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(5).find('span').props().className).toBe('unarchive ExampleClass5');
      wrapperTeacher.find('tbody').at(1).find('tr').at(1).find('td').at(5).find('span').simulate('click');
      expect(wrapperTeacher.instance().classAction.mock.calls[1][0]).toBe('Unarchive');
      expect(wrapperTeacher.instance().classAction.mock.calls[1][1]).toBe(5);
    });

    it('should render appropriate table rows for students', () => {
      wrapperStudent.instance().classAction = jest.fn();
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(0).find('td').at(0).text()).toBe('Mr. 4');
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(0).find('td').at(1).text()).toBe('Example Class 4');
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(0).find('td').at(2).text()).toBe('April 28, 2017');
      wrapperStudent.find('tbody').at(1).find('tr').at(0).find('td').at(3).find('span').simulate('click');
      expect(wrapperStudent.instance().classAction.mock.calls[0][0]).toBe('Unarchive');
      expect(wrapperStudent.instance().classAction.mock.calls[0][1]).toBe(4);
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(1).find('td').at(0).text()).toBe('Mr. 5');
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(1).find('td').at(1).text()).toBe('Example Class 5');
      expect(wrapperStudent.find('tbody').at(1).find('tr').at(1).find('td').at(2).text()).toBe('April 28, 2017');
      wrapperStudent.find('tbody').at(1).find('tr').at(1).find('td').at(3).find('span').simulate('click');
      expect(wrapperStudent.instance().classAction.mock.calls[1][0]).toBe('Unarchive');
      expect(wrapperStudent.instance().classAction.mock.calls[1][1]).toBe(5);
    });
  });

});
