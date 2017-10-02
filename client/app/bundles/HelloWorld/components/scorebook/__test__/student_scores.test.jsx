import React from 'react';
import { shallow } from 'enzyme';

import StudentScores from '../student_scores.jsx';
import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip';

const data = {
  userId: 666,
  scores: [
    { activity_classification_id: '4', caId: '12345', name: 'Sentence Structure Diagnostic', percentage: '1', updated: '2016-09-30 00:05:50.361093', userId: '666', },
    { activity_classification_id: '4', caId: '12345', name: 'Sentence Structure Diagnostic', percentage: '1', updated: '2016-09-30 00:05:50.361093', userId: '666', }
  ],
};

describe('StudentScores component', () => {
  it('should as many Activity Icons as data.props.results, rounded up', () => {
    const wrapper = shallow(
      <StudentScores
        data={data}
        premium_state={'trial'}
      />);

    const numberOfResults = wrapper.instance().props.data.scores.length;
    expect(wrapper.find(ActivityIconWithTooltip).length).toEqual(numberOfResults);
  });
});
