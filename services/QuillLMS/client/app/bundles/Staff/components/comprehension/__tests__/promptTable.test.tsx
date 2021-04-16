import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';

import PromptTable from '../activitySessions/promptTable';

jest.mock('string-strip-html', () => ({
  default: jest.fn()
}));

const mockProps = {
  activity: {
    title: 'Test Activity',
    name: 'Test Name',
    scored_level: '7',
    target_level: 7,
    prompts: [{id: 1, conjunction: 'because', text: 'test', max_attempts: 5, max_attempts_feedback: 'good try!'}]
  },
  prompt: {
    attempts: {
      1: [{
        entry: '',
        feedback_text: '',
        feedback_type: '',
        optimal: false
      }]
    },
    conjunction: 'because',
    text: 'test',
    max_attempts: 5,
    max_attempts_feedback: 'good try!'
  },
  showHeader: false
}

describe('PromptTable component', () => {
  const container = shallow(<PromptTable {...mockProps} />);

  it('should render PromptTable', () => {
    expect(container).toMatchSnapshot();
  });
});
