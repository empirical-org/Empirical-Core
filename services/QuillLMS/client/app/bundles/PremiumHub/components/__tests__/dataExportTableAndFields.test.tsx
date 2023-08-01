import { shallow } from 'enzyme';
import * as React from 'react';

import { DataExportTableAndFields } from '../dataExportTableAndFields';

describe('DataExportTableAndFields component', () => {
  const mockProps = {
    queryKey: 'data-export',
    selectedGrades: [],
    selectedSchoolIds: [],
    selectedTeacherIds: [],
    selectedClassroomIds: [],
    selectedTimeframe: '',
    customTimeframeStart: null,
    customTimeframeEnd: null,
    adminId: 12345,
    downloadStarted: false,
    handleToggleDownloadStarted: jest.fn(),
    handleSetReportData: jest.fn()
  }
  const component = shallow(<DataExportTableAndFields {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
