import React from 'react';
import { shallow } from 'enzyme';

import GoogleSync from '../GoogleSync.jsx';
import GoogleClassroomsList from '../../components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx'
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

  describe('the GoogleClassroomsList', ()=>{
    it('should not render when the state is loading', () => {
        const wrapper = shallow(
          <GoogleSync />
        );
        wrapper.setState({ loading: true });
        expect(wrapper.find(GoogleClassroomsList).length).toBe(0);
    });

    it('should render when the state is not loading', () => {
        const wrapper = shallow(
          <GoogleSync />
        );
        wrapper.setState({ loading: false });
        expect(wrapper.find(GoogleClassroomsList).length).toBe(1);
    });
  })



});
