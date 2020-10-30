import * as React from 'react';
import { shallow } from 'enzyme';

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
  it('should render one <em> element', () => {
    expect(component.find('em').length).toEqual(1);
  })
  it('should render one <strong> element', () => {
    expect(component.find('strong').length).toEqual(1);
  })
  it('should render one <u> element', () => {
    expect(component.find('u').length).toEqual(1);
  })
})
