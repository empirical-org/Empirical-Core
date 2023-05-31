# frozen_string_literal: true

RSpec.shared_context 'Snapshots Period CTE' do
  include_context 'Snapshots CTE'

  let(:pg_query) { described_class.new(timeframe_start, timeframe_end, [school_ids]).query }

  let(:timeframe_start) { 1.day.ago }
  let(:timeframe_end) { 1.day.from_now }

  let(:results) { QuillBigQuery::Runner.execute(bq_query) }

  let(:num_classrooms) { 2 }
  let(:classrooms) { create_list(:classroom, num_classrooms) }
  let(:classrooms_cte_query) { cte_query(classrooms) }

  let(:classrooms_teachers) { ClassroomsTeacher.where(classroom_id: classrooms.pluck(:id)) }
  let(:classrooms_teachers_cte_query) { cte_query(classrooms_teachers) }

  let(:schools_users) { User.teacher.map { |teacher| create(:schools_users, user: teacher)} }
  let(:schools_users_cte_query) { cte_query(schools_users) }

  let(:schools) { School.where(id: schools_users.pluck(:school_id)) }
  let(:schools_cte_query) { cte_query(School.all) }
  let(:school_ids) { schools.pluck(:id) }

  let(:snapshots_period_cte) do
    <<-SQL
      classrooms AS ( #{classrooms_cte_query} ),
      classrooms_teachers AS ( #{classrooms_teachers_cte_query} ),
      schools_users AS ( #{schools_users_cte_query} ),
      schools AS ( #{schools_cte_query} )
    SQL
  end

  let(:cte) { snapshots_period_cte }
end
