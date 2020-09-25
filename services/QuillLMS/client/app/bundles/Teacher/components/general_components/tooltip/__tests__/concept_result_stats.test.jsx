import React from 'react';
import { shallow } from 'enzyme';

import ConceptResultStats from '../concept_result_stats';
import ConceptResultStat from '../concept_result_stat.jsx'

describe('ConceptResultStats component', () => {

  const moreThanTenConcepts = [
    { name: 'A', metadata: { correct: 1, incorrect: 0 } },
    { name: 'B', metadata: { correct: 1, incorrect: 0 } },
    { name: 'C', metadata: { correct: 1, incorrect: 0 } },
    { name: 'D', metadata: { correct: 1, incorrect: 0 } },
    { name: 'E', metadata: { correct: 1, incorrect: 0 } },
    { name: 'F', metadata: { correct: 1, incorrect: 0 } },
    { name: 'G', metadata: { correct: 1, incorrect: 0 } },
    { name: 'H', metadata: { correct: 1, incorrect: 0 } },
    { name: 'I', metadata: { correct: 1, incorrect: 0 } },
    { name: 'J', metadata: { correct: 1, incorrect: 0 } },
    { name: 'K', metadata: { correct: 1, incorrect: 0 } }
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
          { name: 'B', metadata: { correct: 1, incorrect: 0 } },
          { name: 'B', metadata: { correct: 0, incorrect: 1 } },
          { name: 'B', metadata: { correct: 1, incorrect: 0 } },
          { name: 'B', metadata: { correct: 1, incorrect: 0 } },
          { name: 'B', metadata: { correct: 0, incorrect: 1 } },
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
          { name: 'B', metadata: { correct: 1, incorrect: 0 } }
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
        { name: 'B', metadata: { correct: 1, incorrect: 0 } },
        { name: 'B', metadata: { correct: 1, incorrect: 0 } },
        { name: 'B', metadata: { correct: 0, incorrect: 1 } },
        { name: 'A', metadata: { correct: 1, incorrect: 0 } },
        { name: 'A', metadata: { correct: 1, incorrect: 0 } },
        { name: 'A', metadata: { correct: 1, incorrect: 0 } },
        { name: 'A', metadata: { correct: 0, incorrect: 1 } },
        { name: 'Y', metadata: { correct: 1, incorrect: 0 } },
        { name: 'Y', metadata: { correct: 1, incorrect: 0 } },
        { name: 'X', metadata: { correct: 1, incorrect: 0 } },
        { name: 'X', metadata: { correct: 0, incorrect: 1 } },
      ]}
      />
    );
    expect(wrapper.find(ConceptResultStat).at(0).props().name).toBe('A');
    expect(wrapper.find(ConceptResultStat).at(1).props().name).toBe('B');
    expect(wrapper.find(ConceptResultStat).at(2).props().name).toBe('Y');
    expect(wrapper.find(ConceptResultStat).at(3).props().name).toBe('X');
  });

});
