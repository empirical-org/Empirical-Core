import * as React from 'react';
import { shallow } from 'enzyme';

import { activityOne } from './data'

import Steps from '../../../components/studentView/steps';

const mockProps = {
  activities: { currentActivity: activityOne },
  activateStep: jest.fn(),
  activeStep: 1,
  handleReadTheDirectionsButtonClick: jest.fn(),
  completeStep: jest.fn(),
  completedSteps: [],
  doneHighlighting: true,
  handleDoneReadingClick: jest.fn(),
  resetTimers: jest.fn(),
  session: {},
  showReadTheDirectionsButton: false,
  stepsHash: {},
  submitResponse: jest.fn()
};

describe('Steps component', () => {
  const container = shallow(<Steps {...mockProps} />);

  it('should render Steps', () => {
    expect(container).toMatchSnapshot();
  });
});
