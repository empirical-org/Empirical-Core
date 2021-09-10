import * as React from 'react';
import { shallow } from 'enzyme';

import Steps from '../../../components/studentView/steps';

const mockProps = {
  activities: [],
  activateStep: jest.fn(),
  activeStep: 1,
  closeReadTheDirectionsModal: jest.fn(),
  completeStep: jest.fn(),
  completedSteps: [],
  doneHighlighting: true,
  handleDoneReadingClick: jest.fn(),
  resetTimers: jest.fn(),
  session: {},
  showReadTheDirectionsModal: false,
  stepsHash: {},
  submitResponse: jest.fn()
};

describe('Steps component', () => {
  const container = shallow(<Steps {...mockProps} />);

  it('should render Steps', () => {
    expect(container).toMatchSnapshot();
  });
});
