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

  let!(:classroom_unit) do
    create(:classroom_unit,
      classroom_id: classroom.id,
      assigned_student_ids: [student.id],
      assign_on_join: false
    )
  end

  let!(:unit_activity) { create(:unit_activity, activity_id: activity.id)}

  let(:activity_session) do
    create(:activity_session,
      classroom_unit_id: classroom_unit.id,
      activity_id: activity.id,
      user_id: student.id,
      state: 'finished'
    )
  end

  def unit_templates_have_a_corresponding_unit?(unit_template_ids)
    UnitTemplate
      .where(id: unit_template_ids)
      .pluck(:name)
      .difference(Unit.pluck(:name))
      .none?
  end

  def units_have_corresponding_unit_activities?(unit_template_ids)
    UnitActivity
      .joins(:unit)
      .pluck(:name)
      .difference(UnitTemplate.where(id: unit_template_ids).pluck(:name))
      .none?
  end
end
