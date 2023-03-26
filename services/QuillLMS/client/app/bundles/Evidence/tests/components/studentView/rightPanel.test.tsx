import { shallow } from 'enzyme';
import * as React from 'react';

import { activityOne } from './data';

import RightPanel from '../../../components/studentView/rightPanel';

const mockProps = {
  activities: { currentActivity: activityOne },
  activateStep: jest.fn(),
  activeStep: 1,
  handleReadTheDirectionsButtonClick: jest.fn(),
  completeStep: jest.fn(),
  completedSteps: [],
  doneHighlighting: true,
  handleClickDoneHighlighting: jest.fn(),
  handleDoneReadingClick: jest.fn(),
  hasStartedPromptSteps: true,
  hasStartedReadPassageStep: true,
  onStartPromptSteps: jest.fn(),
  onStartReadPassage: jest.fn(),
  resetTimers: jest.fn(),
  scrolledToEndOfPassage: false,
  session: {},
  showReadTheDirectionsButton: false,
  stepsHash: {},
  studentHighlights: [],
  submitResponse: jest.fn(),
  toggleStudentHighlight: jest.fn(),
};

describe('RightPanel component', () => {
  const container = shallow(<RightPanel {...mockProps} />);

  it('should render RightPanel', () => {
    expect(container).toMatchSnapshot();
  });
});
