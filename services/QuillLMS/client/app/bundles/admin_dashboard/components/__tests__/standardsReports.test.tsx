import * as React from 'react';
import { shallow } from 'enzyme';

import { StandardsReports } from '../standardsReports';

describe('StandardsReports component', () => {
  const mockProps = {
    csvData: [],
    filteredStandardsReportsData: [],
  }
  const component = shallow(<StandardsReports {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
