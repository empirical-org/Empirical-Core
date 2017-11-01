# require 'rails_helper'
# require 'benchmark'

# describe 'Scorebook' do

#   let!(:teacher) { FactoryBot.create(:user, role: 'teacher') }
#   let!(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }
#   let!(:student) { FactoryBot.create(:user, role: 'student', classcode: classroom.code) }
#   let!(:activity) { FactoryBot.create(:activity) }
#   let!(:activity_sessions) { FactoryBot.create_list(:activity_session, 200, user: student, activity: activity) }

#   let!(:concept) { FactoryBot.create(:concept) }

#   let!(:scorebook_query) { Scorebook::Query.new(teacher) }

#   before do
#     activity_sessions.map{ |as| FactoryBot.create_list(:concept_result, 30, concept: concept, activity_session: as) }
#   end

#   def subject
#     scorebook_query.query
#   end

#   it 'takes less than 1 sec' do
#     time = Benchmark.realtime{ subject }
#     expect(time).to be < 1
#   end


# end