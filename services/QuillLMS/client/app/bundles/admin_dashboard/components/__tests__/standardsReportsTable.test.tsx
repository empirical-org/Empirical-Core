import * as React from 'react';
import { shallow } from 'enzyme';

import { StandardsReportsTable } from '../standardsReportsTable';

describe('StandardsReportsTable component', () => {
  const component = shallow(<StandardsReportsTable data={[]} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
