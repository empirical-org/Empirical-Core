import { mount } from 'enzyme';
import React from 'react';

import { alternativeSchools, alternativeSchoolsNameMap, noSchoolSelectedSchool, notListedSchool } from './data';

import TeacherGeneralAccountInfo from '../teacher_general.jsx';

describe('TeacherGeneralAccountInfo component', () => {
  const sharedProps = {
    active: false,
    activateSection: jest.fn(),
    alternativeSchools,
    alternativeSchoolsNameMap,
    deactivateSection: jest.fn(),
    email: 'test@email.com',
    errors: {},
    name: 'Test User',
    schoolType: "U.S. K-12 school",
    showDismissSchoolSelectionReminderCheckbox: false,
    updateUser: jest.fn(),
  };

  it('should render when the school is not listed', () => {
    const component = mount(<TeacherGeneralAccountInfo {...sharedProps} school={notListedSchool} />);
    expect(component).toMatchSnapshot();
  });

  it('should render when the school is not selected', () => {
    const component = mount(<TeacherGeneralAccountInfo {...sharedProps} school={noSchoolSelectedSchool} showDismissSchoolSelectionReminderCheckbox={true} />);
    expect(component).toMatchSnapshot();
  });

});
