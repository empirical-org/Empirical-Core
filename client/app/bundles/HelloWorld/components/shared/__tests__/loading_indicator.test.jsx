import React from 'react';
import { shallow } from 'enzyme';

import LoadingIndicator from '../loading_indicator';

describe('LoadingIndicator component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <LoadingIndicator />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
