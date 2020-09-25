import * as React from 'react';
import { shallow } from 'enzyme';

import EditOrDeleteTurkSession from '../gatherResponses/editOrDeleteTurkSession';
import 'whatwg-fetch';

const csrfToken = 'mocked-csrf-token';
document.head.innerHTML = `<meta name="csrf-token" content="${csrfToken}">`;

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
