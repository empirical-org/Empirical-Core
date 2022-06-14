# frozen_string_literal: true

# look at Admin::Serializer - it passes the result of TeachersData into this serializer, not just an ActiveRecord::Relation of teachers
class Admin::TeacherSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :school,
            :links,
            :number_of_students,
            :number_of_activities_completed,
            :time_spent

  def school
    object.try(:school).try(:name)
  end

  def links
    [
      { name: "Teacher Access", path: admin_sign_in_classroom_manager_user_path(object) },
      { name: "Premium Reports", path: admin_sign_in_progress_reports_user_path(object) },
    ]
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
