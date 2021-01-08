import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';

import PromptTable from '../activitySessions/promptTable';

const mockProps = {
  activity: {
    prompts: [{id: 1}]
  },
  prompt: {
    attempts: {
      1: [{
        entry: '',
        feedback_text: '',
        feedback_type: '',
        optimal: false
      }]
    }
  },
  showHeader: {}
}

describe('PromptTable component', () => {
  const container = shallow(<PromptTable {...mockProps} />);

  it('should render PromptTable', () => {
    expect(container).toMatchSnapshot();
  });
});
