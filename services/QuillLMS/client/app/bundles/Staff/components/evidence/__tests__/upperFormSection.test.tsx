import * as React from 'react';
import { shallow } from 'enzyme';

import UpperFormSection from '../configureSettings/upperFormSection';

const mockProps = {
  activity: {},
  activityTitle: '',
  activityNotes: '',
  activityFlag: {},
  errors: [],
  formErrorsPresent: false,
  handleSetActivityFlag: jest.fn(),
  handleSetActivityNotes: jest.fn(),
  handleSetActivityTitle: jest.fn(),
  handleSubmitActivity: jest.fn(),
  parentActivityId: 1,
  requestErrors: [],
  showErrorsContainer: false
}

describe('UpperFormSection component', () => {
  const container = shallow(<UpperFormSection {...mockProps} />);

  it('should render UpperFormSection', () => {
    expect(container).toMatchSnapshot();
  });
});
