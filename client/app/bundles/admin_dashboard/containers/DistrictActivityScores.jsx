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

function filterClassroomNames(classrooms, selectedSchool) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  let names = filtered.map(row => row.classroom_name);
  return ['All Classrooms', ...new Set(names)];
}

function filterSchoolNames(classrooms) {
  let names = classrooms.map(row => row.schools_name);
  return ['All Schools', ...new Set(names)];
}

function formatDataForCSV(data) {
  const csvData = []
  const csvHeader = [
    'Classroom Name',
    'Student Name',
    'School Name',
    'Average Score',
    'Activity Count'
  ];
  const csvRow = (row) => [
    row['classroom_name'],
    row['students_name'],
    row['schools_name'],
    (row['average_score'] * 100).toString() + '%',
    row['activity_count'],
  ];

  csvData.push(csvHeader);
  data.forEach(row => csvData.push(csvRow(row)));

  return csvData;
};

function filterBySchool(classrooms, selected) {
  if (selected !== 'All Schools') {
    return classrooms.filter(row => row.schools_name === selected);
  }

  return classrooms;
}

function filterByClass(classrooms, selected) {
  if (selected !== 'All Classrooms') {
    return classrooms.filter(row => row.classroom_name === selected);
  }

  return classrooms;
}

function filterClassrooms(classrooms, selectedSchool, selectedClassroom) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  filtered     = filterByClass(filtered, selectedClassroom);

  return filtered;
}

const mapStateToProps = (state) => {
  let filteredClassroomsData = filterClassrooms(
    state.classroomsData,
    state.selectedSchool,
    state.selectedClassroom
  );

  let classroomNames = filterClassroomNames(
    state.classroomsData,
    state.selectedSchool
  );

  return {
    loading: state.loading,
    errors: state.errors,
    selectedClassroom: state.selectedClassroom,
    selectedSchool: state.selectedSchool,
    classroomsData: state.classroomsData,
    filteredClassroomsData,
    csvData: formatDataForCSV(filteredClassroomsData),
    classroomNames,
    schoolNames: filterSchoolNames(state.classroomsData),
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    switchSchool: school => dispatch(switchSchool(school)),
    switchClassroom: classroom => dispatch(switchClassroom(classroom)),
    getDistrictActivityScores: () => dispatch(getDistrictActivityScores()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictActivityScores);
