# frozen_string_literal: true

RSpec.shared_context 'Snapshots Period CTE' do
  include_context 'QuillBigQuery TestRunner Setup'

  let(:params) { [timeframe_start, timeframe_end, school_ids, grades] }

  let(:timeframe_start) { 1.week.ago.to_date }
  let(:timeframe_end) { 1.week.from_now.to_date }
  let(:grades) { nil }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:teachers) { classrooms.map(&:teachers).flatten }
  let(:classrooms_teachers) { teachers.map(&:classrooms_teachers).flatten }
  let(:schools_users) { teachers.map { |teacher| create(:schools_users, user: teacher)} }
  let(:schools) { schools_users.map(&:school).flatten.uniq }
  let(:school_ids) { schools.pluck(:id) }

  let(:period_query_cte_records) { [classrooms, classrooms_teachers, schools_users, schools] }
  let(:cte_records) { period_query_cte_records }
end
