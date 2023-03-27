import { shallow } from 'enzyme';
import * as React from 'react';

import 'whatwg-fetch';
import PromptHealth from '../activityHealth/promptHealth';

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
