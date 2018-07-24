require 'rails_helper'

describe ProgressReports::DistrictConceptReports do
  describe '#results' do
    let!(:school) { create(:school) }
    let!(:teacher) { create(:teacher) }
    let!(:admin) { create(:admin) }
    let!(:classroom) { create(:classroom) }
    let!(:student) { create(:student) }
    let!(:schools_admins) { create(:schools_admins, school: school, user: admin) }
    let!(:schools_users) { create(:schools_users, school: school, user: teacher) }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user: teacher, role: "owner", classroom: classroom) }
    let!(:classroom_activity) { create(:classroom_activity, classroom: classroom) }
    let!(:activity_session) { create(:activity_session, classroom_activity: classroom_activity, user_id: student.id) }
    let!(:concept_result) { create(:concept_result, activity_session: activity_session) }
    let(:subject) { described_class.new(admin.id) }

    it 'should return the correct results' do
      correct = activity_session.concept_results.select {|x| x.metadata["correct"] == 1 }.length 
      incorrect = (ConceptResult.count - correct)
      percentage = (correct/ConceptResult.count.to_f*100).floor.to_s
      expect(subject.results).to eq(
        [{
          school_name: school.name,
          teacher_name: teacher.name,
          classroom_name: classroom.name,
          student_name: student.name,
          correct: correct.to_s,
          incorrect: incorrect.to_s,
          percentage: percentage,
        }.stringify_keys]
      )
    end
  end
end