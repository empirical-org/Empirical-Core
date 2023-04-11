import { shallow } from 'enzyme';
import React from 'react';

import { ResumeOrBeginButton } from '../../../../Shared/index';

describe('ResumeOrBeginButton component', () => {
  const clickMock = jest.fn()
  const text = 'I am the text that got passed'
  const wrapper = shallow(<ResumeOrBeginButton onClickFn={clickMock} text={text} /> )

  it('renders a button element', () => {
    expect(wrapper.find('button')).toHaveLength(1)
  })

  it('calls the click function it is passed when clicked', () => {
    wrapper.simulate('click')
    expect(clickMock.mock.calls).toHaveLength(1)
  })

  it('renders the text it is passed', () => {
    expect(wrapper.text()).toEqual(text)
  })

})
