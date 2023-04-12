import { shallow } from 'enzyme';
import React from 'react';

import MissedLessonRow from '../missed_lesson_row.jsx';

describe('ClassReport component', () => {
  const wrapper = shallow(
    <MissedLessonRow
      name='Emilia Friedberg'
    />
  );

  it('returns the correct initial state', () => {
    expect(wrapper.state()).toEqual({showTooltip: false});
  });

  it('matches the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  });
})
