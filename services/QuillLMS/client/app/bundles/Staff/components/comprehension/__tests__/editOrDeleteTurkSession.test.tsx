import * as React from 'react';
import { shallow } from 'enzyme';
import EditOrDeleteTurkSession from '../gatherResponses/editOrDeleteTurkSession';
import 'whatwg-fetch';

describe('EditOrDeleteTurkSession component', () => {
  const mockProps = {
    activityID: 1, 
    closeModal: jest.fn(), 
    originalSessionDate: '2020-05-27T21:39:20Z', 
    turkSessionID: 3
  }
  const container = shallow(<EditOrDeleteTurkSession {...mockProps} />);

  it('should render EditOrDeleteTurkSession', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DatePicker component', () => {
    expect(container.find('withStyles(SingleDatePicker)').length).toEqual(1);
  });
});
