class Admin::TeacherSerializer < ActiveModel::Serializer
  attributes :id, :name, :email,
            :classroom_manager_path,
            :progress_reports_path

  def classroom_manager_path
    admin_sign_in_classroom_manager_user_path(object)
  end

  def progress_reports_path
    admin_sign_in_progress_reports_user_path(object)
  end

end
