import React from 'react';
import { shallow, mount } from 'enzyme';

import UsK12View from '../us_k12_view';

import SelectSchool from '../select_school';

describe('UsK12View component', () => {

  it('should render a <SelectSchool /> component with correct props', () => {
    const wrapper = shallow(
      <UsK12View analytics={{track: () => null}} />
    );
    expect(wrapper.find(SelectSchool)).toHaveLength(1);
    expect(wrapper.find(SelectSchool).props().isForSignUp).toBe(true);
    wrapper.setState({selectedSchool: {id: 321}});
    expect(wrapper.find(SelectSchool).props().selectedSchool.id).toBe(321);
    wrapper.setState({schoolOptions: [1, 2, 3]});
    expect(wrapper.find(SelectSchool).props().schoolOptions).toEqual([1, 2, 3]);
  });

  it('should show button only if state.selectedSchool is empty', () => {
    const wrapper = shallow(
      <UsK12View analytics={{track: () => null}} />
    );
    expect(wrapper.find('.select_school_button')).toHaveLength(0);
    wrapper.setState({selectedSchool: {id: 123}});
    expect(wrapper.find('.select_school_button')).toHaveLength(1);
  });

  it('should call props.selectSchool upon clicking school not listed link', () => {
    let mockSelectSchool = jest.fn();
    const wrapper = mount(
      <UsK12View selectSchool={mockSelectSchool}
        analytics={{track: () => null}} />
    );
    wrapper.find('#school_not_listed').simulate('click')
    expect(mockSelectSchool.mock.calls).toHaveLength(1);
  });

  it('should pass state.selectedSchool.id to props.selectSchool if a school is selected or "not listed" if not', () => {
    let mockSelectSchool = jest.fn();
    const wrapper = mount(
      <UsK12View selectSchool={mockSelectSchool}
        analytics={{track: () => null}} />
    );
    wrapper.find('#school_not_listed').simulate('click')
    expect(mockSelectSchool.mock.calls[0][0]).toBe('not listed');
    wrapper.setState({selectedSchool: {id: 123}})
    wrapper.find('#school_not_listed').simulate('click')
    expect(mockSelectSchool.mock.calls[1][0]).toBe(123);
  });


});
