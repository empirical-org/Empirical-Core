import { mount } from 'enzyme';
import * as React from 'react';

import { timeframes, grades, schools, } from './data'

import { SMALL, NEGATIVE, POSITIVE, MEDIUM, } from '../shared'
import SnapshotRanking from '../snapshotRanking';

describe('SnapshotRanking component', () => {
  const mockProps = {
    label: 'Sentences written',
    queryKey: 'sentences-written',
    searchCount: 1,
    selectedGrades: grades.map(g => g.value),
    selectedSchoolIds: schools.map(s => s.id),
    selectedTimeframe: timeframes[0].value,
    adminId: 1,
    customTimeframeStart: null,
    customTimeframeEnd: null,
    comingSoon: false,
    headers: ['Teacher', 'Activities completed']
  }

  describe ('when it is coming soon', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotRanking {...mockProps} comingSoon={true} />);

      expect(component).toMatchSnapshot();
    });
  })

  describe ('when there is no data ', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotRanking {...mockProps} />);

      expect(component).toMatchSnapshot();
    });
  })


});
