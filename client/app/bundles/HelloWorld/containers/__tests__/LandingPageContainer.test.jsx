import React from 'react';
import { shallow } from 'enzyme';

import LandingPageContainer from '../LandingPageContainer.jsx';

import $ from 'jquery'
import LandingPage from '../../components/progress_reports/landing_page.jsx'
import LoadingIndicator from '../../components/shared/loading_indicator.jsx'

jest.mock('jquery', () => {
  return {
    get: jest.fn()
  }
});

describe('LandingPageContainer container', () => {


  it('should return LoadingIndicator component if loading', () => {
    const wrapper = shallow(<LandingPageContainer />);
    wrapper.setState({loading: true});
    expect(wrapper.find(LoadingIndicator).exists()).toBe(true);
  });

  it('should return LandingPage with flag', () => {
    const wrapper = shallow(<LandingPageContainer />);
    wrapper.setState({flag: 'bosco', loading: false});
    expect(wrapper.find(LandingPage).exists()).toBe(true);
    expect(wrapper.find(LandingPage).props().flag).toBe('bosco');
  });

  it('should send get request on componentDidMount', () => {
    const wrapper = shallow(<LandingPageContainer />);
    wrapper.instance().componentDidMount();
    expect($.get.mock.calls).toHaveLength(1);
    expect($.get.mock.calls[0][0]).toBe('/current_user_json');
  });

});
