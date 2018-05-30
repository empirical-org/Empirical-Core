import React from 'react';
import { shallow } from 'enzyme';

import NewAccount from '../new_account';

import NewAccountStage1 from '../new_account_stage1'
import NewStudent from '../new_student'
import NewTeacher from '../new_teacher'

describe('NewAccount component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <NewAccount teacherFromGoogleSignUp={false} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render NewAccountStage1 if stage state is 1', () => {
    const wrapper = shallow(
      <NewAccount teacherFromGoogleSignUp={false} />
    );
    wrapper.setState({stage: 1});
    expect(wrapper.find(NewAccountStage1)).toHaveLength(1);
  });

  it('should render NewStudent if stage state is 2 and state role is student', () => {
    const wrapper = shallow(
      <NewAccount teacherFromGoogleSignUp={false} />
    );
    wrapper.setState({stage: 2, role: 'student'});
    expect(wrapper.find(NewStudent)).toHaveLength(1);
  });

  it('should render NewTeacher is stage state is 2 and state role is not student', () => {
    const wrapper = shallow(
      <NewAccount teacherFromGoogleSignUp={false} />
    );
    wrapper.setState({stage: 2, role: 'literally-anything-but-student'});
    expect(wrapper.find(NewTeacher)).toHaveLength(1);
  });

});
