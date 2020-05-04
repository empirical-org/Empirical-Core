import * as React from 'react';
import { shallow } from 'enzyme';
import { DataTable } from 'quill-component-library/dist/componentLibrary';
import Activities from '../activities';
import 'whatwg-fetch';

describe('Activities component', () => {
  const container = shallow(<Activities />);

  it('should render Activities', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a DataTable component', () => {
    expect(container.find(DataTable).length).toEqual(1);
  });
});
