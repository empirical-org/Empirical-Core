# frozen_string_literal: true
# require 'rails_helper'
#
# describe ProgressReports::DistrictActivityScores do
#   let!(:teacher) { create(:teacher) }
#   let!(:schools_admins) { create(:schools_admins, user_id: teacher.id) }
#   let!(:classroom) { create(:classroom) }
#   let!(:school) { create(:school) }
#   let!(:schools_user) { create(:schools_users, user_id: teacher.id, school: school) }
#   let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher) }
#   let!(:classroom_activity) { create(:classroom_activity, classroom: classroom) }
#   let!(:student) { create(:student) }
#   let!(:activity_session) { create(:activity_session, classroom_activity: classroom_activity, user: student) }
#   subject { described_class.new(schools_admins) }
#   let(:result) {
#     {
#       classroom_name: classroom.name,
#       student_id: student.id,
#       students_name: student.name,
#       teachers_name: teacher.name,
#       schools_name: school.name,
#       average_score: "",
#     }
#
#   }
#
#   it 'should return the right results' do
#     expect(subject.results).to eq([result])
#   end
# end
