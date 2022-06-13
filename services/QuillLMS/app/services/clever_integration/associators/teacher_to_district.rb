# frozen_string_literal: true

module CleverIntegration::Associators::TeacherToDistrict

  def self.run(teacher, district)
    return if teacher.districts.include?(district)

    teacher.districts << district
    teacher
  end
end