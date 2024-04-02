import { shallow } from 'enzyme';
import React from 'react';

import StaticDisplaySubscription from '../static_display_subscription';

describe('StaticDisplaySubscription component', () => {
  it('should render disabled input with subscription type', () => {
    const wrapper = shallow(
      <StaticDisplaySubscription
        subscription={{
          subscriptionType: 'arbitrary',
          expiration: '2017/03/18',
        }}
      />
    );
    expect(wrapper.find('input.inactive').props().value).toBe('arbitrary');
  });

  it('should render disabled input with subscription type of basic if type is none or locked', () => {
    ['locked', 'none'].forEach((sub) => {
      const wrapper = shallow(
        <StaticDisplaySubscription
          subscription={{
            subscriptionType: sub,
          }}
        />
      );
      expect(wrapper.find('input.inactive').props().value).toBe('basic');
    });
  });

  it('should render get premium button if subscription is free, locked, or none', () => {
    ['free', 'locked', 'none'].forEach((sub) => {
      const wrapper = shallow(
        <StaticDisplaySubscription
          subscription={{
            subscriptionType: sub,
          }}
        />
      );
      expect(wrapper.find('button.get-premium').exists()).toBe(true);
    });
  });

  it('should not render subscription details if subscription is free, locked, or none', () => {
    ['free', 'locked', 'none'].forEach((sub) => {
      const wrapper = shallow(
        <StaticDisplaySubscription
          subscription={{
            subscriptionType: sub,
          }}
        />
      );
      // we don't need to expect anything because this will just throw
      // an error if subscription details renders (we're missing props)
    });
  });

  it('should not render get premium if subscription is not free, locked, or none', () => {
    const wrapper = shallow(
      <StaticDisplaySubscription
        subscription={{
          subscriptionType: 'not-free-locked-or-none',
          expiration: '2017/03/18',
        }}
      />
    );
    expect(wrapper.find('button.get-premium').exists()).toBe(false);
  });

  it('should render subscription details if subscription is not free, locked, or none', () => {
    const wrapper = shallow(
      <StaticDisplaySubscription
        subscription={{
          subscriptionType: 'not-free-locked-or-none',
          expiration: '2017/03/18',
        }}
      />
    );
    //
    expect(wrapper.text()).toMatch('Expires: 03/18/2017');
  });
});
