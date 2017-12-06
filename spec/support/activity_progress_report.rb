shared_context 'Activity Progress Report' do
  let(:teacher) { create :teacher_with_a_couple_classrooms_with_one_student_each }
  let(:classroom_one) { teacher.classrooms_i_teach.first }
  let(:classroom_two) { teacher.classrooms_i_teach.second }
  let!(:student_in_classroom_one) { classroom_one.students.first }
  let!(:student_in_classroom_two) { classroom_two.students.first }

  let(:activity) { create(:activity) }
  let(:classroom_one_activity) { create(:classroom_activity,
    classroom: classroom_one, unit: classroom_one.units.first, activity: activity) }
  let(:classroom_two_activity) { create(:classroom_activity,
    classroom: classroom_two, unit: classroom_two.units.first, activity: activity) }

  let(:student_one_session) do
    student_in_classroom_one.activity_sessions.create!(
      state: 'finished',
      percentage: 0.777778,
      classroom_activity: classroom_one_activity
    )
  end
  let(:student_two_session) do
    student_in_classroom_two.activity_sessions.create!(
      state: 'finished',
      percentage: 0.75,
      classroom_activity: classroom_two_activity
    )
  end

  let(:classroom_one_sessions) { [student_one_session]}
  let(:classroom_two_sessions) { [student_two_session] }
  let!(:all_sessions) { classroom_one_sessions + classroom_two_sessions}
end
