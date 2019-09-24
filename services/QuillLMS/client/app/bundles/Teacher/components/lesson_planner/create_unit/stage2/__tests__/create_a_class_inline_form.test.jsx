import React from 'react'
import { shallow } from 'enzyme'

import CreateAClassInlineForm from '../create_a_class_inline_form.jsx'

describe('CreateAClassInlineForm component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <CreateAClassInlineForm
        onSuccess={() => {}}
        cancel={() => {}}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
