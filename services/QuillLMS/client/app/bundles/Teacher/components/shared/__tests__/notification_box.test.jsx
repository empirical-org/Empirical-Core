import React from 'react';
import { shallow } from 'enzyme';

import NotificationBox from '../notification_box';

describe('NotificationBox component', () => {
  it('should render', () => {
    const wrapper = shallow(
      <NotificationBox>
        hi
      </NotificationBox>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render text that is passed as a child', () => {
    const passedText = 'Todays Current Event - 5/18/2017: Major and malicious car crash in Time Square.';
    const wrapper = shallow(
      <NotificationBox>
        {passedText}
      </NotificationBox>
    );
    expect(wrapper.find('p').text()).toBe(passedText);
  });
});
