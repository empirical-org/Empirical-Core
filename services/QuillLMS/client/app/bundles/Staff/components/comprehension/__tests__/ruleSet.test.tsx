import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import RuleSet from '../configureRegex/ruleSet';
import 'whatwg-fetch';

const mockProps = {
  match: {
    params: {
      activityId: '1'
    },
    isExact: true,
    path: '',
    url:''
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
  it('should render a DataTable component', () => {
    expect(container.find(DataTable).length).toEqual(1);
  });
  it('should render a row for each field', () => {
    container.find(DataTable).props().rows.map((row: any, i: number) => {
      expect(row.field).toEqual(fields[i]);
    });
  });
});
