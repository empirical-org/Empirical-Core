# frozen_string_literal: true

class UserAdminSerializer < ApplicationSerializer
  attributes :id, :name, :email, :teachers, :valid_subscription, :schools
  type :user_admin

  def teachers
    teacher_ids = User.find(object.id).admins_teachers
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map { |teacher_data| Admin::TeacherSerializer.new(teacher_data).as_json(root: false) }
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
