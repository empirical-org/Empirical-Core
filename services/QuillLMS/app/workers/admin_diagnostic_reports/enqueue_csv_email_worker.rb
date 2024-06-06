# frozen_string_literal: true

module AdminDiagnosticReports
  class EnqueueCsvEmailWorker
    include Sidekiq::Worker

    BASE_REPORT_NAME = 'diagnostic_growth_report'
    OVERVIEW_REPORT_NAME = 'diagnostic_growth_report_overview'
    SKILL_REPORT_NAME = 'diagnostic_growth_report_skill'
    STUDENT_REPORT_NAME = 'diagnostic_growth_report_student'

    def perform(user_id)
      overview_payload = ConstructOverviewQueryPayload.run(user_id, BASE_REPORT_NAME, OVERVIEW_REPORT_NAME)
      skills_payload = ConstructSkillsQueryPayload.run(user_id, BASE_REPORT_NAME, SKILL_REPORT_NAME)
      students_payload = ConstructStudentsQueryPayload.run(user_id, BASE_REPORT_NAME, STUDENT_REPORT_NAME)

      SendCsvEmailWorker.perform_async(user_id, overview_payload, skills_payload, students_payload)
    end
  end
end
