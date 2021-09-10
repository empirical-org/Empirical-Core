import * as React from 'react';
import { shallow } from 'enzyme';

import RightPanel from '../../../components/studentView/rightPanel';

const mockProps = {
  activities: [],
  activateStep: jest.fn(),
  activeStep: 1,
  closeReadTheDirectionsModal: jest.fn(),
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
  showReadTheDirectionsModal: false,
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
