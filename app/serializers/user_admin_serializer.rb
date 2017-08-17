class UserAdminSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :teachers


  def teachers
    teacher_ids = User.find(object.id).admin_rights.includes(:users).map{|school| school.users.ids}.flatten
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map{|t| Admin::TeacherSerializer.new(t, root: false) }
  end

end
