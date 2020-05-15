import * as React from 'react';
import { shallow } from 'enzyme';
import RuleSet from '../configureRegex/ruleSet';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import 'whatwg-fetch';

const fields = [
  'Description',
  'Feedback',
  'Because',
  'But',
  'So'
]

describe('RuleSet component', () => {
  const container = shallow(<RuleSet />);

  it('should render RuleSet', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DataTable component', () => {
    expect(container.find(DataTable).length).toEqual(1);
  });
  it('should render a row for each field', () => {
    container.find(DataTable).props().rows.map((row, i) => {
      expect(row.field).toEqual(fields[i]);
    });
  });
});
