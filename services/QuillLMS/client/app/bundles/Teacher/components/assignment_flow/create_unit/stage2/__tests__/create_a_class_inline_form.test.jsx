import { shallow } from 'enzyme'
import React from 'react'

import CreateAClassInlineForm from '../create_a_class_inline_form.tsx'

describe('CreateAClassInlineForm component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <CreateAClassInlineForm
        cancel={() => {}}
        onSuccess={() => {}}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
