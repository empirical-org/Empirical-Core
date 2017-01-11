shared_context 'Unit Assignments Variables' do

  let(:teacher) { FactoryGirl.create(:teacher) }
  let(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }
  let(:student) {FactoryGirl.create(:student)}
  let(:student1) {FactoryGirl.create(:student)}
  let(:student2) {FactoryGirl.create(:student)}
  let(:activity) {FactoryGirl.create(:activity)}
  let(:activity1) {FactoryGirl.create(:activity)}
  let(:activity2) {FactoryGirl.create(:activity)}
  let(:activity3) {FactoryGirl.create(:activity)}
  let(:activity4) {FactoryGirl.create(:activity)}
  let!(:unit_template1) { FactoryGirl.create(:unit_template, activities: [activity1] )}
  let!(:unit_template2) { FactoryGirl.create(:unit_template, activities: [activity2]) }
  let!(:unit_template3) { FactoryGirl.create(:unit_template, activities: [activity3]) }
  let!(:unit_template4) { FactoryGirl.create(:unit_template, activities: [activity4]) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity, activity_id: activity.id, classroom_id: classroom.id, unit_id: unit.id, assigned_student_ids: [student.id])}
  let(:activity_session) {FactoryGirl.create(:activity_session, classroom_activity_id: classroom_activity.id, activity_id: activity.id, user_id: student.id, state: 'finished')}

end
