import React from 'react';
import { shallow } from 'enzyme';

import ConceptResultStats from '../concept_result_stats';

import ConceptResultStat from '../concept_result_stat.jsx'

describe('ConceptResultStats component', () => {

  const moreThanTenConcepts = [
    { name: 'A', correct: true },
    { name: 'B', correct: true },
    { name: 'C', correct: true },
    { name: 'D', correct: true },
    { name: 'E', correct: true },
    { name: 'F', correct: true },
    { name: 'G', correct: true },
    { name: 'H', correct: true },
    { name: 'I', correct: true },
    { name: 'J', correct: true },
    { name: 'K', correct: true }
  ];

  it('should render only up to 10 ConceptResultStat components + an information row', () => {
    const wrapper = shallow(
      <ConceptResultStats results={moreThanTenConcepts} />
    );
    expect(wrapper.find(ConceptResultStat).length).toBe(10);
    expect(wrapper.find('.tooltip-message').exists()).toBe(true);
  });

  it('should render ConceptResultStat components with the right props', () => {
    const wrapper = shallow(
      <ConceptResultStats
        results={[
          { name: 'B', correct: true },
          { name: 'B', correct: false },
          { name: 'B', correct: true },
          { name: 'B', correct: true },
          { name: 'B', correct: false },
        ]}
      />
    );
    expect(wrapper.find(ConceptResultStat).props().name).toBe('B');
    expect(wrapper.find(ConceptResultStat).props().correct).toBe(3);
    expect(wrapper.find(ConceptResultStat).props().incorrect).toBe(2);
  });

  it('should render the appropriate tooltip-message if there are 10 or fewer concepts', () => {
    const wrapper = shallow(
      <ConceptResultStats
        results={[
          { name: 'B', correct: true }
        ]}
      />
    );
    expect(wrapper.find('.tooltip-message').text()).toBe('Clicking on the activity icon loads the report.');
  });

  it('should render the appropriate tooltip-message if there more than 10 concepts', () => {
    const wrapper = shallow(
      <ConceptResultStats results={moreThanTenConcepts} />
    );
    expect(wrapper.find('.tooltip-message').text()).toBe('+ 1 additional concepts in the activity report.');
  });

  it('should sort results properly by total, then percentage, then name', () => {
    const wrapper = shallow(
      <ConceptResultStats results={[
        { name: 'B', correct: true },
        { name: 'B', correct: true },
        { name: 'B', correct: false },
        { name: 'A', correct: true },
        { name: 'A', correct: true },
        { name: 'A', correct: true },
        { name: 'A', correct: false },
        { name: 'Y', correct: true },
        { name: 'Y', correct: true },
        { name: 'X', correct: true },
        { name: 'X', correct: false },
      ]}
      />
    );
    expect(wrapper.find(ConceptResultStat).at(0).props().name).toBe('A');
    expect(wrapper.find(ConceptResultStat).at(1).props().name).toBe('B');
    expect(wrapper.find(ConceptResultStat).at(2).props().name).toBe('Y');
    expect(wrapper.find(ConceptResultStat).at(3).props().name).toBe('X');
  });

});
