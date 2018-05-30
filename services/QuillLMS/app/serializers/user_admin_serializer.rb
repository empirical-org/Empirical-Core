class UserAdminSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :teachers, :valid_subscription, :schools


  def teachers
    teacher_ids = User.find(object.id).admins_teachers
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map{|t| Admin::TeacherSerializer.new(t, root: false) }
  end

  def valid_subscription
    admin = User.find(object.id)
    admin.subscription_is_valid? && admin&.subscription&.school_subscription?
  end

  def schools
    admin = User.find(object.id)
    admin.administered_schools.select("schools.id, schools.nces_id, schools.name")
  end

end
