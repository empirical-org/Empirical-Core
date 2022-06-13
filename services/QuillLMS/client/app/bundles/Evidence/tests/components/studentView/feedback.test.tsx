import * as React from 'react';
import { shallow } from 'enzyme';

import Feedback from '../../../components/studentView/feedback';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

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
