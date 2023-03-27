import { shallow } from 'enzyme';
import React from 'react';

import { Instructions } from '../../../../Shared/index';

describe('Instructions component', () => {

  const html = '<p>Fill in each blank with a word above.</p>'

  const wrapper = shallow(<Instructions html={html} />)
  it('renders a div element with the class feedback-row', () => {
    expect(wrapper.find('div.feedback-row')).toHaveLength(1)
  })

  it('renders the passed html inside of its inner div', () => {
    expect(wrapper.find('div').last().html()).toEqual(`<div>${html}</div>`)
  })
})
