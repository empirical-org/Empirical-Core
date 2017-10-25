import React from 'react';
import { shallow } from 'enzyme';

import DateRangeFilterOption from '../date_range_filter_option';

describe('DateRangeFilterOption', () => {
  const mockFunction = jest.fn();

  const wrapper = shallow(
    <DateRangeFilterOption
      title='Example Title'
      onClickFunction={mockFunction}
    />
  );

  it('should render title from props', () => {
    expect(wrapper.text()).toMatch('Example Title');
  });

  it('should execute onClickFunction in props on click', () => {
    wrapper.simulate('click');
    expect(mockFunction).toHaveBeenCalled();
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
