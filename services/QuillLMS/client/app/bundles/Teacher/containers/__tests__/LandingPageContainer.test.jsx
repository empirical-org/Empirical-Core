import React from 'react';
import { shallow } from 'enzyme';
import $ from 'jquery'

import LandingPageContainer from '../LandingPageContainer.jsx';
import LandingPage from '../../components/progress_reports/landing_page.jsx'
import LoadingIndicator from '../../components/shared/loading_indicator.jsx'

// This is a mock. We want to simulate a flag we set elsewhere.
document.getElementById = () => { return { getAttribute: () => 'beta' } };

jest.mock('jquery', () => {
  return {
    get: jest.fn()
  }
});

describe('LandingPageContainer container', () => {

  it('should render LandingPage component', () => {
    const wrapper = shallow(<LandingPageContainer />);
    expect(wrapper.find(LandingPage).exists()).toBe(true);
    expect(wrapper.find(LandingPage).props().flag).toBe('beta');
  });

});
