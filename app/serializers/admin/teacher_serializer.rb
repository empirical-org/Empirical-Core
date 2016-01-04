# look at Admin::Serializer - it passes the result of TeachersData into this serializer, not just an ActiveRecord::Relation of teachers
class Admin::TeacherSerializer < ActiveModel::Serializer
  attributes :id, :name, :email,
            :classroom_manager_path,
            :progress_reports_path,
            :number_of_students,
            :number_of_questions_completed,
            :time_spent

  def classroom_manager_path
    admin_sign_in_classroom_manager_user_path(object)
  end

  def progress_reports_path
    admin_sign_in_progress_reports_user_path(object)
  end

  def time_spent
    x = object.time_spent
    mm, ss = x.divmod(60)
    ss2 = ss.floor
    hh, mm2 = mm.divmod(60)
    dd, hh2 = hh.divmod(24)

    "#{dd} days, #{hh2} hours, #{mm2} minutes, #{ss2} seconds"
  end

end
