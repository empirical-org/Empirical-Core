import * as React from 'react';
import { mount } from 'enzyme';

import DiagnosticMini from '../diagnostic_mini.tsx';

const diagnostics = [
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "ELL Diagnostic",
    activity_id: 447,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "ELL Diagnostic",
    activity_id: 447,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 5,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Starter Diagnostic",
    activity_id: 849,
    unit_id: 826268,
    classroom_id: 484134
  },
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Starter Diagnostic",
    activity_id: 849,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "Starter Diagnostic",
    activity_id: 849,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Intermediate Diagnostic",
    activity_id: 850,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "Intermediate Diagnostic",
    activity_id: 850,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Advanced Diagnostic",
    activity_id: 888,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "Advanced Diagnostic",
    activity_id: 888,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "AP® Writing Skills Survey",
    activity_id: 992,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "AP® Writing Skills Survey",
    activity_id: 992,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "ELL Starter Diagnostic",
    activity_id: 1161,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "ELL Starter Diagnostic",
    activity_id: 1161,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Pre-AP® Writing Skills Survey 1: Basics of Sentence Patterns",
    activity_id: 1229,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "Pre-AP® Writing Skills Survey 1: Basics of Sentence Patterns",
    activity_id: 1229,
    unit_id: 826269,
    classroom_id: 484135},
  {
    assigned_count: 5,
    completed_count: 0,
    classroom_name: "Quill Classroom Extremely Long So Long SUper Duper",
    activity_name: "Pre-AP® Writing Skills Survey 2: Tools for Sentence Expansion",
    activity_id: 1230,
    unit_id: 826269,
    classroom_id: 484134
  },
  {
    assigned_count: 0,
    completed_count: 0,
    classroom_name: "A New Class",
    activity_name: "Pre-AP® Writing Skills Survey 2: Tools for Sentence Expansion",
    activity_id: 1230,
    unit_id: 826269,
    classroom_id: 484135
  }
]

describe('DiagnosticMini component', () => {
  describe('on mobile', () => {

    it('should render when there are no diagnostics', () => {
      const wrapper = mount(<DiagnosticMini diagnostics={[]} onMobile={true} />)
      expect(wrapper).toMatchSnapshot();
    });

    it('should render when there are diagnostics', () => {
      const wrapper = mount(<DiagnosticMini diagnostics={diagnostics} onMobile={true} />)
      expect(wrapper).toMatchSnapshot();
    });

  })

  describe('not on mobile', () => {

    it('should render when there are no diagnostics', () => {
      const wrapper = mount(<DiagnosticMini diagnostics={[]} onMobile={false} />)
      expect(wrapper).toMatchSnapshot();
    });

    it('should render when there are diagnostics', () => {
      const wrapper = mount(<DiagnosticMini diagnostics={diagnostics} onMobile={false} />)
      expect(wrapper).toMatchSnapshot();
    });

  })

});
