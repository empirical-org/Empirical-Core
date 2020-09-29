import * as React from 'react';
import 'whatwg-fetch';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import ActivitySettings from '../configureSettings/activitySettings';

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
});
