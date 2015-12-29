# look at Admin::Serializer - it passes the result of TeachersData into this serializer, not just an ActiveRecord::Relation of teachers
class Admin::TeacherSerializer < ActiveModel::Serializer
  attributes :id, :name, :email,
            :classroom_manager_path,
            :progress_reports_path,
            :number_of_students,
            :number_of_questions_completed

  def classroom_manager_path
    admin_sign_in_classroom_manager_user_path(object)
  end

  def progress_reports_path
    admin_sign_in_progress_reports_user_path(object)
  end

end
