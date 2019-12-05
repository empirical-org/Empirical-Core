import * as React from 'react'
import { shallow } from 'enzyme';

import PromptStep from '../../components/studentView/promptStep'

describe('PromptStep component', () => {
  const wrapper = shallow(<PromptStep
    className="step"
    passedRef={() => {}}
    stepNumberComponent={<div />}
    text={'A prompt'}
  />)

  it('renders', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
