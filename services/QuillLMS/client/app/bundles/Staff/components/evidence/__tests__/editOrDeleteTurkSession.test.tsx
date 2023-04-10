import { shallow } from 'enzyme';
import * as React from 'react';
import 'whatwg-fetch';

import EditOrDeleteTurkSession from '../gatherResponses/editOrDeleteTurkSession';

jest.mock("react-query", () => ({
  useQueryClient: jest.fn(() => ({})),
}));

describe('EditOrDeleteTurkSession component', () => {
  const mockProps = {
    activityId: 1,
    closeModal: jest.fn(),
    setMessage: jest.fn(),
    originalSessionDate: '2020-05-27T21:39:20Z',
    turkSessionId: 3
  }
  const container = shallow(<EditOrDeleteTurkSession {...mockProps} />);

  it('should render EditOrDeleteTurkSession', () => {
    expect(container).toMatchSnapshot();
  });
  it('should render a DatePicker component', () => {
    expect(container.find('withStyles(SingleDatePicker)').length).toEqual(1);
  });
});
