import { shallow } from 'enzyme';
import React from 'react';

import ActivityDetails from '../activity_details';

describe('ActivityDetails component', () => {
  const baseData = { activity_classification_id: '4', caId: '12345', name: 'Sentence Structure Diagnostic', percentage: '1', updated: '2016-10-17 00:05:50.361093', userId: '666', scores: [{percentage: '0.5', completed_at: '2016-09-30 00:05:50.361093'}, {percentage: '1', completed_at: '2016-10-17 00:05:50.361093'}]};

  it('should render div with appropriate class name depending on presence of concept results', () => {
    const wrapperNoConcepts = shallow(<ActivityDetails data={baseData} />);
    const wrapperWithConcepts = shallow(<ActivityDetails
      data={
        Object.assign({}, baseData, { concept_results: ['not empty!'], })
      }
    />);
    expect(wrapperNoConcepts.find('.activity-details.no-concept-results').exists()).toBe(true);
    expect(wrapperWithConcepts.find('.activity-details').exists()).toBe(true);
    expect(wrapperWithConcepts.find('.activity-details.no-concept-results').exists()).toBe(false);
  });

  it('should render the objective', () => {
    const wrapper = shallow(<ActivityDetails
      data={Object.assign({}, baseData, { activity_description: 'Combine sentences to create 9 sentences that have an appositive phrase in the middle of the sentence.', concept_results: [{ metadata: null, description: 'Combine sentences to create 9 sentences that have an appositive phrase in the middle of the sentence.', name: null, completed_at: null, dueDate: '2016-11-04 00:00:00', }], })}
    />);
    expect(wrapper.find('.activity-detail-body').text()).toMatch('Objectives: Combine sentences to create 9 sentences that have an appositive phrase in the middle of the sentence.');
  });

  it('should not render completed date text if activity is not finished', () => {
    const wrapper = shallow(<ActivityDetails data={baseData} />);
    expect(wrapper.text()).not.toMatch('Completed:');
  });

  it('should render completed text if complete', () => {
    const wrapperWithCompletedAt = shallow(
      <ActivityDetails
        data={Object.assign({}, baseData, { concept_results: [{ metadata: { answer: 'When he makes a mistake, show him how to improve.', browser: 'Chrome', correct: 1, directions: 'Rewrite the sentence so that the gender or number is consistent.', os: 'Chromium OS', prompt: 'When he makes a mistake, show her how to improve.', questionUid: '-Jzw0qjO5owyFPUAwDJ8', questionUrl: 'https://grammar.quill.org/cms/concepts/-Jzw0qjP5tpJMplbm7j2/questions/-Jzw0qjO5owyFPUAwDJ8', wpm: 17, questionNumber: 1, }, description: 'Write eight sentences recognizing inappropriate shifts in pronoun number or gender.', name: 'Pronoun Shift: Singular', completed_at: '2017-03-31 15:34:27.043575', dueDate: null, }, { metadata: { answer: 'When my mom was in school, she would play jacks all the time.', browser: 'Chrome', correct: 1, directions: 'Rewrite the sentence, filling in the blank with an appropriate pronoun.', os: 'Chromium OS', prompt: 'When my mom was in school, _____ would play jacks all the time.', questionUid: '-Jzw0qjO5owyFPUAwDJA', questionUrl: 'https://grammar.quill.org/cms/concepts/-Jzw0qjP5tpJMplbm7j2/questions/-Jzw0qjO5owyFPUAwDJA', wpm: 11, questionNumber: 2, }, description: 'Write eight sentences recognizing inappropriate shifts in pronoun number or gender.', name: 'Pronoun Shift: Singular', completed_at: '2017-03-31 15:34:27.043575', dueDate: null, }], })}
      />
    );
    expect(wrapperWithCompletedAt.text()).toMatch('Completed:');
    expect(wrapperWithCompletedAt.text()).toMatch('October 17, 2016');
  });

  it('should render due date text if due', () => {
    const wrapper = shallow(
      <ActivityDetails
        data={Object.assign({}, baseData, {scores: [], dueDate: '2016-11-04 00:00:00', concept_results: [{ metadata: null, description: 'Combine sentences to create 9 sentences that have an appositive phrase in the middle of the sentence.', name: null, completed_at: null, }], })}
      />
    );
    expect(wrapper.text()).toMatch('Due:');
    expect(wrapper.text()).toMatch('November 4, 2016');
  });
});
