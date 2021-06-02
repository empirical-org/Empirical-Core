import * as React from 'react';
import { shallow } from 'enzyme';

import PromptHealth from '../activityHealth/promptHealth';
import 'whatwg-fetch';

const mockProps = {
  dataResults: []
}

describe('PromptHealth component', () => {

  it('should render PromptHealth', () => {
    const wrapper = shallow(
      <PromptHealth {...mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
