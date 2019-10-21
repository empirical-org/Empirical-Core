import React from 'react'
import { shallow } from 'enzyme'

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
