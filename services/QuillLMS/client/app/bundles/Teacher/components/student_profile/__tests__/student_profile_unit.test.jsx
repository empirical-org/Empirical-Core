import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { incompleteCategorizedActivities, completeCategorizedActivities, exactScoresData } from './test_data';

import { DataTable } from '../../../../Shared/index';
import StudentProfileUnit from '../student_profile_unit';

describe('StudentProfileUnit component', () => {

  it('should render incomplete activities', () => {
    const { asFragment, } = render(
      <StudentProfileUnit
        data={incompleteCategorizedActivities}
        unitName="Unit"
      />
    );
    expect(asFragment()).toMatchSnapshot()
  });

  it('should render completed activities when showExactScores is false', () => {
    const { asFragment, } = render(
      <StudentProfileUnit
        data={completeCategorizedActivities}
        showExactScores={false}
        unitName="Unit"
      />
    );
    expect(asFragment()).toMatchSnapshot()
  });

  it('should render completed activities when showExactScores is true', () => {
    const { asFragment, } = render(
      <StudentProfileUnit
        data={completeCategorizedActivities}
        exactScoresData={exactScoresData}
        showExactScores={true}
        unitName="Unit"
      />
    );
    expect(asFragment()).toMatchSnapshot()
  })
});
