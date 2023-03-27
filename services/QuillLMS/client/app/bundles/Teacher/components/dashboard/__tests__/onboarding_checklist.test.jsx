import { mount } from 'enzyme';
import React from 'react';

import OnboardingChecklist from '../onboarding_checklist';

const props = {
  firstName: "Emilia",
  onboardingChecklist: [
    {
      name: "Create a class",
      checked: true,
      link: "/teachers/classrooms?modal=create-a-class"
    },
    {
      name: "Add students",
      checked: false,
      link: "/teachers/classrooms"
    },
    {
      name: "Explore our library",
      checked: true,
      link: "/assign"
    },
    {
      name: "Explore our diagnostics",
      checked: true,
      link: "/assign/diagnostic"
    }
  ]
}

describe('OnboardingChecklist component', () => {

  it('should render', () => {
    expect(mount(<OnboardingChecklist {...props} />)).toMatchSnapshot();
  });

});
