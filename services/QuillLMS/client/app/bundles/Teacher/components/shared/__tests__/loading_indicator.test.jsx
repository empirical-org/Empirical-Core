import { shallow } from 'enzyme';
import React from 'react';

import LoadingIndicator from '../loading_indicator';

describe('LoadingIndicator component', () => {
  const wrapper = shallow(
    <LoadingIndicator />
  );

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('renders the spinner container', () => {
    expect(wrapper.find('.spinner-container')).toHaveLength(1)
  })

});
