import * as React from 'react'
import { mount } from 'enzyme'

import Stage2 from '../Stage2'

describe('Stage2 component', () => {
  const mockProps = {
    alreadyCompletedDiagnosticStudentNames: [],
    areAnyStudentsSelected: true,
    assignActivityDate: jest.fn(),
    classrooms: [],
    cleverLink: '',
    data: {},
    dueDates: {},
    errorMessage: null,
    fetchClassrooms: jest.fn(),
    finish: jest.fn(),
    isFromDiagnosticPath: false,
    lockedClassroomIds: [],
    notYetCompletedPreTestStudentNames: [],
    publishDates: {},
    restrictedActivity: false,
    selectedActivities: [{ id: 1, activity_classification: { alias: 'test' }, standard_level: { name: 'Adjectives' }, activity_category: { name: 'Quill Conenct' } }],
    showGradeLevelWarning: false,
    toggleActivitySelection: jest.fn(),
    toggleClassroomSelection: jest.fn(),
    toggleStudentSelection: jest.fn(),
    unitName: '',
    unitTemplateId: '1',
    updateUnitName: jest.fn(),
    user: {}
  }
  let wrapper = mount(<Stage2 {...mockProps} />)
  it('should render', () => {
    expect(wrapper).toMatchSnapshot()
  })
  it('buttonEnabled returns expected value', () => {
    expect(wrapper.instance().buttonEnabled()).toEqual(true)
    mockProps.errorMessage = { name: 'Please select a unit name.' }
    wrapper = mount(<Stage2 {...mockProps} />)
    expect(wrapper.instance().buttonEnabled()).toEqual(false)
  })
})
