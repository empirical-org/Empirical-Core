import { shallow } from 'enzyme';
import * as React from 'react';

import { Prompt } from '../prompt';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}))

const mockProps = {
  style: {},
  elements: [
    <span key="1" style={{}}>{'<em>Ele</em>'}</span>,
    <span key="2" style={{}}>{'<strong>gosta</strong>'}</span>,
    <input aria-label="test-label" key="3" />,
    <span key="4" style={{}}>bater</span>,
    <span key="5" style={{}}>{'<u>papo.</u>'}</span>,
  ]
}

describe('Prompt component', () => {

  const component = shallow(<Prompt {...mockProps} />);
  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render one <em> element and one <strong> element in the same <p> tag', () => {
    expect(component.find('span').first().props().dangerouslySetInnerHTML.__html).toEqual('<em>Ele</em> <strong>gosta</strong>')
  })
  it('should render one <u> element in a <p> tag', () => {
    expect(component.find('span').last().props().dangerouslySetInnerHTML.__html).toEqual('bater <u>papo.</u>')
  })
})
