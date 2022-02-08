# frozen_string_literal: true

module CleverIntegration::Importers::School
  def self.run(teacher, district_token)
    clever_teacher = CleverIntegration::Requesters.teacher(teacher.clever_id, district_token)
    clever_school = CleverIntegration::Requesters.school(clever_teacher.data.school, district_token)
    parsed_response = CleverIntegration::Parsers::School.run(clever_school)
    school = CleverIntegration::Creators::School.run(parsed_response)

    return unless school

    su = SchoolsUsers.find_or_initialize_by(user_id: teacher.id)
    su.update(school_id: school.id)
    school
  end
end
