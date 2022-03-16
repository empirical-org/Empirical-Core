import * as React from 'react';
import { shallow } from 'enzyme';

import MaxAttemptsEditor from '../configureSettings/maxAttemptsEditor';
import { BECAUSE, FEEDBACK } from '../../../../../constants/evidence';

const mockProps = {
  conjunction: '',
  prompt: {
    conjunction: BECAUSE,
    text: '1',
    max_attempts: 5,
    max_attempts_feedback: FEEDBACK,
    first_strong_example: '',
    second_strong_example: ''
  },
  handleSetPrompt: jest.fn()
}

describe('MaxAttemptsEditor component', () => {
  const container = shallow(<MaxAttemptsEditor {...mockProps} />);

  it('should render MaxAttemptsEditor', () => {
    expect(container).toMatchSnapshot();
  });
});
