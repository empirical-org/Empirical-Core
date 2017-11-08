shared_context 'Activity Progress Report' do
  let(:teacher) { create :teacher }

  let(:activity) { create(:activity) }
  let(:classroom_one) { create(:classroom, name: 'Classroom One', teacher: teacher) }
  let(:classroom_two) { create(:classroom, name: 'Classroom Two', teacher: teacher)}
  let!(:student_in_classroom_one) { create(:student, classrooms: [classroom_one]) }
  let!(:student_in_classroom_two) { create(:student, classrooms: [classroom_two]) }
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
