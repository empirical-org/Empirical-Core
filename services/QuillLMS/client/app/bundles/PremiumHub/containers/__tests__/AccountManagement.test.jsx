import * as React from "react";
import { render, } from "@testing-library/react";

import AccountManagement from '../AccountManagement';
import { FULL, RESTRICTED, LIMITED, } from '../../shared'

const school = { name: "A Real Middle School", id: 77574 }

const teachers = [
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
]

const sharedProps = {
  passedModel: { teachers: [], schools: [school], admin_approval_requests: [] },
  adminId: 7,
}

describe('AccountManagement container', () => {
  test('should render with a full access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={FULL} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render with a limited access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={LIMITED} />);
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render with a restricted access type', () => {
    const { asFragment } = render(<AccountManagement {...sharedProps} accessType={RESTRICTED} />);
    expect(asFragment()).toMatchSnapshot();
  })

});
