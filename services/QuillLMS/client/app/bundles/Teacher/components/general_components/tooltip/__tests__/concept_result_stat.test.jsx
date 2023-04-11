import { shallow } from 'enzyme';
import React from 'react';

import ConceptResultStat from '../concept_result_stat';

describe('ConceptResultStat component', () => {

  it('should render name, number correct, and number incorrect', () => {
    const wrapper = shallow(
      <ConceptResultStat
        correct={7}
        incorrect={3}
        name='Cool Concept'
      />
    );
    expect(wrapper.text()).toMatch('Cool Concept');
    expect(wrapper.find('.correct-answer').text()).toMatch('7');
    expect(wrapper.find('.incorrect-answer').text()).toMatch('3');
  });

});
