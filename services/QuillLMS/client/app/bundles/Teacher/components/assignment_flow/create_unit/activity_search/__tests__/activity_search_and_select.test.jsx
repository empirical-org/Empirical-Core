import React from 'react';
import { shallow } from 'enzyme';
import request from 'request'

import allActivities from '../../../../../../../test_data/activity_search_and_select'
import ActivitySearchAndSelect from '../activity_search_and_select'
import requestMock from '../../../../../../../../__mocks__/request.js';
jest.mock('request')

const commaUsageThirdGradeFilters = [
  {
    "field": "activity_category",
    "alias": "Filter By Category",
    "options": [
      {
        "name": "All concepts",
        "id": "showAllId"
      }, {
        "id": 7,
        "name": "Comma Usage"
      }, {
        "id": 7,
        "name": "Comma Usage"
      }, {
        "id": 7,
        "name": "Comma Usage"
      }, {
        "id": 7,
        "name": "Comma Usage"
      }
    ],
    "selected": 7
  }, {
    "field": "section",
    "alias": "Filter by Standard",
    "options": [
      {
        "name": "All levels",
        "id": "showAllId"
      }, {
        "id": 9,
        "name": "3rd Grade CCSS"
      }, {
        "id": 9,
        "name": "3rd Grade CCSS"
      }, {
        "id": 9,
        "name": "3rd Grade CCSS"
      }, {
        "id": 9,
        "name": "3rd Grade CCSS"
      }
    ],
    "selected": 9
  }, {
    "field": "activity_classification",
    "alias": "App",
    "options": [
      {
        "alias": "Quill Grammar",
        "description": "Practice Mechanics",
        "key": "sentence",
        "id": 2
      }, {
        "alias": "Quill Grammar",
        "description": "Practice Mechanics",
        "key": "sentence",
        "id": 2
      }, {
        "alias": "Quill Proofreader",
        "description": "Fix Errors in Passages",
        "key": "passage",
        "id": 1
      }, {
        "alias": "Quill Proofreader",
        "description": "Fix Errors in Passages",
        "key": "passage",
        "id": 1
      }
    ],
    "selected": null
  }
]

let diagnosticActivity = () => [
  {
    "name": "Sentence Structure Diagnostic",
    "description": "Assess students on eight areas of sentence structure. Quill then recommends up to eight weeks of instruction based on the results.",
    "flags": "{production}",
    "id": 413,
    "uid": "fNAwNLJDkc2T8O5lBeJQwg",
    "anonymous_path": "/activity_sessions/anonymous?activity_id=-LKbzH_Er916zGjgHk5U",
    "activity_classification": {
      "alias": "Quill Diagnostic",
      "description": "Identify Learning Gaps",
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
    expect(shallow(<ActivitySearchAndSelect />)).toMatchSnapshot();
  });

  it('should trigger an ajax call upon calling searchRequest', () => {
    const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
    wrapper.instance().searchRequest();
    expect(request.get).toHaveBeenCalled();
  })

  describe('searchRequestSuccess', () => {
    const activities = []
    const data = {
      activities: allActivities()
    }
    const resultsPerPage = 25

    it('calculates a numberOfPages and maxPageNumber based on activity count', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
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
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({filters: filters})
      expect(wrapper.instance().selectedFiltersAndFields()).toEqual([])
    })

    it('returns one selected filter if one is selected', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
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
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
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

    const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);

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
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({viewableActivities})
      wrapper.instance().updateFilterOptionsAfterChange()
      expect(wrapper.state().filters.map((filter) => filter.options)).toEqual([
        [
          {
            "id": "showAllId",
            "name": "All concepts"
          }, {
            "id": 30,
            "name": "Diagnostics"
          }
        ],
        [
          {
            "id": "showAllId",
            "name": "All levels"
          }, {
            "id": 35,
            "name": "Diagnostic"
          }
        ],
        [
          {
            "alias": "Quill Diagnostic",
            "description": "Identify Learning Gaps",
            "id": 4,
            "key": "diagnostic"
          }
        ]
      ])
    })
  })

  describe('findFilterOptionsBasedOnActivities', () => {
    it('returns an array of availableOptions', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({viewableActivities: diagnosticActivity()})
      expect(wrapper.instance().findFilterOptionsBasedOnActivities()).toEqual({
        "activity_category": [
          {
            "id": "showAllId",
            "name": "All concepts"
          }, {
            "id": 30,
            "name": "Diagnostics"
          }
        ],
        "activity_classification": [
          {
            "alias": "Quill Diagnostic",
            "description": "Identify Learning Gaps",
            "id": 4,
            "key": "diagnostic"
          }
        ],
        "section": [
          {
            "id": "showAllId",
            "name": "All levels"
          }, {
            "id": 35,
            "name": "Diagnostic"
          }
        ]
      })
    })
  })

  describe('selectFilterOption', () => {
    it('sets the passed option id to selected on the passed field', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({viewableActivities: diagnosticActivity(), activitySearchResults: diagnosticActivity()})
      const filterField = wrapper.state().filters[0].field
      wrapper.instance().selectFilterOption(filterField, '1')
      expect(wrapper.state().filters[0].selected).toEqual('1')
    })
  })

  describe('activityContainsSearchTerm', () => {
    const withHola = {
      spanish: 'hello is hola'
    }
    const withoutHola = {
      french: 'hello is bonjour'
    }
    it('checks all of an activities downcased values and returns if the search query is a substring of it', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({searchQuery: 'hola'})
      expect(wrapper.instance().activityContainsSearchTerm(withHola)).toEqual(true)
      expect(wrapper.instance().activityContainsSearchTerm(withoutHola)).toEqual(false)
    })
  })

  describe('changeViewableActivities', () => {
    it('updates viewableActivities to match the selected filters', () => {
      const wrapper = shallow(<ActivitySearchAndSelect selectedActivities={() => []} />);
      wrapper.setState({activitySearchResults: allActivities(),  filters: commaUsageThirdGradeFilters})
      wrapper.instance().changeViewableActivities()
      expect(wrapper.state().viewableActivities.map((act)=>act.id)).toEqual([165, 180, 53, 55])
    })

  })

});
