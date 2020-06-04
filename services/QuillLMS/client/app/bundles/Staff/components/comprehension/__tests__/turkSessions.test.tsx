import * as React from 'react';
import { shallow } from 'enzyme';
import TurkSessions from '../gatherResponses/turkSessions';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import 'whatwg-fetch';

describe('TurkSessions component', () => {
  const mockProps = {
    match: { params: { activityId: 1 }}
  }
  const container = shallow(<TurkSessions {...mockProps} />);

  it('should render TurkSessions', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DataTable component', () => {
    expect(container.find(DataTable).length).toEqual(1);
  });
  it('should render a DatePicker component', () => {
    expect(container.find('withStyles(SingleDatePicker)').length).toEqual(1);
  });
});
