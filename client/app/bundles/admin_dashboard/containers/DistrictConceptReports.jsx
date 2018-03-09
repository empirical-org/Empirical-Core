import React from 'react';
import LoadingSpinner from 'bundles/HelloWorld/components/shared/loading_indicator';
import ConceptReports from 'bundles/admin_dashboard/components/concept_reports';
import {
  switchClassroom,
  switchSchool,
  switchTeacher,
  getDistrictConceptReports,
} from 'actions/district_concept_reports';
import { connect } from 'react-redux';

class DistrictConceptReports extends React.Component {
  componentDidMount() {
    const { getDistrictConceptReports, } = this.props;
    getDistrictConceptReports();
  }

  render() {
    const { loading, } = this.props;

    if (loading) {
      return <LoadingSpinner />;
    }
    return (<ConceptReports {...this.props} />);
  }
}

function getClassroomNames(classrooms, selectedSchool, selectTeacher) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  filtered = filterByTeacher(filtered, selectTeacher)
  let names = filtered.map(row => row.classroom_name);
  return ['All Classrooms', ...new Set(names)];
}

function getSchoolNames(classrooms) {
  let names = classrooms.map(row => row.school_name);
  return ['All Schools', ...new Set(names)];
}

function getTeacherNames(classrooms, selectedSchool) {
  let filtered = filterBySchool(classrooms, selectedSchool);
  let names = filtered.map(row => row.teacher_name);
  return ['All Teachers', ...new Set(names)];
}

function formatDataForCSV(data) {
  const csvData = []
  const csvHeader = [
    'Student',
    'Teacher',
    'Classroom',
    'School',
    'Correct',
    'Incorrect',
    'Success Rate',
  ];
  const csvRow = (row) => [
    row['student_name'],
    row['teacher_name'],
    row['classroom_name'],
    row['school_name'],
    row['correct'],
    row['incorrect'],
    row['percentage'],
  ];

  csvData.push(csvHeader);
  data.forEach(row => csvData.push(csvRow(row)));

  return csvData;
};

function filterBySchool(classrooms, selected) {
  if (selected !== 'All Schools') {
    return classrooms.filter(row => row.school_name === selected);
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
    return classrooms.filter(row => row.teacher_name === selected);
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
  let filteredConceptReportsData = filterClassrooms(
    state.district_concept_reports.conceptReportsData,
    state.district_concept_reports.selectedSchool,
    state.district_concept_reports.selectedTeacher,
    state.district_concept_reports.selectedClassroom
  );

  let teacherNames = getTeacherNames(
    state.district_concept_reports.conceptReportsData,
    state.district_concept_reports.selectedSchool
  );

  let classroomNames = getClassroomNames(
    state.district_concept_reports.conceptReportsData,
    state.district_concept_reports.selectedSchool,
    state.district_concept_reports.selectedTeacher,
  );

  return {
    loading: state.district_concept_reports.loading,
    errors: state.district_concept_reports.errors,
    selectedClassroom: state.district_concept_reports.selectedClassroom,
    selectedSchool: state.district_concept_reports.selectedSchool,
    selectedTeacher: state.district_concept_reports.selectedTeacher,
    conceptReportsData: state.district_concept_reports.conceptReportsData,
    filteredConceptReportsData,
    csvData: formatDataForCSV(filteredConceptReportsData),
    classroomNames,
    teacherNames,
    schoolNames: getSchoolNames(state.district_concept_reports.conceptReportsData),
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    switchSchool: school => dispatch(switchSchool(school)),
    switchClassroom: classroom => dispatch(switchClassroom(classroom)),
    switchTeacher: teacher => dispatch(switchTeacher(teacher)),
    getDistrictConceptReports: () => dispatch(getDistrictConceptReports()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictConceptReports);
