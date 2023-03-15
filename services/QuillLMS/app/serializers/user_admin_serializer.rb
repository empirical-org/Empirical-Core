# frozen_string_literal: true

class UserAdminSerializer < ApplicationSerializer
  attributes :id, :name, :email, :teachers, :schools, :associated_school, :admin_approval_requests
  type :user_admin

  def associated_school
    User.find(object.id).school
  end

  def teachers
    teacher_ids = User.find(object.id).admins_user_ids
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map { |teacher_data| Admin::TeacherSerializer.new(teacher_data).as_json(root: false) }
  end

  def schools
    admin = User.find(object.id)
    admin.administered_schools.select(:id, :nces_id, :name).order(:name)
  end
end
