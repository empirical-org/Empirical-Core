import { mount } from 'enzyme';
import * as React from 'react';

import { timeframes, grades, schools, } from './data'

import { SMALL, NEGATIVE, POSITIVE, MEDIUM, } from '../shared'
import SnapshotCount from '../snapshotCount';

describe('SnapshotCount component', () => {
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
    comingSoon: false
  }

  const smallProps = {
    ...mockProps,
    size: SMALL
  }

  const mediumProps = {
    ...mockProps,
    size: MEDIUM
  }

  const positiveTrendData = {
    passedCount: 1000,
    passedChange: 50,
    passedChangeDirection: POSITIVE
  }

  const negativeTrendData = {
    passedCount: 1000,
    passedChange: 50,
    passedChangeDirection: NEGATIVE
  }

  describe('size small', () => {
    describe ('when it is coming soon', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...smallProps} comingSoon={true} />);

        expect(component).toMatchSnapshot();
      });
    })

    describe ('when there is no data ', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...smallProps} />);

        expect(component).toMatchSnapshot();
      });
    })

    describe ('when there is data with a positive trend', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...smallProps} {...positiveTrendData} />);

        expect(component).toMatchSnapshot();
      });
    })

    describe ('when there is data with a negative trend', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...smallProps} {...negativeTrendData} />);

        expect(component).toMatchSnapshot();
      });
    })

  })

  describe('size medium', () => {
    it('should match snapshot', () => {
      const component = mount(<SnapshotCount {...mediumProps} comingSoon={true} />);

      expect(component).toMatchSnapshot();
    });

    describe ('when there is no data ', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...mediumProps} />);

        expect(component).toMatchSnapshot();
      });
    })

    describe ('when there is data with a positive trend', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...mediumProps} {...positiveTrendData} />);

        expect(component).toMatchSnapshot();
      });
    })

    describe ('when there is data with a negative trend', () => {
      it('should match snapshot', () => {
        const component = mount(<SnapshotCount {...mediumProps} {...negativeTrendData} />);

        expect(component).toMatchSnapshot();
      });
    })

  })

});
