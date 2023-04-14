import { shallow } from 'enzyme';
import * as React from 'react';

import { DropdownInput, TextEditor } from '../../../../Shared/index';
import RuleUniversalAttributes from '../configureRules/ruleUniversalAttributes';

const mockProps = {
  errors: {},
  setUniversalFeedback: jest.fn(),
  universalFeedback: [
    {
      id: 1,
      text: 'test universal feedback',
      highlights_attributes: [
        { id: 1, highlight_type: 'prompt', text: 'prompt highlight' },
        { id: 2, highlight_type: 'prompt', text: 'passage highlight' }
      ]
    },
    { id: 2, text: 'test universal feedback' }
  ]
};

describe('RuleUniversalAttributes component', () => {
  let container = shallow(<RuleUniversalAttributes {...mockProps} />);

  it('should render RuleUniversalAttributes', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render the appropriate form components for each feedback and highlight attribute', () => {
    // TextEditor: Feedback 1, Feedback 2, Feedback 1 Highlight 1, Feedback 1 Highlight 2 (4)
    // DropdownInput: Feedback 1 Highlight 1, Feedback 1 Highlight 2 (2)
    expect(container.find(TextEditor).length).toEqual(4);
    expect(container.find(DropdownInput).length).toEqual(2);
  });
});
