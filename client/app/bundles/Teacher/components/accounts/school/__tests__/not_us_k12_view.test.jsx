import React from 'react';
import { shallow, mount } from 'enzyme';

import NotUsK12View from '../not_us_k12_view';

describe('NotUsK12View component', () => {

  const buttons = [
    { text: 'Home School',    argument: 'home school'   },
    { text: 'U.S Higher Ed',  argument: 'us higher ed'  },
    { text: 'International',  argument: 'international' },
    { text: 'Other',          argument: 'other'         }
  ]

  it('should render four buttons', () => {
    const wrapper = shallow(
      <NotUsK12View selectSchool={() => null} />
    );
    buttons.forEach((button, index) => {
      expect(wrapper.find('button').at(index).text()).toBe(button.text);
    })
  });

  it('should call selectSchool function passed to props', () => {
    let mockSelectSchool = jest.fn();
    const wrapper = mount(
      <NotUsK12View selectSchool={mockSelectSchool} />
    );
    buttons.forEach((button, index) => {
      wrapper.find('button').at(index).simulate('click');
      expect(mockSelectSchool.mock.calls[index][0]).toBe(button.argument)
    });
    expect(mockSelectSchool.mock.calls).toHaveLength(buttons.length);
  });

});
