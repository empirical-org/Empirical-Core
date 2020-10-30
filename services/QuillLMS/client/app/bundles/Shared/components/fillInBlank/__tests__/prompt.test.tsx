import * as React from 'react';
import { shallow } from 'enzyme';

import { Prompt } from '../prompt';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}))

const mockProps = {
  style: {},
  elements: [
    <span children='<em>Ele</em>' key="1" style={{}} />,
    <span children='<strong>gosta</strong>' key="2" style={{}} />,
    <input />,
    <span children='bater' key="3" style={{}} />,
    <span children='<u>papo.</u>' key="4" style={{}} />,
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
