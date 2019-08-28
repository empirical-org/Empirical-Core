import React from 'react';
import { shallow } from 'enzyme';
import request from 'request';

import PremiumMini from '../premium_mini';

jest.mock('request', () => ({
  post: jest.fn()
}));

describe('PremiumMini component', () => {
  it('should render', () => {
    expect(shallow(<PremiumMini />)).toMatchSnapshot();
  });

  it('should post to subscriptions on button click', () => {
    const wrapper = shallow(<PremiumMini userIsEligibleForTrial />);
    wrapper.find('button').simulate('click');
    expect(request.post.mock.calls[0][0].url).toBe(`${process.env.DEFAULT_URL}/subscriptions`);
  });
});
