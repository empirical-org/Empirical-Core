import React from 'react';
import { shallow } from 'enzyme';

import ArchivedClassroomsManager from '../ArchivedClassroomsManager.jsx';
import LoadingIndicator from '../../components/shared/loading_indicator.jsx';
import NotificationBox from '../../components/shared/notification_box.jsx'
import InviteCoteachers from '../../components/classroom_management/invite_coteachers.jsx';

describe('ArchivedClassroomsManager container', () => {
  const wrapper = shallow(<ArchivedClassroomsManager role="teacher" />);
  const response = require("../../../../../__mockdata__/teachers_classrooms_archived_classroom_manager_data.json");
  wrapper.instance().formatData(response);

  describe('initial state', () => {
    it('should return the correct paths for a teacher', () => {
      expect(wrapper.state().basePath).toBe('/teachers/classrooms');
      expect(wrapper.state().getClassroomsPath).toBe('/teachers/classrooms/archived_classroom_manager_data');
    });
  });

  it('componentDidMount should call getClassrooms', () => {
    wrapper.instance().getClassrooms = jest.fn();
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().getClassrooms).toHaveBeenCalled();
  });

  // TODO: test getClassrooms() once request is in instead of ajax
  // TODO: test classAction() once request is in instead of ajax

  describe('archived notification', () => {
    it('should display if there is an archived notification', () => {
      wrapper.setState({showArchivedNotification: true});
      expect(wrapper.find(NotificationBox).exists()).toBe(true);
    });

    it('should not display if there is no archived notification', () => {
      wrapper.setState({showArchivedNotification: false});
      expect(wrapper.find(NotificationBox).exists()).toBe(false);
    });
  });

  it('should render links to add a class and sync with google classroom', () => {
    expect(wrapper.find('.q-button').at(0).text()).toBe('Create a Class');
    expect(wrapper.find('.q-button').at(0).prop('href')).toBe('/teachers/classrooms/new');
    expect(wrapper.find('.q-button').at(1).text()).toBe('Sync with Google Classroom');
    expect(wrapper.find('.q-button').at(1).prop('href')).toBe('/teachers/classrooms/google_sync');
  });

  it('should render loading if no classrooms have loaded', () => {
    wrapper.setState({ classrooms: null, });
    expect(wrapper.text()).toMatch('loading');
    wrapper.instance().formatData(response);
  });

  describe('active classrooms section', () => {
    it('header should render', () => {
      expect(wrapper.find('#active-classes h1').text()).toBe('Active Classes');
    });

    it('should render table headers', () => {
      const headers =  ['Class Name', 'Owner', 'Co-Teachers', 'Classcode', 'Student Count', 'Date Created', 'Edit Students', ''];
      for(let i = 0; i < headers.length; i++) {
        expect(wrapper.find('#active-classes').first('tr').find('th').at(i).text()).toBe(headers[i]);
      }
    });

    it('should render appropriate table rows', () => {
      const classrooms = wrapper.state().classrooms.active;
      for(let i = 0; i < classrooms.length; i++) {
        if(classrooms[i].invitation) {
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(0).text()).toBe(classrooms[i].classroom_name);
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(1).text()).toBe(`${classrooms[i].inviter_name} has invited you to co-teach this class. (Accept Invite / Decline Invite)`);
          for(let classroomName in classrooms[i].classrooms) {
            expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(3).text()).toMatch(classroomName);
          }
        } else {
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(0).text()).toBe(classrooms[i].className);
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(1).text()).toBe(classrooms[i].ownerName);
          for(let coteacherName in classrooms[i].coteacherNames) {
            expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(2).text()).toMatch(coteacherName);
          }
          let classcodeString;
          if(classrooms[i].from_google) {
            classcodeString = 'Synced from Google Classroom';
          } else {
            classcodeString = classrooms[i].classcode;
          }
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(3).text()).toBe(classcodeString);
          expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(4).text()).toBe(classrooms[i].studentCount.toString());
          // expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(5).text()).toBe();
          // expect(wrapper.find('#active-classes tbody tr').at(i).find('td').at(6).text()).toBe();
        }
      }
    });
  });

  // describe('inactive classrooms section', () => {
  //   it('header should render', () => {
  //     expect(wrapper.text()).toMatch('Inactive Classes');
  //   });
  //
  //   it('should render appropriate table header', () => {
  //     expect(wrapper.find('thead').at(1).find('th').at(0).text()).toBe('Class Name');
  //     expect(wrapper.find('thead').at(1).find('th').at(1).text()).toBe('Classcode');
  //     expect(wrapper.find('thead').at(1).find('th').at(2).text()).toBe('Student Count');
  //     expect(wrapper.find('thead').at(1).find('th').at(3).text()).toBe('Date Created');
  //     expect(wrapper.find('thead').at(1).find('th').at(4).text()).toBe('');
  //     expect(wrapper.find('thead').at(1).find('th').at(5).text()).toBe('');
  //   });
  //
  //   it('should render appropriate table rows', () => {
  //     wrapper.instance().classAction = jest.fn();
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(0).text()).toBe('Example Class 4');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(1).text()).toBe('example-four');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(2).text()).toBe('2');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(3).text()).toBe('February 6, 2017');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(4).text()).toBe('');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(5).text()).toBe('<loading_indicator />Unarchive');
  //     wrapper.find('tbody').at(1).find('tr').at(0).find('td').at(5).find('span.action-container').first().simulate('click');
  //     expect(wrapper.instance().classAction.mock.calls[0][0]).toBe('Unarchive');
  //     expect(wrapper.instance().classAction.mock.calls[0][1]).toBe(4);
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(0).text()).toBe('Example Class 5');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(1).text()).toBe('example-five');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(2).text()).toBe('24');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(3).text()).toBe('February 6, 2017');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(4).text()).toBe('');
  //     expect(wrapper.find('tbody').at(1).find('tr').at(1).find('td').at(5).text().includes('Unarchive')).toBe(true);
  //   });
  // });

  describe.skip('coteachers section', () => {
    // TODO: make the response have coteachers and/or pending coteachers

    it('should render header', () => {
      expect(wrapper.find('#my-coteachers h1').text()).toBe('My Co-Teachers');
    });

    it('should render table headers', () => {
      const headers = ['Co-Teacher Name', 'Email Address', 'Status', 'Classes'];
      for(let i = 0; i < headers.length; i++) {
        expect(wrapper.find('#my-coteachers table').first('tr').find('td').at(i).text()).toBe(headers[i]);
      }
    });

    it('should render pending coteachers', () => {

    });

    it('should render coteachers', () => {

    });
  });

  it('should render invite coteachers component', () => {
    expect(wrapper.find(InviteCoteachers).exists()).toBe(true);
  });
});
