import React from 'react';
import { shallow } from 'enzyme';

import EmptyDiagnosticProgressReport from '../empty_diagnostic_progress_report.jsx'

describe('EmptyDiagnosticProgressReport component', () => {

  it('should render a header', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="" />
    );
    expect(wrapper.find('h1')).toHaveLength(1)
  })

  it('should render an image', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="assigned" />
    );
    expect(wrapper.find('img')).toHaveLength(1)
  })

  it('should render two buttons', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="assigned" />
    );
    expect(wrapper.find('button')).toHaveLength(2)

  })

  it('should render two paragraphs', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="assigned" />
    );
    expect(wrapper.find('p')).toHaveLength(2)
  })


  describe('when "assigned" is passed as its status prop', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="assigned" />
    );

    it('should render its first button with the expected text', () => {
      const expectedText = 'Learn More About Diagnostic Reports'
      expect(wrapper.find('button').first().text()).toEqual(expectedText)
    })

    it('should render its second button with the expected text', () => {
      const expectedText = 'My Activity Packs'
      expect(wrapper.find('button').last().text()).toEqual(expectedText)
    })

    it('should render paragraphs with the expected text', () => {
      const expectedTextOne = "You have successfully assigned a diagnostic to your students."
      const expectedTextTwo = "Once a student completes the activity, you can return to this page to see your reports. In the meantime, you can learn more about Diagnostic Reports."
      expect(wrapper.find('p').first().text()).toEqual(expectedTextOne)
      expect(wrapper.find('p').last().text()).toEqual(expectedTextTwo)
    })

  })

  describe('when "unassigned" is passed as its status prop', () => {
    const wrapper = shallow(
      <EmptyDiagnosticProgressReport status="unassigned" />
    );

    it('should render its first button with the expected text', () => {
      const expectedText = 'Assign Entry Diagnostic'
      expect(wrapper.find('button').first().text()).toEqual(expectedText)
    })

    it('should render its second button with the expected text', () => {
      const expectedText = 'Learn More'
      expect(wrapper.find('button').last().text()).toEqual(expectedText)
    })

    it('should render paragraphs with the expected text', () => {
      const expectedTextOne = "Hi! This is where your students' diagnostic reports are stored, but it's empty at the moment since you have not yet assigned a diagnostic."
      const expectedTextTwo = "Let's assign your first diagnostic."
      expect(wrapper.find('p').first().text()).toEqual(expectedTextOne)
      expect(wrapper.find('p').last().text()).toEqual(expectedTextTwo)
    })

  })

})
