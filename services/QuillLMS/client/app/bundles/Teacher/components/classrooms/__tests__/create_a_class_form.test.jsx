import { shallow } from 'enzyme';
import * as React from 'react';

import CreateAClassForm from '../create_a_class_form';

describe('CreateAClassForm component', () => {

  describe('on initial load', () => {

    const wrapper = shallow(
      <CreateAClassForm next={() => {}} setClassroom={() => {}} />
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    })

    it('should have a disabled button', () => {
      expect(wrapper.find('.quill-button').hasClass('disabled')).toBe(true)
    })
  })

  describe('after filling out the form', () => {
    const wrapper = shallow(
      <CreateAClassForm next={() => {}} setClassroom={() => {}} />
    );

    wrapper.setState({ name: 'Classroom', code: 'happy-day', grade: 7 })

    it('should not have a disabled button', () => {
      expect(wrapper.find('.quill-button').hasClass('disabled')).toBe(false)
    })
  })

})
