import React from 'react';
import { shallow } from 'enzyme';

import ConceptResultStat from '../concept_result_stat';

describe('ConceptResultStat component', () => {

  it('should render name, number correct, and number incorrect', () => {
    const wrapper = shallow(
      <ConceptResultStat
        name='Cool Concept'
        correct={7}
        incorrect={3}
      />
    );
    expect(wrapper.text()).toMatch('Cool Concept');
    expect(wrapper.find('.correct-answer').text()).toMatch('7');
    expect(wrapper.find('.incorrect-answer').text()).toMatch('3');
  });

});
