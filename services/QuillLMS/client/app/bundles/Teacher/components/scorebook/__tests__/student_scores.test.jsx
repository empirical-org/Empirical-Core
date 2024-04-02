import { shallow } from 'enzyme';
import React from 'react';

import ActivityIconWithTooltip from '../../general_components/activity_icon_with_tooltip';
import { StudentScores } from '../student_scores.jsx';

const data = {
  userId: 666,
  classroomId: 42,
  scores: [
    { activity_classification_id: '4', caId: '12345', name: 'Sentence Structure Diagnostic', percentage: '1', updated: '2016-09-30 00:05:50.361093', userId: '666', },
    { activity_classification_id: '4', caId: '12345', name: 'Sentence Structure Diagnostic', percentage: '1', updated: '2016-09-30 00:05:50.361093', userId: '666', }
  ],
};

describe('StudentScores component', () => {
  const wrapper = shallow(
    <StudentScores
      data={data}
      premium_state='trial'
    />);

  it('should have as many Activity Icons as data.props.results, rounded up', () => {
    const numberOfResults = wrapper.props().children.length;
    expect(wrapper.find(ActivityIconWithTooltip).length).toEqual(numberOfResults);
  });

  it('should have a link to the list overview page', () => {
    expect(wrapper.find('.student-header a').prop('href')).toMatch('/teachers/progress_reports/student_overview?student_id=666&classroom_id=42');
  });
});
