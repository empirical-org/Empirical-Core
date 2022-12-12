# frozen_string_literal: true

class UserAdminSerializer < ApplicationSerializer
  attributes :id, :name, :email, :teachers, :schools, :associated_school
  type :user_admin

  def associated_school
    User.find(object.id).school
  end

  def teachers
    teacher_ids = User.find(object.id).admins_users
    teachers_data = TeachersData.run(teacher_ids)
    teachers_data.map { |teacher_data| Admin::TeacherSerializer.new(teacher_data).as_json(root: false) }
  end

  def schools
    admin = User.find(object.id)
    admin.administered_schools.select("schools.id, schools.nces_id, schools.name").sort_by(&:name)
  end

end
