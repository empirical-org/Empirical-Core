import React from 'react';
import { connect } from 'react-redux';

import { getDistrictStandardsReports } from '../../../actions/district_standards_reports';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import { getTimeSpent } from '../../Teacher/helpers/studentReports';
import StandardsReports from '../components/standardsReports';
import { FULL, LIMITED, restrictedPage } from '../shared';

class DistrictStandardsReports extends React.Component {
  componentDidMount() {
    const { getDistrictStandardsReports, isFreemiumView } = this.props;
    getDistrictStandardsReports(isFreemiumView);
  }

  render() {
    const { loading, accessType, isFreemiumView, standardsReportsData } = this.props;
    const showFreemiumReport = accessType === LIMITED && isFreemiumView
    const dataPresent = standardsReportsData && standardsReportsData.length

    let content = <StandardsReports {...this.props} />

    if (showFreemiumReport && !dataPresent) {
      content = <span />
    } else if (showFreemiumReport && dataPresent) {
      content = (
        <div className="freemium-section">
          <div className='dark-divider' />
          <StandardsReports {...this.props} />
        </div>
      );
    } else if (accessType !== FULL) {
      content = restrictedPage
    } else if (loading) {
      content = <LoadingSpinner />
    }

    return (
      <div className="container gray-background-accommodate-footer">
        {content}
      </div>
    );
  }
}

function formatDataForCSV(data) {
  const csvData = [];
  const csvHeader = [
    'Standard Level',
    'Standard Name',
    'Students',
    'Proficient',
    'Activities',
    'Time Spent'
  ];
  const csvRow = row => [
    row.standard_level_name,
    row.name,
    row.total_student_count,
    row.proficient_count,
    row.total_activity_count,
    getTimeSpent(row.timespent),
  ];

  csvData.push(csvHeader);
  data && data.forEach(row => csvData.push(csvRow(row)));

  return csvData;
}

const mapStateToProps = (state) => {
  const filteredStandardsReportsData = state.district_standards_reports.standardsReportsData

  return {
    loading: state.district_standards_reports.loading,
    errors: state.district_standards_reports.errors,
    standardsReportsData: state.district_standards_reports.standardsReportsData,
    filteredStandardsReportsData,
    csvData: formatDataForCSV(filteredStandardsReportsData)
  };
};
const mapDispatchToProps = dispatch => ({
  getDistrictStandardsReports: (isFreemiumView) => dispatch(getDistrictStandardsReports(isFreemiumView)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DistrictStandardsReports);
