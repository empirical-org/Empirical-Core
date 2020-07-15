import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import RuleSet from '../configureRegex/ruleSet';
import 'whatwg-fetch';

const mockProps = {
  match: {
    params: {
      activityId: '1',
      ruleSetId: '104'
    },
    isExact: true,
    path: '',
    url:'`https://comprehension-247816.appspot.com/api/activities/:activityId/rulesets/:ruleSetId.json/`'
  },
  history: createMemoryHistory(),
  location: createLocation('')
};

const fields = [
  'Name',
  'Feedback',
  'Because',
  'But',
  'So'
];

describe('RuleSet component', () => {
  const container = shallow(<RuleSet {...mockProps} />);

  it('should render RuleSet', () => {
    expect(container).toMatchSnapshot();
  });
});
