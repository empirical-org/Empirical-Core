import { shallow } from 'enzyme';
import * as React from 'react';

import { StandardsReportsTable } from '../standardsReportsTable';

describe('StandardsReportsTable component', () => {
  const component = shallow(<StandardsReportsTable data={[]} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
