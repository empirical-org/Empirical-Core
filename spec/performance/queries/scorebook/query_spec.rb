# require 'rails_helper'
# require 'benchmark'

# describe 'Scorebook' do

#   let!(:teacher) { create(:user, role: 'teacher') }
#   let!(:classroom) { create(:classroom, teacher: teacher) }
#   let!(:student) { create(:user, role: 'student', classcode: classroom.code) }
#   let!(:activity) { create(:activity) }
#   let!(:activity_sessions) { create_list(:activity_session, 200, user: student, activity: activity) }

#   let!(:concept) { create(:concept) }

#   let!(:scorebook_query) { Scorebook::Query.new(teacher) }

#   before do
#     activity_sessions.map{ |as| create_list(:concept_result, 30, concept: concept, activity_session: as) }
#   end

#   def subject
#     scorebook_query.query
#   end

#   it 'takes less than 1 sec' do
#     time = Benchmark.realtime{ subject }
#     expect(time).to be < 1
#   end


# end