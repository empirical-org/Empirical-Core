import { shallow } from 'enzyme';
import React from 'react';

import DateRangeFilterOption from '../date_range_filter_option';

describe('DateRangeFilterOption', () => {
  const mockFunction = jest.fn();

  const wrapper = shallow(
    <DateRangeFilterOption
      onClickFunction={mockFunction}
      title='Example Title'
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
