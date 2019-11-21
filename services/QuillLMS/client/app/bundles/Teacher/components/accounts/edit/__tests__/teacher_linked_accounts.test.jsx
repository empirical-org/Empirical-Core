import React from 'react';
import { shallow } from 'enzyme';

import TeacherLinkedAccounts from '../teacher_linked_accounts';

const sharedProps = {
  updateUser: jest.fn(),
  cleverLink: '',
  email: 'hello@quill.org',
  timesSubmitted: 0,
  errors: {}
}

describe('TeacherLinkedAccounts component', () => {

  it('should render when the user is not linked to clever or google', () => {
    const wrapper = shallow(
      <TeacherLinkedAccounts
        {...sharedProps}
        postGoogleClassroomAssignments={false}
        googleId={null}
        cleverId={null}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the user is linked to both clever and google', () => {
    const wrapper = shallow(
      <TeacherLinkedAccounts
        {...sharedProps}
        postGoogleClassroomAssignments={false}
        googleId={123}
        cleverId={456}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the user is linked to clever but not google', () => {
    const wrapper = shallow(
      <TeacherLinkedAccounts
        {...sharedProps}
        postGoogleClassroomAssignments={false}
        googleId={null}
        cleverId={456}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('should render when the user is linked to google but not clever', () => {
    it('when post google classroom announcements is false', () => {
      const wrapper = shallow(
        <TeacherLinkedAccounts
          {...sharedProps}
          postGoogleClassroomAssignments={false}
          googleId={null}
          cleverId={456}
        />
      );
      expect(wrapper).toMatchSnapshot();
    })

    it('when post google classroom announcements is true', () => {
      const wrapper = shallow(
        <TeacherLinkedAccounts
          {...sharedProps}
          postGoogleClassroomAssignments={true}
          googleId={null}
          cleverId={456}
        />
      );
      expect(wrapper).toMatchSnapshot();
    })
  });


});
