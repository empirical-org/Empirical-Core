# frozen_string_literal: true

RSpec.shared_context 'Snapshots Option CTE' do
  include_context 'QuillBigQuery TestRunner Setup'

  let(:query_args) { [admin.id] }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:teachers) { classrooms.map(&:teachers).flatten }
  let(:classrooms_teachers) { teachers.map(&:classrooms_teachers).flatten }
  let(:schools_users) { classrooms_teachers.map(&:user).map { |teacher| create(:schools_users, user: teacher)} }
  let(:schools_admins) { schools_users.map { |schools_user| create(:schools_admins, school: schools_user.school, user: schools_user.user) } }
  let(:schools) { schools_admins.map(&:school).flatten.uniq }
  let(:users) { schools.map(&:users).flatten }
  let(:admin) { users.first }
end
