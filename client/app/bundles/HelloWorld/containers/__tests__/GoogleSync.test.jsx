import React from 'react';
import { shallow, mount } from 'enzyme';

import GoogleSync from '../GoogleSync.jsx';
import GoogleClassroomsList from '../../components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx'
import LoadingIndicator from '../../components/shared/loading_indicator.jsx'
import SyncSuccessModal from '../../components/google_classroom/google_classroom_sync/SyncSuccessModal.jsx'

describe('GoogleSync container', () => {

  describe('the loading indicator', () => {
    it('should render a loading indicator by default', () => {
        const wrapper = shallow(<GoogleSync />);
        expect(wrapper.find(LoadingIndicator).length).toBe(1);
    });

    it('should render a loading indicator if the state is loading', () => {
        const wrapper = shallow(<GoogleSync />);
        wrapper.setState({ loading: true });
        expect(wrapper.find(LoadingIndicator).length).toBe(1);
    });

    it('should not render a loading indicator if the state is not loading', () => {
        const wrapper = shallow(<GoogleSync />);
        wrapper.setState({ loading: false});
        expect(wrapper.find(LoadingIndicator).length).toBe(0);
    });
  })

  describe('the GoogleClassroomsList', ()=>{

    describe('should not render when', () => {

      it('should not render when the state is loading', () => {
          const wrapper = shallow(<GoogleSync />);
          wrapper.setState({ loading: true,  classrooms: [1] });
          expect(wrapper.find(GoogleClassroomsList).length).toBe(0);
      });

      it('when there are no classrooms', () => {
        const wrapper = shallow(<GoogleSync />);
        wrapper.setState({loading: false, classrooms: []});
        expect(wrapper.find(GoogleClassroomsList).length).toBe(0);
      })

    })

    it('it should render when the state is not loading and there are classrooms', () => {
      const wrapper = shallow(<GoogleSync />);
      wrapper.setState({ loading: false, classrooms: [1]  });
      expect(wrapper.find(GoogleClassroomsList).length).toBe(1);
    })
  })

  describe('the no classrooms notice', ()=> {
    it('renders if loading is false and there no classrooms', ()=>{
      const wrapper = shallow(<GoogleSync />);
      wrapper.setState({loading: false, classrooms: []});
      expect(wrapper.find(GoogleClassroomsList).length).toBe(0);
    })
  })

});
