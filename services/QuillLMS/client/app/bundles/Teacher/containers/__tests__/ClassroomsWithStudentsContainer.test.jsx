import React from 'react';
import {
    shallow,
    mount
} from 'enzyme';
import _ from 'lodash'

import ClassroomsWithStudentsContainer from '../ClassroomsWithStudentsContainer';

const props = {
    'history': {},
    'location': {
        'pathname': '/teachers/classrooms/activity_planner/units/96618/students/edit',
        'search': '',
        'hash': '',
        'state': null,
        'action': 'POP',
        'key': 'fv6n93',
        'query': {},
        '$searchBase': {
            'search': '',
            'searchBase': ''
        }
    },
    'params': {
        'unitId': '96618'
    },
    'route': {
        'path': 'units/:unitId/students/edit'
    },
    'routeParams': {
        'unitId': '96618'
    },
    'routes': [{
        'path': '/teachers/classrooms/activity_planner',
        'indexRoute': {},
        'childRoutes': [{
            'path': 'featured-activity-packs(/category/:category)'
        }, {
            'path': 'featured-activity-packs(/grade/:grade)'
        }, {
            'path': 'featured-activity-packs/:activityPackId'
        }, {
            'path': 'featured-activity-packs/:activityPackId/assigned'
        }, {
            'path': ':tab'
        }, {
            'path': 'new_unit/students/edit/name/:unitName/activity_ids/:activityIdsArray'
        }, {
            'path': 'units/:unitId/students/edit'
        }, {
            'path': 'units/:unitId/activities/edit(/:unitName)'
        }, {
            'path': 'no_units'
        }]
    }, {
        'path': 'units/:unitId/students/edit'
    }],
    'children': null
}

const state = {
    'classrooms': [{
        'id': 102538,
        'name': '4th Period',
        'code': 'page-friend',
        'teacher_id': 852654,
        'created_at': '2017-01-04T04:28:27.325Z',
        'updated_at': '2017-01-04T04:28:27.325Z',
        'clever_id': null,
        'grade': '9',
        'visible': true,
        'google_classroom_id': null,
        'grade_level': null,
        'students': [{
            'id': 864067,
            'name': 'Stefany',
            'email': 'fake',
            'password_digest': '$2a$10$XnZgHXNPUBK/AoNKBZAOE.7yiMFoVPGBUQscUMqBePfhms/UGn5uu',
            'role': 'student',
            'created_at': '2017-01-05T15:47:24.407Z',
            'updated_at': '2017-01-05T15:47:24.528Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864069,
            'name': 'Jessie',
            'email': 'fake',
            'password_digest': '$2a$10$LUmArShz463/eIc1y4pgHOWJ.2Xqf9kFDu28lUXFxAzqI94EElJ3W',
            'role': 'student',
            'created_at': '2017-01-05T15:48:04.048Z',
            'updated_at': '2017-01-12T20:08:59.846Z',
            'classcode': null,
            'active': false,
            'username': 'fake-jessie',
            'token': 's12CaoxDo7CTq93JYP9ORg',
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864071,
            'name': 'Tatyana',
            'email': 'fake',
            'password_digest': '$2a$10$M4llO2fT5XHmABzfSa.A/O1fYOKJUVuEOOfPPKfgYRYVSJSgiPYKC',
            'role': 'student',
            'created_at': '2017-01-05T15:48:10.440Z',
            'updated_at': '2017-03-29T12:15:35.273Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864072,
            'name': 'Isaac',
            'email': 'fake',
            'password_digest': '$2a$10$rSZZJzHWGz0F8GM9MaDeUeWMpHK/7MyoIJiHhQHXCJHkepjnamvGW',
            'role': 'student',
            'created_at': '2017-01-05T15:48:34.681Z',
            'updated_at': '2017-01-05T15:48:34.724Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864073,
            'name': 'Saul',
            'email': 'fake',
            'password_digest': '$2a$10$b0XmZKs9/HtZ4V49kYUYVOBraMT.lfW/vl1ZbZvY/4X8GlYx3T9IW',
            'role': 'student',
            'created_at': '2017-01-05T15:49:05.211Z',
            'updated_at': '2017-01-18T15:45:10.674Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864075,
            'name': 'Nelly',
            'email': 'fake',
            'password_digest': '$2a$10$uF9k0b/qYozYRgLhy/ZfkeXs8BvnKeYEMYDbI.JAklXH/wPXY/2yK',
            'role': 'student',
            'created_at': '2017-01-05T15:49:15.043Z',
            'updated_at': '2017-03-07T15:00:37.353Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864076,
            'name': 'Marco',
            'email': 'fake',
            'password_digest': '$2a$10$1DKdKuHaC.2Dxl.cO47WEuGlbrHCmI39h42N4mm2GwZ1K/pA9tT8u',
            'role': 'student',
            'created_at': '2017-01-05T15:49:19.808Z',
            'updated_at': '2017-04-03T13:51:25.633Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864079,
            'name': 'Marcus',
            'email': 'fake',
            'password_digest': '$2a$10$Zg8YzuUbzehU8UerfSetROvz6b8BasOG923Ay/wLQCWUKMzPzcBrG',
            'role': 'student',
            'created_at': '2017-01-05T15:50:04.396Z',
            'updated_at': '2017-01-20T15:55:30.648Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864080,
            'name': 'Ernesto',
            'email': 'fake@pasadena.org',
            'password_digest': '$2a$10$.xC/L6J6G40nZVOJvii5OeieQi.z1YpZFrMaR0ffIdO86nI0NpCTK',
            'role': 'student',
            'created_at': '2017-01-05T15:50:31.625Z',
            'updated_at': '2017-01-05T15:50:31.652Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 864117,
            'name': 'Lea',
            'email': 'fake',
            'password_digest': '$2a$10$iy7mYfBZhlz/UTph6fuxY.I3zqapXZt4VuNarZMFk6ajjR/u3Qsv6',
            'role': 'student',
            'created_at': '2017-01-05T15:51:53.456Z',
            'updated_at': '2017-01-30T16:00:16.901Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 868836,
            'name': 'Amber',
            'email': 'fake',
            'password_digest': '$2a$10$gI1WcEV.Ara/fYm1sI0Cre8q6Id2vrLt0cryVlW2n6qR15bCtjI/W',
            'role': 'student',
            'created_at': '2017-01-06T15:53:04.229Z',
            'updated_at': '2017-03-03T15:56:39.563Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 869030,
            'name': 'Antonio',
            'email': 'fake',
            'password_digest': '$2a$10$YYTD1RrXUlRDiK77g0qaWuihH1akRSnJfBneFmP51y6L9HvM19NGa',
            'role': 'student',
            'created_at': '2017-01-06T16:05:11.976Z',
            'updated_at': '2017-01-20T16:03:35.361Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 925445,
            'name': 'Cassandra',
            'email': 'fake',
            'password_digest': '$2a$10$GymYuzehASCESAYS4y6PvOwnb2XSk0R5mMP53vTxU6Lh/xCY/Qj0e',
            'role': 'student',
            'created_at': '2017-01-18T15:55:40.098Z',
            'updated_at': '2017-01-18T15:55:40.157Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 941518,
            'name': 'Gustavo',
            'email': 'fake',
            'password_digest': '$2a$10$LHZNCAL4fs1KD.pQMTyCluGCsqCsu6BfH6LKGvrLuGK.6yV.0gSaG',
            'role': 'student',
            'created_at': '2017-01-20T15:53:56.717Z',
            'updated_at': '2017-01-20T15:53:56.726Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }, {
            'id': 1412091,
            'name': 'Jose',
            'email': 'fake',
            'password_digest': '$2a$10$hOux7CoTQRmJUOWi4WZy2O77kMYwn5.Q/5bLScAhLia.WObt8P1Ca',
            'role': 'student',
            'created_at': '2017-03-29T16:03:39.197Z',
            'updated_at': '2017-03-29T16:03:39.241Z',
            'classcode': null,
            'active': false,
            'username': 'fake',
            'token': null,
            'ip_address': {
                'family': 2,
                'addr': 0,
                'mask_addr': 0
            },
            'clever_id': null,
            'signed_up_with_google': false,
            'send_newsletter': false,
            'flag': null,
            'google_id': null
        }],
        'classroom_activity': {
            'id': 1082553,
            'assigned_student_ids': [864075, 864076]
        }
    }],
    'loading': false,
    'studentsChanged': false,
    'newUnit': false,
    'unitName': 'df'
}

describe('ClassroomsWithStudentsContainer container', () => {

  it('should render', () => {
      const wrapper = mount( < ClassroomsWithStudentsContainer {...props}/>);
          expect(wrapper.find(ClassroomsWithStudentsContainer).exists()).toBe(true);
      });

  describe('classroomUpdated', () => {

    it('returns false if the selected students are the same as the originally assigned students', () => {
      const wrapper = shallow( < ClassroomsWithStudentsContainer {...props}/>);
      wrapper.setState(_.cloneDeep(state))
      wrapper.instance().selectPreviouslyAssignedStudents();
      expect(wrapper.instance().classroomUpdated(wrapper.state().classrooms[0])).toBe(false)
    })

    it('returns true otherwise', () => {
      const wrapper = shallow( < ClassroomsWithStudentsContainer {...props}/>);
      const newState = _.cloneDeep(state)
      newState.classrooms[0].students[0].isSelected = true
      wrapper.setState(newState)
      expect(wrapper.instance().classroomUpdated(wrapper.state().classrooms[0])).toBe(true)
    })

  })

  describe('studentsChanged', () => {
    it('returns true if a classroom has been updated', () => {
      const wrapper = shallow( < ClassroomsWithStudentsContainer {...props}/>);
      const newState = _.cloneDeep(state)
      newState.classrooms[0].students[0].isSelected = true
      wrapper.setState(newState)
      expect(wrapper.instance().studentsChanged(newState.classrooms)).toBe(true)
    })

    it('returns false if no classrooms have been updated', () => {
      const wrapper = shallow( < ClassroomsWithStudentsContainer {...props}/>);
      wrapper.setState(_.cloneDeep(state))
      wrapper.instance().selectPreviouslyAssignedStudents();
      expect(wrapper.instance().studentsChanged(wrapper.state('classrooms'))).toBe(undefined)
    })
  })

  describe('selectPreviouslyAssignedStudents', ()=> {
    it('selectPreviouslyAssignedStudents marks a student as selected if they are an assigned student', () => {
      const wrapper = shallow(<ClassroomsWithStudentsContainer {...props}/>);
        wrapper.setState(_.cloneDeep(state))
        let assignedStudents = wrapper.state().classrooms[0].classroom_activity.assigned_student_ids
        let students = wrapper.state().classrooms[0].students
        wrapper.instance().selectPreviouslyAssignedStudents();
        let selectedStudents = []
        students.forEach((stud)=> {
          if (stud.isSelected) {
            selectedStudents.push(stud.id)
          }
        });
        expect(assignedStudents.sort((a,b)=> a - b)).toEqual(selectedStudents.sort((a,b)=> a - b))
    })
    it('correctly marks when a missing student was assigned the activity', () => {
      const newWrapper = shallow( < ClassroomsWithStudentsContainer {...props}/>);
      newWrapper.setState(_.cloneDeep(state))
        let assignedStudents = newWrapper.state().classrooms[0].classroom_activity.assigned_student_ids
        newWrapper.instance().selectPreviouslyAssignedStudents();
        let students = newWrapper.state().classrooms[0].students
        let selectedStudents = []
        students.forEach((stud)=> {
          if (stud.isSelected) {
            selectedStudents.push(stud.id)
          }
        });
        expect(selectedStudents.length).toEqual(assignedStudents.length)
        expect(selectedStudents).not.toContain(0)
    })
  })







});
