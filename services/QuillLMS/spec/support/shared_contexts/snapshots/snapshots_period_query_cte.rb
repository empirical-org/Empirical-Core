# frozen_string_literal: true

RSpec.shared_context 'Snapshots Period CTE' do
  include_context 'QuillBigQuery TestRunner Setup'

  let(:query_args) do
    {
      timeframe_start: timeframe_start,
      timeframe_end: timeframe_end,
      school_ids: school_ids,
      grades: grades,
      teacher_ids: teacher_ids,
      classroom_ids: classroom_ids
    }
  end

  let(:timeframe_start) { 1.week.ago.to_date }
  let(:timeframe_end) { 1.week.from_now.to_date }
  let(:grades) { nil }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:teachers) { classrooms.map(&:teachers).flatten }
  let(:users) { teachers }
  let(:classrooms_teachers) { teachers.map(&:classrooms_teachers).flatten }
  let(:schools_users) { teachers.map { |teacher| create(:schools_users, user: teacher) } }
  let(:schools) { schools_users.map(&:school).flatten.uniq }
  let(:school_ids) { schools.pluck(:id) }
  let(:teacher_ids) { teachers.pluck(:id) }
  let(:classroom_ids) { classrooms.pluck(:id) }

  let(:period_query_cte_records) { [classrooms, classrooms_teachers, schools_users, schools, users] }
end
