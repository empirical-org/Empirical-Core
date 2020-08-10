import * as React from 'react';
import { shallow } from 'enzyme';
import { createMemoryHistory, createLocation } from 'history';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import RuleSets from '../configureRegex/ruleSets';
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

describe('RuleSets component', () => {
  const container = shallow(<RuleSets {...mockProps} />);

  it('should render RuleSets', () => {
    expect(container).toMatchSnapshot();
  });
});
