import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import ActivitySettings from '../configureSettings/activitySettings';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
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
}
const fields = [
  'Title', 
  'Development Stage', 
  'Passage Length', 
  'Because',
  'But',
  'So'
]

describe('ActivitySettings component', () => {
  const container = shallow(<ActivitySettings {...mockProps} />);

  it('should render ActivitySettings', () => {
    expect(container).toMatchSnapshot();
  });
  // it('should render a DataTable component', () => {
  //   expect(container.find(DataTable).length).toEqual(1);
  // });
  // it('should render a row for each field', () => {
  //   container.find(DataTable).props().rows.map((row, i) => {
  //     expect(row.field).toEqual(fields[i]);
  //   });
  // });
});
