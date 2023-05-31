# frozen_string_literal: true

RSpec.shared_context 'Snapshots Period CTE' do
  include_context 'Snapshots CTE'

  let(:pg_query) { described_class.new(timeframe_start, timeframe_end, [school_ids]).query_to_run }

  let(:timeframe_start) { 1.week.ago.to_date }
  let(:timeframe_end) { 1.week.from_now.to_date }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:classrooms_teachers) { ClassroomsTeacher.where(classroom_id: classrooms.pluck(:id)) }
  let(:schools_users) { User.teacher.map { |teacher| create(:schools_users, user: teacher)} }
  let(:schools) { School.where(id: schools_users.pluck(:school_id)) }
  let(:school_ids) { schools.pluck(:id) }

  let(:period_query_cte_table_collections) { [classrooms, classrooms_teachers, schools_users, schools] }
  let(:cte_table_collections) { period_query_cte_table_collections }
end
