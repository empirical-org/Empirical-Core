# frozen_string_literal: true

RSpec.shared_context 'Snapshots Option CTE' do
  include_context 'Snapshots CTE'

  let(:params) { [admin.id] }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:classrooms_teachers) { ClassroomsTeacher.where(classroom_id: classrooms.pluck(:id)) }
  let(:schools_users) { User.teacher.map { |teacher| create(:schools_users, user: teacher)} }
  let(:schools_admins) { schools_users.map { |schools_user| create(:schools_admins, school: schools_user.school) } }
  let(:users) { User.all }
  let(:admin) { users.admin.first }

  let(:option_query_cte_records) { [classrooms, classrooms_teachers, schools_users, schools_admins, users] }

  let(:cte_records) { option_query_cte_records }
end
