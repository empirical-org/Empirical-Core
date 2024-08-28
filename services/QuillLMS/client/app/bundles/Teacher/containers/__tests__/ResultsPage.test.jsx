import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ResultsPage from '../ResultsPage';
import ResultsIcon from '../../components/activities/results_page/results_icon.jsx';

const groupedKeyTargetSkillConcepts = [
  {
    name: 'Capitalizing Geographic Names',
    correct: 5,
    incorrect: 0,
  },
  {
    name: 'Capitalizing Dates',
    correct: 2,
    incorrect: 3,
  },
  {
    name: 'Capitalizing Holidays',
    correct: 1,
    incorrect: 2,
  },
];

describe('ResultsPage container', () => {
  const integrationPartnerName = 'Integration Partner';
  const integrationPartnerSessionId = 'blahblah';

  const sharedProps = {
    activityName: 'Cool Activity',
    activityType: 'type',
    percentage: 0.61,
    groupedKeyTargetSkillConcepts,
    numberOfQuestions: 13,
    numberOfCorrectQuestions: 8,
    activitySessionId: 1
  };

  test('renders correctly when showExactScore is true', () => {
    const { asFragment, } = render(<ResultsPage {...sharedProps} showExactScore={true} />);
    expect(asFragment()).toMatchSnapshot()
  });

  test('renders correctly when showExactScore is false', () => {
    const { asFragment, } = render(<ResultsPage {...sharedProps} showExactScore={false} />);
    expect(asFragment()).toMatchSnapshot()
  });

  test('renders correctly when activityType is diagnostic', () => {
    const { asFragment, } = render(<ResultsPage {...sharedProps} activityType='diagnostic' />);
    expect(asFragment()).toMatchSnapshot()
  });

  test('renders correctly when activityType is evidence', () => {
    const { asFragment, } = render(<ResultsPage {...sharedProps} activityType='evidence' />);
    expect(asFragment()).toMatchSnapshot()
  });

  test('renders the Keep practicing section when the percentage is below the proficiency threshold', () => {
    render(<ResultsPage {...sharedProps} percentage={0.5} />);
    expect(screen.getByRole('heading', { name: /keep practicing!/i })).toBeInTheDocument()
  })

  test('does not render the Keep practicing section when the percentage is above the proficiency threshold', () => {
    render(<ResultsPage {...sharedProps} percentage={1} />);
    expect(screen.queryByRole('heading', { name: /keep practicing!/i })).not.toBeInTheDocument()
  })

  test('renders log in button for anonymous', () => {
    render(<ResultsPage {...sharedProps} anonymous={true} />);
    expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/session/new');
  });

  test('renders back to activity list button for integration partner', () => {
    render(<ResultsPage {...sharedProps} integrationPartnerName={integrationPartnerName} integrationPartnerSessionId={integrationPartnerSessionId} />);
    expect(screen.getByRole('link', { name: 'Back to activity list' })).toHaveAttribute('href', `/${integrationPartnerName}?session_id=${integrationPartnerSessionId}`);
  });

});
