import React from 'react';
import { shallow, mount, mockClear, spy } from 'enzyme';
import $ from 'jquery'
import allActivities from './activity_search_and_select_data.js'

import ActivitySearchAndSelect from '../activity_search_and_select'


// import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
// window.process = processEnvMock;
jest.mock('jquery', () => {
  return {
    ajax: jest.fn()
  }
});

describe('ActivitySearchAndSelect component', () => {

  it('should render', () => {
    expect(shallow(<ActivitySearchAndSelect />)).toMatchSnapshot();
  });

  it('should trigger an ajax call upon calling searchRequest', ()=> {
    const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={()=>[]} />);
    wrapper.instance().searchRequest();
    expect($.ajax).toHaveBeenCalled();
  })

  describe('searchRequestSuccess', ()=> {
    const activities = []
    const data = {activities: allActivities()}
    const resultsPerPage = 50

    it('calculates a numberOfPages and maxPageNumber based on activity count', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={()=>[]} />);
      wrapper.instance().searchRequestSuccess(data);
      const properNumberOfPages = Math.ceil(data.activities.length / resultsPerPage)
      expect(wrapper.state().numberOfPages).toBe(properNumberOfPages)
      expect(wrapper.state().maxPageNumber).toBe(properNumberOfPages)
    })
  })

  describe('selectedFiltersAndFields', ()=> {
    const filters = [{field:"activity_category","alias":"Filter By Category",selected:null},
                     {field:"section","alias":"Filter by Standard",selected:null},
                     {field:"activity_classification","alias":"App",selected:null}]

    it('returns no selected filter if none are selected', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={()=>[]} />);
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([])
    })

    it('returns one selected filter if one is selected', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={()=>[]} />);
      filters[0].selected = 10;
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([{field: filters[0].field, selected: 10}])
    })

    it('returns multiple selected filter if multiple are selected', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={()=>[]} />);
      filters[0].selected = 10;
      filters[1].selected = 12;
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([{field: filters[0].field, selected: 10},{field: filters[1].field, selected: 12}])
    })
  })







});
