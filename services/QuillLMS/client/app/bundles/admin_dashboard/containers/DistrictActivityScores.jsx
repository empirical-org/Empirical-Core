import React from 'react';
import { connect } from 'react-redux';
import {
    getDistrictActivityScores, switchClassroom,
    switchSchool,
    switchTeacher
} from '../../../actions/district_activity_scores';
import LoadingSpinner from '../../Teacher/components/shared/loading_indicator';
import { getTimeSpent } from '../../Teacher/helpers/studentReports';
import ActivityScores from '../components/activity_scores.tsx';
import { FULL, restrictedPage } from '../shared';

class DistrictActivityScores extends React.Component {
  componentDidMount() {
    const { getDistrictActivityScores, } = this.props;
    getDistrictActivityScores();
  }

  render() {
    const { loading, accessType, } = this.props;

    if (accessType !== FULL) {
      return restrictedPage
    }

    if (loading) {
      return <LoadingSpinner />;
    }
    return (<ActivityScores {...this.props} />);
  }
}

function getClassroomNames(classrooms, selectedSchool, selectTeacher) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  filtered = filterByTeacher(filtered, selectTeacher);
  const names = filtered.map(row => row.classroom_name);
  return ['All Classrooms', ...Array.from(new Set(names))];
}

function getSchoolNames(classrooms) {
  const names = classrooms.map(row => row.schools_name);
  return ['All Schools', ...Array.from(new Set(names))];
}

function getTeacherNames(classrooms, selectedSchool) {
  const filtered = filterBySchool(classrooms, selectedSchool);
  const names = filtered.map(row => row.teachers_name);
  return ['All Teachers', ...Array.from(new Set(names))];
}

function formatDataForCSV(data) {
  const csvData = [];
  const csvHeader = [
    'Classroom Name',
    'Student Name',
    'School Name',
    'Teacher Name',
    'Average Score',
    'Activity Count',
    'Time Spent',
    'Last Active'
  ];
  const csvRow = row => [
    row.classroom_name,
    row.students_name,
    row.schools_name,
    row.teachers_name,
    `${(row.average_score * 100).toString()}%`,
    row.activity_count,
    getTimeSpent(row.timespent),
    row.last_active
  ];

  csvData.push(csvHeader);
  data.forEach(row => csvData.push(csvRow(row)));

  return csvData;
}

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
  filtered = filterByTeacher(filtered, selectedTeacher);
  filtered = filterByClass(filtered, selectedClassroom);

  return filtered;
}

const mapStateToProps = (state) => {
  const filteredClassroomsData = filterClassrooms(
    state.district_activity_scores.classroomsData,
    state.district_activity_scores.selectedSchool,
    state.district_activity_scores.selectedTeacher,
    state.district_activity_scores.selectedClassroom
  );

  const teacherNames = getTeacherNames(
    state.district_activity_scores.classroomsData,
    state.district_activity_scores.selectedSchool
  );

  const classroomNames = getClassroomNames(
    state.district_activity_scores.classroomsData,
    state.district_activity_scores.selectedSchool,
    state.district_activity_scores.selectedTeacher,
  );

  return {
    loading: state.district_activity_scores.loading,
    errors: state.district_activity_scores.errors,
    selectedClassroom: state.district_activity_scores.selectedClassroom,
    selectedSchool: state.district_activity_scores.selectedSchool,
    selectedTeacher: state.district_activity_scores.selectedTeacher,
    classroomsData: state.district_activity_scores.classroomsData,
    filteredClassroomsData,
    csvData: formatDataForCSV(filteredClassroomsData),
    classroomNames,
    teacherNames,
    schoolNames: getSchoolNames(state.district_activity_scores.classroomsData),
  };
};
const mapDispatchToProps = dispatch => ({
  switchSchool: school => dispatch(switchSchool(school)),
  switchClassroom: classroom => dispatch(switchClassroom(classroom)),
  switchTeacher: teacher => dispatch(switchTeacher(teacher)),
  getDistrictActivityScores: () => dispatch(getDistrictActivityScores()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DistrictActivityScores);
