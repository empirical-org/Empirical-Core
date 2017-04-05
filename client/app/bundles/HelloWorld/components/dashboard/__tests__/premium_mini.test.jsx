import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery';

import PremiumMini from '../premium_mini';

jest.mock('jquery', () => {
  return {
    post: jest.fn().mockReturnValue({
      success: jest.fn()
    })
  };
});

describe('PremiumMini component', () => {

  it('should render', () => {
    expect(shallow(<PremiumMini />)).toMatchSnapshot();
  });

  it('should post to subscriptions on button click', () => {
    const wrapper = shallow(<PremiumMini />);
    wrapper.find('button').simulate('click');
    expect($.post.mock.calls[0][0]).toBe('/subscriptions');
    expect($.post.mock.calls[0][1].account_limit).toBe(1000);
    expect($.post.mock.calls[0][1].account_type).toBe('trial');
  });

});
