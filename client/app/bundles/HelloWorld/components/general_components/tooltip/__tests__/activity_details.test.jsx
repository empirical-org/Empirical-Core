import React from 'react';
import { shallow } from 'enzyme';

import ActivityDetails from '../activity_details';

describe('ActivityDetails component', () => {

  const baseData = {
    activity: {
      description: 'I am a description.',
      classification: {
        alias: 'Activity Classification'
      }
    }
  }

  it('should render div with appropriate class name depending on presence of concept results', () => {
    const wrapperNoConcepts = shallow(<ActivityDetails data={baseData} />);
    const wrapperWithConcepts = shallow(<ActivityDetails data={
      Object.assign({}, baseData, {concept_results: ['not empty!']})
    } />);
    expect(wrapperNoConcepts.find('.activity-details.no-concept-results').exists()).toBe(true);
    expect(wrapperWithConcepts.find('.activity-details').exists()).toBe(true);
    expect(wrapperWithConcepts.find('.activity-details.no-concept-results').exists()).toBe(false);
  });

  it('should render the objective', () => {
    const wrapper = shallow(<ActivityDetails data={baseData} />);
    expect(wrapper.find('.activity-detail-body').text()).toBe('Objective: I am a description.');
  });

  it('should not render date text if activity is not finished and no due date exists', () => {
    const wrapper = shallow(<ActivityDetails data={baseData} />);
    expect(wrapper.text()).not.toMatch('Completed:');
    expect(wrapper.text()).not.toMatch('Due:');
  });

  it('should render completed text if complete', () => {
    const wrapperWithCompletedAt = shallow(
      <ActivityDetails
        data={Object.assign({}, baseData, {state: 'finished', completed_at: 'Some Date'})}
      />
    );
    const wrapperWithDueDateOrCompletedAtDate = shallow(
      <ActivityDetails
        data={Object.assign({}, baseData, {state: 'finished', due_date_or_completed_at_date: 'Some Date'})}
      />
    );
    expect(wrapperWithCompletedAt.text()).toMatch('Completed:');
    expect(wrapperWithCompletedAt.text()).toMatch('Some Date');
    expect(wrapperWithDueDateOrCompletedAtDate.text()).toMatch('Completed:');
    expect(wrapperWithDueDateOrCompletedAtDate.text()).toMatch('Some Date');
  });

  it('should render due date text if due', () => {
    const wrapper = shallow(
      <ActivityDetails
        data={Object.assign({}, baseData, {due_date: 'Some Date', due_date_or_completed_at_date: 'Some Date'})}
      />
    );
    expect(wrapper.text()).toMatch('Due:');
    expect(wrapper.text()).toMatch('Some Date');
  });

});
