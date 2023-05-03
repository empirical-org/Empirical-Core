import { shallow } from 'enzyme';
import * as React from 'react';

import Feedback from '../../../components/studentView/feedback';

const mockProps = {
  lastSubmittedResponse: [{}],
  prompt: {},
  submittedResponses: [],
  customFeedback: null,
  customFeedbackKey: null,
  reportAProblem: jest.fn()
};

describe('Feedback component', () => {
  const container = shallow(<Feedback {...mockProps} />);

  it('should render Feedback', () => {
    expect(container).toMatchSnapshot();
  });
});
