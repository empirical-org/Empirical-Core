import React from 'react';
import { shallow } from 'enzyme';

import GoogleSync from '../GoogleSync.jsx';
import LoadingIndicator from '../../components/shared/loading_indicator.jsx'

describe('GoogleSync container', () => {

  describe('the loading indicator', () => {
    it('should render a loading indicator by default', () => {
        const wrapper = shallow(
          <GoogleSync />
        );
        expect(wrapper.find(LoadingIndicator).length).toBe(1);
    });
    
    it('should render a loading indicator if the state is loading', () => {
        const wrapper = shallow(
          <GoogleSync />
        );
        wrapper.setState({ loading: true });
        expect(wrapper.find(LoadingIndicator).length).toBe(1);
    });

    it('should not render a loading indicator if the state is not loading', () => {
        const wrapper = shallow(
          <GoogleSync />
        );
        wrapper.setState({ loading: false});
        expect(wrapper.find(LoadingIndicator).length).toBe(0);
    });
  })



});
