import React from 'react'
import { shallow } from 'enzyme'
import $ from 'jquery'

import DiagnosticActivityPacks from '../diagnostic_activity_packs'
import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report'
import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import Units from '../../../assignment_flow/manage_units/units.jsx'

const units = [
  {
    "unit_name":"Diagnostic",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2017",
    "classroom_id":"43697",
    "activity_classification_id":"4",
    "classroom_activity_id":"391161",
    "unit_id":"47008",
    "array_length":null,
    "class_size":"28",
    "due_date":null,
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1475176557.78289",
    "classroom_activity_created_at":"1475176557.78868"
  },
  {
    "unit_name":"Diagnostic",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2019",
    "classroom_id":"43699",
    "activity_classification_id":"4",
    "classroom_activity_id":"391162",
    "unit_id":"47008",
    "array_length":null,
    "class_size":"26",
    "due_date":null,
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1475176557.78289",
    "classroom_activity_created_at":"1475176558.02794"
  },
  {
    "unit_name":"Diagnostic",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2018",
    "classroom_id":"43698",
    "activity_classification_id":"4",
    "classroom_activity_id":"391163",
    "unit_id":"47008",
    "array_length":null,
    "class_size":"44",
    "due_date":null,
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1475176557.78289",
    "classroom_activity_created_at":"1475176558.32899"
  },
  {
    "unit_name":"Diagnostic",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"Teacher",
    "classroom_id":"57126",
    "activity_classification_id":"4",
    "classroom_activity_id":"391646",
    "unit_id":"47038",
    "array_length":null,
    "class_size":"1",
    "due_date":null,
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1475193559.44499",
    "classroom_activity_created_at":"1475193559.45677"
  },
  {
    "unit_name":"Sentence Structure Review",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2019",
    "classroom_id":"43699",
    "activity_classification_id":"4",
    "classroom_activity_id":"1155573",
    "unit_id":"102824",
    "array_length":null,
    "class_size":"26",
    "due_date":"2017-04-22 00:00:00",
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1492787843.10426",
    "classroom_activity_created_at":"1492787843.12176"
  },
  {
    "unit_name":"Sentence Structure Review",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2017",
    "classroom_id":"43697",
    "activity_classification_id":"4",
    "classroom_activity_id":"1155574",
    "unit_id":"102824",
    "array_length":null,
    "class_size":"28",
    "due_date":"2017-04-22 00:00:00",
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1492787843.10426",
    "classroom_activity_created_at":"1492787843.99085"
  },
  {
    "unit_name":"Sentence Structure Review",
    "activity_name":"Sentence Structure Diagnostic",
    "class_name":"2018",
    "classroom_id":"43698",
    "activity_classification_id":"4",
    "classroom_activity_id":"1155575",
    "unit_id":"102824",
    "array_length":null,
    "class_size":"44",
    "due_date":"2017-04-22 00:00:00",
    "activity_id":"413",
    "activity_uid":"fNAwNLJDkc2T8O5lBeJQwg",
    "unit_created_at":"1492787843.10426",
    "classroom_activity_created_at":"1492787844.82182"
  }
];


describe('DiagnosticActivityPacks component', () => {
  it('initializes state with an empty array of units, loaded being false, and a blank string diagnosticStatus', () => {
    const wrapper = shallow(<DiagnosticActivityPacks />)

    expect(wrapper.state('units').length).toEqual(0)
    expect(wrapper.state('loaded')).toEqual(false)
    expect(wrapper.state('diagnosticStatus')).toEqual('')
  })

  describe('when displayUnits gets called', () => {
    const wrapper = shallow(<DiagnosticActivityPacks />)
    wrapper.instance().displayUnits(units)

    it('sets state with loaded true', () => {
      expect(wrapper.state('loaded')).toEqual(true)
    })

    it.skip('formats the data properly in state', () => {
      // TODO: write this test.
    })
  })

  it('renders a LoadingSpinner if loaded is false', () => {
    const wrapper = shallow(<DiagnosticActivityPacks />)
    expect(wrapper.find(LoadingSpinner)).toHaveLength(1)
  })

  it('renders an EmptyDiagnosticProgressReport if loaded is true and units.length == 0', () => {
    const wrapper = shallow(<DiagnosticActivityPacks />)
    wrapper.setState({loaded: true})
    expect(wrapper.find(EmptyDiagnosticProgressReport)).toHaveLength(1)
  })

  it('renders units if there is more than one unit', () => {
    const wrapper = shallow(<DiagnosticActivityPacks />)
    wrapper.setState({loaded: true, units})

    expect(wrapper.find(Units)).toHaveLength(1)
  })

})
