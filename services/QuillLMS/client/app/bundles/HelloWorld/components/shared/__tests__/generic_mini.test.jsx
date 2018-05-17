import React from 'react';
import { shallow } from 'enzyme';

import GenericMini from '../generic_mini';

describe('GenericMini component', () => {

  it('should render props.children as children', () => {
    const wrapper = shallow(
      <GenericMini>
        <h1>Hi, I'm a child!</h1>
      </GenericMini>
    );
    expect(wrapper.text()).toBe("Hi, I'm a child!");
  });

});
