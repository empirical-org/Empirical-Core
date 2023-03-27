import { shallow } from 'enzyme';
import React from 'react';

import ClassCodeLink from '../class_code_link';

const classroom = { id: 1, code: 'happy-day', name: 'Classroom'}

describe('ClassCodeLink component', () => {

  const wrapper = shallow(
    <ClassCodeLink classroom={classroom} next={() => {}} showSnackbar={() => {}} />
  );

  it('should render ClassCodeLink', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('#classCodeLink should return a url', () => {
    expect(wrapper.instance().classCodeLink()).toMatch(`quill.org/join/${classroom.code}`)
  })
})
