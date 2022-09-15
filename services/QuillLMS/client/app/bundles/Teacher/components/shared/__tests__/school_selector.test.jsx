import React from 'react';
import { mount } from 'enzyme';

import SchoolSelector from '../school_selector';

const sharedProps = {
  selectSchool: () => {},
  showDismissSchoolSelectionReminderCheckbox: false,
  handleDismissSchoolSelectionReminder: () => {}
}

describe('SchoolSelector component', () => {
  it('should render when the dismiss reminder checkbox does not show', () => {
    const wrapper = mount(
      <SchoolSelector {...sharedProps} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the dismiss reminder checkbox does show', () => {
    const wrapper = mount(
      <SchoolSelector {...sharedProps} showDismissSchoolSelectionReminderCheckbox={true} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
