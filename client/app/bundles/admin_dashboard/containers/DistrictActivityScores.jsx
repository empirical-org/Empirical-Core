import React from 'react';
import CSVDownloadForProgressReport from 'bundles/HelloWorld/components/progress_reports/csv_download_for_progress_report';
import ItemDropdown from 'bundles/admin_dashboard/components/item_dropdown';
import LoadingSpinner from 'bundles/HelloWorld/components/shared/loading_indicator';
import ActivityScoresTable from 'bundles/admin_dashboard/components/activity_scores_table';
import {
  switchClassroom,
  switchSchool,
  switchTeacher,
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
      loading,
      csvData,
      schoolNames,
      switchSchool,
      selectedSchool,
      teacherNames,
      switchTeacher,
      selectedTeacher,
      classroomNames,
      switchClassroom,
      selectedClassroom,
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
            items={teacherNames}
            callback={switchTeacher}
            selectedItem={selectedTeacher}
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

function getClassroomNames(classrooms, selectedSchool, selectTeacher) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  filtered = filterByTeacher(filtered, selectTeacher)
  let names = filtered.map(row => row.classroom_name);
  return ['All Classrooms', ...new Set(names)];
}

function getSchoolNames(classrooms) {
  let names = classrooms.map(row => row.schools_name);
  return ['All Schools', ...new Set(names)];
}

function getTeacherNames(classrooms, selectedSchool) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  let names = filtered.map(row => row.teachers_name);
  return ['All Teachers', ...new Set(names)];
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

function filterByTeacher(classrooms, selected) {
  if (selected !== 'All Teachers') {
    return classrooms.filter(row => row.teachers_name === selected);
  }

  return classrooms;
}

function filterClassrooms(
  classrooms,
  selectedSchool,
  selectedTeacher,
  selectedClassroom
) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  filtered     = filterByTeacher(filtered, selectedTeacher);
  filtered     = filterByClass(filtered, selectedClassroom);

  return filtered;
}

const mapStateToProps = (state) => {
  let filteredClassroomsData = filterClassrooms(
    state.classroomsData,
    state.selectedSchool,
    state.selectedTeacher,
    state.selectedClassroom
  );

  let teacherNames = getTeacherNames(
    state.classroomsData,
    state.selectedSchool
  );

  let classroomNames = getClassroomNames(
    state.classroomsData,
    state.selectedSchool,
    state.selectedTeacher,
  );

  return {
    loading: state.loading,
    errors: state.errors,
    selectedClassroom: state.selectedClassroom,
    selectedSchool: state.selectedSchool,
    selectedTeacher: state.selectedTeacher,
    classroomsData: state.classroomsData,
    filteredClassroomsData,
    csvData: formatDataForCSV(filteredClassroomsData),
    classroomNames,
    teacherNames,
    schoolNames: getSchoolNames(state.classroomsData),
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    switchSchool: school => dispatch(switchSchool(school)),
    switchClassroom: classroom => dispatch(switchClassroom(classroom)),
    switchTeacher: teacher => dispatch(switchTeacher(teacher)),
    getDistrictActivityScores: () => dispatch(getDistrictActivityScores()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictActivityScores);
