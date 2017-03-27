import React from 'react';
import { shallow } from 'enzyme';

import AssigningIndicator from '../assigning_indicator';

describe('AssigningIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AssigningIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
