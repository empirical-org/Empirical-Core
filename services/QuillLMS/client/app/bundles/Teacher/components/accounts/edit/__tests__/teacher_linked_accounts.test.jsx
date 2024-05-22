import { shallow } from 'enzyme';
import React from 'react';

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
        cleverId={null}
        googleId={null}
        postGoogleClassroomAssignments={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the user is linked to both clever and google', () => {
    const wrapper = shallow(
      <TeacherLinkedAccounts
        {...sharedProps}
        cleverId={456}
        googleId={123}
        postGoogleClassroomAssignments={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when the user is linked to clever but not google', () => {
    const wrapper = shallow(
      <TeacherLinkedAccounts
        {...sharedProps}
        cleverId={456}
        googleId={null}
        postGoogleClassroomAssignments={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('should render when the user is linked to google but not clever', () => {
    it('when post google classroom announcements is false', () => {
      const wrapper = shallow(
        <TeacherLinkedAccounts
          {...sharedProps}
          cleverId={null}
          googleId={123}
          postGoogleClassroomAssignments={false}
        />
      );
      expect(wrapper).toMatchSnapshot();
    })

    it('when post google classroom announcements is true', () => {
      const wrapper = shallow(
        <TeacherLinkedAccounts
          {...sharedProps}
          cleverId={456}
          googleId={null}
          postGoogleClassroomAssignments={true}
        />
      );
      expect(wrapper).toMatchSnapshot();
    })
  });


});
