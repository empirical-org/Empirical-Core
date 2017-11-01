shared_context 'Unit Assignments Variables' do
  let!(:author) { FactoryBot.create(:author) }
  let!(:teacher) { FactoryBot.create(:teacher) }
  let!(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }
  let!(:student) {FactoryBot.create(:student)}
  let!(:student1) {FactoryBot.create(:student)}
  let!(:student2) {FactoryBot.create(:student)}
  let!(:activity) {FactoryBot.create(:activity)}
  let!(:activity1) {FactoryBot.create(:activity)}
  let(:activity2) {FactoryBot.create(:activity)}
  let(:activity3) {FactoryBot.create(:activity)}
  let(:activity4) {FactoryBot.create(:activity)}
  let!(:unit_template1) { FactoryBot.create(:unit_template, activities: [activity1], author: author )}
  let!(:unit_template2) { FactoryBot.create(:unit_template, activities: [activity2], author: author) }
  let!(:unit_template3) { FactoryBot.create(:unit_template, activities: [activity3], author: author) }
  let!(:unit_template4) { FactoryBot.create(:unit_template, activities: [activity4], author: author) }
  let!(:classroom_activity) { FactoryBot.create(:classroom_activity, activity_id: activity.id, classroom_id: classroom.id, assigned_student_ids: [student.id], assign_on_join: false)}
  let(:activity_session) {FactoryBot.create(:activity_session, classroom_activity_id: classroom_activity.id, activity_id: activity.id, user_id: student.id, state: 'finished')}

  def unit_templates_have_a_corresponding_unit?(unit_template_ids)
    names_from_templates = UnitTemplate.where(id: unit_template_ids).pluck(:name)
    (Unit.all.map(&:name).flatten & names_from_templates).length == names_from_templates.length
  end

  def units_have_a_corresponding_classroom_activities?(unit_template_ids)
    names_from_templates = UnitTemplate.where(id: unit_template_ids).pluck(:name)
    (ClassroomActivity.all.map(&:unit).map(&:name).flatten & names_from_templates).length == names_from_templates.length
  end


end
