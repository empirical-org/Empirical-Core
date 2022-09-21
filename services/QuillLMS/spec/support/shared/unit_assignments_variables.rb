# frozen_string_literal: true

shared_context 'Unit Assignments Variables' do
  let!(:author) { create(:author) }
  let!(:classroom) { create(:classroom)  }
  let!(:teacher) { classroom.owner}
  let!(:student) {create(:student)}
  let!(:student1) {create(:student)}
  let!(:student2) {create(:student)}
  let!(:activity) {create(:activity)}
  let!(:activity1) {create(:activity)}
  let(:activity2) {create(:activity)}
  let(:activity3) {create(:activity)}
  let(:activity4) {create(:activity)}
  let!(:unit_template1) { create(:unit_template, activities: [activity1], author: author )}
  let!(:unit_template2) { create(:unit_template, activities: [activity2], author: author) }
  let!(:unit_template3) { create(:unit_template, activities: [activity3], author: author) }
  let!(:unit_template4) { create(:unit_template, activities: [activity4], author: author) }
  let!(:classroom_unit) { create(:classroom_unit, classroom_id: classroom.id, assigned_student_ids: [student.id], assign_on_join: false)}
  let!(:unit_activity) { create(:unit_activity, activity_id: activity.id)}
  let(:activity_session) {create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user_id: student.id, state: 'finished')}

  def unit_templates_have_a_corresponding_unit?(unit_template_ids)
    names_from_templates = UnitTemplate.where(id: unit_template_ids).pluck(:name)
    (Unit.all.map(&:name).flatten & names_from_templates).length == names_from_templates.length
  end

  def units_have_corresponding_unit_activities?(unit_template_ids)
    names_from_templates = UnitTemplate.where(id: unit_template_ids).pluck(:name)
    (UnitActivity.all.map(&:unit).map(&:name).flatten & names_from_templates).length == names_from_templates.length
  end


end
