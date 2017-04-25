import React from 'react';
import { shallow } from 'enzyme';

import AssigningIndicator from '../button_loading_indicator';

describe('AssigningIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <AssigningIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
