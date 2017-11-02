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







});
