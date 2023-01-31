# frozen_string_literal: true

# look at Admin::Serializer - it passes the result of TeachersData into this serializer, not just an ActiveRecord::Relation of teachers
class Admin::TeacherSerializer < ApplicationSerializer
  include Rails.application.routes.url_helpers

  ADMIN = 'Admin'
  TEACHER = 'Teacher'

  attributes :id, :name, :email, :last_sign_in, :schools,
            :number_of_students,
            :number_of_activities_completed,
            :time_spent,
            :has_valid_subscription

  type :teacher

  def schools
    [object&.school].concat(object&.reload.administered_schools).compact.uniq.map do |school|
      school_hash = { name: school.name, id: school.id }
      school_hash[:role] = SchoolsAdmins.exists?(school: school, user: object) ? ADMIN : TEACHER
      school_hash
    end
  end

  def number_of_students
    x = object.try(:number_of_students)
    x.present? ? x : 0
  end

  def number_of_activities_completed
    x = object.try(:number_of_activities_completed)
    x.present? ? x.round : 0
  end

  def time_spent
    x = object.try(:time_spent)
    return "No time yet" if x.nil?

    mm, ss = x.divmod(60)
    ss2 = ss.floor
    hh, mm2 = mm.divmod(60)

    "#{hh} hours" #, #{ss2} seconds"
  end

end
