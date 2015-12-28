class Admin::AdminSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :teachers


  def self.teachers
    teacher_ids = Admin.find(object.id).teacher_ids
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map{|t| Admin::TeacherSerializer.new(t, root: false) }
  end

end