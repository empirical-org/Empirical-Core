import React from 'react';
import {shallow, mount, mockClear, spy} from 'enzyme';
import $ from 'jquery'
import allActivities from './activity_search_and_select_data.js'

import ActivitySearchAndSelect from '../activity_search_and_select'

// import processEnvMock from '../../../../../../../__mocks__/processEnvMock.js';
// window.process = processEnvMock;
jest.mock('jquery', () => {
  return {ajax: jest.fn()}
});


  let diagnosticActivity = ()=> [
    {
      "name": "Sentence Structure Diagnostic",
      "description": "Assess students on eight areas of sentence structure. Quill then recommends up to eight weeks of instruction based on the results.",
      "flags": "{production}",
      "id": 413,
      "uid": "fNAwNLJDkc2T8O5lBeJQwg",
      "anonymous_path": "/activity_sessions/anonymous?activity_id=413",
      "activity_classification": {
        "alias": "Quill Diagnostic",
        "description": "Identify Learning Gaps",
        "gray_image_class": "icon-diagnostic-gray",
        "key": "diagnostic",
        "id": 4
      },
      "activity_category": {
        "id": 30,
        "name": "Diagnostics"
      },
      "activity_category_name": "Diagnostics",
      "activity_category_id": 30,
      "section": {
        "id": 35,
        "name": "Diagnostic"
      },
      "section_name": "Diagnostic"
    }
  ]

describe('ActivitySearchAndSelect component', () => {

  it('should render', () => {
    expect(shallow(<ActivitySearchAndSelect/>)).toMatchSnapshot();
  });

  it('should trigger an ajax call upon calling searchRequest', () => {
    const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
    wrapper.instance().searchRequest();
    expect($.ajax).toHaveBeenCalled();
  })

  describe('searchRequestSuccess', () => {
    const activities = []
    const data = {
      activities: allActivities()
    }
    const resultsPerPage = 50

    it('calculates a numberOfPages and maxPageNumber based on activity count', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      wrapper.instance().searchRequestSuccess(data);
      const properNumberOfPages = Math.ceil(data.activities.length / resultsPerPage)
      expect(wrapper.state().numberOfPages).toBe(properNumberOfPages)
      expect(wrapper.state().maxPageNumber).toBe(properNumberOfPages)
    })
  })

  describe('selectedFiltersAndFields', () => {
    const filters = [
      {
        field: "activity_category",
        "alias": "Filter By Category",
        selected: null
      }, {
        field: "section",
        "alias": "Filter by Standard",
        selected: null
      }, {
        field: "activity_classification",
        "alias": "App",
        selected: null
      }
    ]

    it('returns no selected filter if none are selected', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([])
    })

    it('returns one selected filter if one is selected', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      filters[0].selected = 10;
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([
        {
          field: filters[0].field,
          selected: 10
        }
      ])
    })

    it('returns multiple selected filter if multiple are selected', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      filters[0].selected = 10;
      filters[1].selected = 12;
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([
        {
          field: filters[0].field,
          selected: 10
        }, {
          field: filters[1].field,
          selected: 12
        }
      ])
    })
  })

  describe('clearFilters', () => {

    const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);

    it('clears the selections from all filters', () => {
      const originalFilters = wrapper.state().filters
      const newFilters = JSON.parse(JSON.stringify(originalFilters))
      newFilters[0].selected = 'yep'
      wrapper.setState({filters: newFilters, activitySearchResults: allActivities()})
      wrapper.instance().clearFilters()
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([])
    })

  })


  describe('when updateFilterOptionsAfterChange is called', () => {
    const viewableActivities = diagnosticActivity()


    it('sets the filters to only show options from the viewableActivities', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      wrapper.setState({viewableActivities})
      wrapper.instance().updateFilterOptionsAfterChange()
      expect(wrapper.state().filters.map((filter) => filter.options)).toEqual([
        [
          {
            "id": "showAllId",
            "name": "All Categories"
          }, {
            "id": 30,
            "name": "Diagnostics"
          }
        ],
        [
          {
            "id": "showAllId",
            "name": "All Sections"
          }, {
            "id": 35,
            "name": "Diagnostic"
          }
        ],
        [
          {
            "alias": "Quill Diagnostic",
            "description": "Identify Learning Gaps",
            "gray_image_class": "icon-diagnostic-gray",
            "id": 4,
            "key": "diagnostic"
          }
        ]
      ])
    })
  })

  describe('_findFilterOptionsBasedOnActivities', ()=>{
    it ('returns an array of availableOptions', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      wrapper.setState({viewableActivities: diagnosticActivity()})
      expect(wrapper.instance()._findFilterOptionsBasedOnActivities()).toEqual({"activity_category": [{"id": "showAllId", "name": "All Categories"}, {"id": 30, "name": "Diagnostics"}], "activity_classification": [{"alias": "Quill Diagnostic", "description": "Identify Learning Gaps", "gray_image_class": "icon-diagnostic-gray", "id": 4, "key": "diagnostic"}], "section": [{"id": "showAllId", "name": "All Sections"}, {"id": 35, "name": "Diagnostic"}]})
    })
  })

  describe('selectFilterOption', ()=>{
    it ('sets the passed option id to selected on the passed field', ()=>{
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []}/>);
      wrapper.setState({viewableActivities: diagnosticActivity()})
      const filterField = wrapper.state().filters[0].field
      expect(wrapper.instance().selectFilterOption(filterField, '1')).toEqual('boo')
    })
  })




});
