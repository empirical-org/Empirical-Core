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

  # let(:classroom_one_activity) { create(:classroom_activity,
  #   classroom: classroom_one, unit: classroom_one.units.first, activity: activity) }
  # let(:classroom_two_activity) { create(:classroom_activity,
  #   classroom: classroom_two, unit: classroom_two.units.first, activity: activity) }

  let(:student_one_session) do
    student_in_classroom_one.activity_sessions.create!(
      state: 'finished',
      percentage: 0.777778,
      classroom_unit: classroom_unit_one
    )
  end

  let(:student_two_session) do
    student_in_classroom_two.activity_sessions.create!(
      state: 'finished',
      percentage: 0.75,
      classroom_unit: classroom_unit_two
    )
  end

  let(:classroom_one_sessions) { [student_one_session] }
  let(:classroom_two_sessions) { [student_two_session] }
  let!(:all_sessions) { classroom_one_sessions + classroom_two_sessions}
end
