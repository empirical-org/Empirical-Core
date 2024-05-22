# frozen_string_literal: true

module Snapshots

  TOPX_QUERY_MAPPING = {
    'top-concepts-assigned' => Snapshots::TopConceptsAssignedQuery,
    'top-concepts-practiced' => Snapshots::TopConceptsPracticedQuery,
    'most-active-grades' => Snapshots::MostActiveGradesQuery,
    'most-active-schools' => Snapshots::MostActiveSchoolsQuery,
    'most-active-teachers' => Snapshots::MostActiveTeachersQuery,
    'most-assigned-activities' => Snapshots::MostAssignedActivitiesQuery,
    'most-completed-activities' => Snapshots::MostCompletedActivitiesQuery
  }

  COUNT_QUERY_MAPPING = {
    'active-classrooms' => Snapshots::ActiveClassroomsQuery,
    'active-students' => Snapshots::ActiveStudentsQuery,
    'active-teachers' => Snapshots::ActiveTeachersQuery,
    'activities-assigned' => Snapshots::ActivitiesAssignedQuery,
    'activities-completed' => Snapshots::ActivitiesCompletedQuery,
    'activity-packs-assigned' => Snapshots::ActivityPacksAssignedQuery,
    'activity-packs-completed' => Snapshots::ActivityPacksCompletedQuery,
    'average-active-classrooms-per-teacher' => Snapshots::AverageActiveClassroomsPerTeacherQuery,
    'average-activities-completed-per-student' => Snapshots::AverageActivitiesCompletedPerStudentQuery,
    'average-active-students-per-classroom' => Snapshots::AverageActiveStudentsPerClassroomQuery,
    'baseline-diagnostics-assigned' => Snapshots::BaselineDiagnosticsAssignedQuery,
    'baseline-diagnostics-completed' => Snapshots::BaselineDiagnosticsCompletedQuery,
    'classrooms-created' => Snapshots::ClassroomsCreatedQuery,
    'growth-diagnostics-assigned' => Snapshots::GrowthDiagnosticsAssignedQuery,
    'growth-diagnostics-completed' => Snapshots::GrowthDiagnosticsCompletedQuery,
    'sentences-written' => Snapshots::SentencesWrittenQuery,
    'student-accounts-created' => Snapshots::StudentAccountsCreatedQuery,
    'student-learning-hours' => Snapshots::StudentLearningHoursQuery,
    'teacher-accounts-created' => Snapshots::TeacherAccountsCreatedQuery
  }

  PREMIUM_REPORTS_QUERY_MAPPING = {
    'data-export' => Snapshots::DataExportQuery
  }

  PREMIUM_DOWNLOAD_REPORTS_QUERY_MAPPING = {
    'create_csv_report_download' => Snapshots::UntruncatedDataExportQuery
  }

end
