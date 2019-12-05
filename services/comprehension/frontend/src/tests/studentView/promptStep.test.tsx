import * as React from 'react'
import { shallow } from 'enzyme';

import PromptStep from '../../components/studentView/promptStep'

describe('PromptStep component', () => {
  const wrapper = shallow(<PromptStep
    text={'A prompt'}
    passedRef={() => {}}
    className="step"
    stepNumberComponent={<div></div>}
  />)

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
