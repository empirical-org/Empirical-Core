import { shallow } from 'enzyme';
import * as React from 'react';

import { ExpandableCard } from '../../../../Shared/index';

describe('TeacherPreviewMenu component', () => {
  const mockProps = {
    imgAlt: 'test-alt',
    imgSrc: 'test-src',
    isExpanded: false,
    onClick: jest.fn(),
    header: 'test header',
    text:'test textdsef',
    rows: [{
      imgAlt: 'test-alt',
      imgSrc: 'test-src',
      name: 'test name',
      onClick: jest.fn()
    }]
  }
  let component = shallow(<ExpandableCard {...mockProps} />);
  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
  it('should show expanded section when isExpanded is true', () => {
    expect(component.find('.expanded-section').exists()).toBe(false)
    mockProps.isExpanded = true;
    component = shallow(<ExpandableCard {...mockProps} />);
    expect(component.find('.expanded-section').exists()).toBe(true)
  });
});
