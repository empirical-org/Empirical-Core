import React from 'react';
import CSVDownloadForProgressReport from 'bundles/HelloWorld/components/progress_reports/csv_download_for_progress_report';
import ItemDropdown from 'bundles/admin_dashboard/components/item_dropdown';
import LoadingSpinner from 'bundles/HelloWorld/components/shared/loading_indicator';
import ActivityScoresTable from 'bundles/admin_dashboard/components/activity_scores_table';
import {
  switchClassroom,
  switchSchool,
  getDistrictActivityScores,
} from 'actions/district_activity_scores';
import { connect } from 'react-redux';

class DistrictActivityScores extends React.Component {
  componentDidMount() {
    const { getDistrictActivityScores, } = this.props;
    getDistrictActivityScores();
  }

  render() {
    const {
      selectedClassroom,
      selectedSchool,
      loading,
      csvData,
      schoolNames,
      classroomNames,
      switchClassroom,
      switchSchool,
      filteredClassroomsData,
    } = this.props;

    if (loading) {
      return <LoadingSpinner />;
    }
    return (
      <div className="activities-scores-by-classroom progress-reports-2018">
        <div className="meta-overview flex-row space-between">
          <div className="header-and-info">
            <h1>
              School Activity Scores
            </h1>
            <p>
              View the overall average score for each student in an active
              classroom.
            </p>
          </div>
          <div className="csv-and-how-we-grade">
            <CSVDownloadForProgressReport data={csvData} />
            <a className="how-we-grade" href="https://support.quill.org/activities-implementation/how-does-grading-work">
              How We Grade
              <i className="fa fa-long-arrow-right" />
            </a>
          </div>
        </div>
        <div className="dropdown-container">
          <ItemDropdown
            items={schoolNames}
            callback={switchSchool}
            selectedItem={selectedSchool}
          />
          <ItemDropdown
            items={classroomNames}
            callback={switchClassroom}
            selectedItem={selectedClassroom}
          />
        </div>
        <ActivityScoresTable data={filteredClassroomsData} />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    switchSchool: school => dispatch(switchSchool(school)),
    switchClassroom: classroom => dispatch(switchClassroom(classroom)),
    getDistrictActivityScores: () => dispatch(getDistrictActivityScores()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictActivityScores);
