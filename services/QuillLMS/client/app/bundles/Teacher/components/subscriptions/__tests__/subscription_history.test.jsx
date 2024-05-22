import { mount } from 'enzyme';
import React from 'react';
import { stripHtml } from "string-strip-html";

import SubscriptionHistory from '../subscription_history';

const sharedProps = {
  authorityLevel: null,
  premiumCredits: [],
  subscriptions: []
}

jest.mock('string-strip-html', () => ({
  stripHtml: jest.fn(val => ({ result: val }))
}));

describe('SubscriptionHistory container', () => {

  it('should render when there is no subscription history', () => {
    const wrapper = mount(<SubscriptionHistory {...sharedProps} />);
    expect(wrapper).toMatchSnapshot()
  });

});
