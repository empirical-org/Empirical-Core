# frozen_string_literal: true

# look at Admin::Serializer - it passes the result of TeachersData into this serializer, not just an ActiveRecord::Relation of teachers
class Admin::TeacherSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  ADMIN = 'Admin'
  TEACHER = 'Teacher'

  attributes :id, :name, :email, :last_sign_in, :schools, :admin_info,
            :number_of_students,
            :has_valid_subscription

  type :teacher

  def schools
    [object&.school].concat(object&.reload&.administered_schools).compact.uniq.map do |school|
      school_hash = { name: school.name, id: school.id }
      # checking for the existence of an actual school admin record here since a user with the admin role doesn't necessarily administer a school they belong to
      school_hash[:role] = SchoolsAdmins.exists?(school: school, user: object) ? ADMIN : TEACHER
      school_hash
    end
  end

  def number_of_students
    x = object.try(:number_of_students)
    x.present? ? x : 0
  end

end
