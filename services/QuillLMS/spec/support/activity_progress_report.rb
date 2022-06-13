# frozen_string_literal: true

shared_context 'Activity Progress Report' do
  let(:teacher) { create :teacher_with_a_couple_classrooms_with_one_student_each }
  let(:classroom_one) { teacher.classrooms_i_teach.first }
  let(:classroom_two) { teacher.classrooms_i_teach.second }
  let!(:student_in_classroom_one) { classroom_one.students.first }
  let!(:student_in_classroom_two) { classroom_two.students.first }

  let(:activity) { create(:activity) }
  let(:unit_one) { create(:unit) }
  let(:unit_two) { create(:unit) }

  let(:unit_activity_one) { create(:unit_activity, activity: activity, unit: unit_one) }
  let(:unit_activity_two) { create(:unit_activity, activity: activity, unit: unit_two) }

  let(:classroom_unit_one) do
    create(:classroom_unit,
      classroom: classroom_one,
      unit: unit_one,
      assigned_student_ids: [student_in_classroom_one.id]
    )
  end

  let(:classroom_unit_two) do
    create(:classroom_unit,
      classroom: classroom_two,
      unit: unit_two,
      assigned_student_ids: [student_in_classroom_two.id]
    )
  end

  let(:student_one_session) do
    create(:activity_session,
      state: 'finished',
      percentage: 0.777778,
      user: student_in_classroom_one,
      classroom_unit: classroom_unit_one,
      completed_at: Time.current
    )
  end

  let(:student_two_session) do
    create(:activity_session,
      state: 'finished',
      percentage: 0.75,
      user: student_in_classroom_two,
      classroom_unit: classroom_unit_two,
      completed_at: Time.current
    )
  end

  let(:classroom_one_sessions) { [student_one_session] }
  let(:classroom_two_sessions) { [student_two_session] }
  let!(:all_sessions) { classroom_one_sessions + classroom_two_sessions}
end
