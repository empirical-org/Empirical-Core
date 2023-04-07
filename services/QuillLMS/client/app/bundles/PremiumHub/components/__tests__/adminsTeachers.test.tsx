import * as React from 'react';
import { shallow } from 'enzyme';
import * as _ from 'underscore'

import { AdminsTeachers } from '../adminsTeachers';

const school = { name: "A Real Middle School", id: 77574 }

describe('AdminsTeachers component', () => {
  const mockProps = {
    data: [
      {
        "id": 12722634,
        "name": "Same School",
        "email": "emilia+sameschool@quill.org",
        "last_sign_in": "2022-12-08T15:53:45.183Z",
        "schools": [
          {
            "name": "A Real Middle School",
            "id": 77574,
            "role": "Teacher"
          }
        ],
        "number_of_students": 0,
        "number_of_activities_completed": 0,
        "time_spent": "No time yet",
        "has_valid_subscription": true
      },
      {
        "id": 12722635,
        "name": "New Admin",
        "email": "emilia+newadmin@quill.org",
        "last_sign_in": "2022-12-13T20:19:32.370Z",
        "schools": [
          {
            "name": "A Real Middle School",
            "id": 77574,
            "role": "Admin"
          }
        ],
        "number_of_students": 0,
        "number_of_activities_completed": 0,
        "time_spent": "No time yet",
        "has_valid_subscription": true
      },
      {
        "id": 12722903,
        "name": "One More",
        "email": "emilia+onemore@quill.org",
        "last_sign_in": null,
        "schools": [
          {
            "name": "A Real Middle School",
            "id": 77574,
            "role": "Admin"
          }
        ],
        "number_of_students": 0,
        "number_of_activities_completed": 0,
        "time_spent": "No time yet",
        "has_valid_subscription": true
      }
    ],
    handleUserAction: jest.fn,
    adminAssociatedSchool: school,
    schools: [school],
    adminApprovalRequestAdminInfoIds: []
  }
  const component = shallow(<AdminsTeachers {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
