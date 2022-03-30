import * as React from 'react';
import { mount } from 'enzyme';
import _ from 'underscore';
import _l from 'lodash';
import { CSVLink } from 'react-csv'

import { CSVDownloadForProgressReport } from '../../../components/progress_reports/csv_download_for_progress_report'

jest.mock('../../../components/modules/user_is_premium', () => jest.fn(() => true));

describe('ActivitySurvey Component', () => {
  const mockData = [
    ['Classroom Name', 'Student Name', 'School Name', 'Teacher Name', 'Average Score', 'Activity Count', 'Last Active'],
    ['Test Class', 'Jen Penn', 'Drag Rage Academy', 'Jane Fonda', '99%', 2, '2022-03-29 15:13:19']
  ];
  let component = mount(<CSVDownloadForProgressReport data={mockData} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
