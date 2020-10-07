shared_context 'StandardLevel Progress Report' do
  let(:standard_levels) { [] }
  let(:units) { [] }
  let(:classrooms) { [] }
  let(:students) { [] }
  let(:standards) { [] }
  before do
    ActivitySession.destroy_all
    3.times do |i|
      student = create(:user, role: 'student')
      students << student
      classroom = create(:classroom, students: [student])
      classrooms << classroom
      standard_level = create(:standard_level, name: "Progress Report Section #{i}")
      standard_levels << standard_level
      unit = create(:unit)
      units << unit
      standard = create(:standard, standard_level: standard_level)
      standards << standard
      activity = create(:activity, standard: standard)
      classroom_unit = create(:classroom_unit,
                                              classroom: classroom,
                                              unit: unit)
      3.times do |j|
        activity_session = create(:activity_session,
                                              classroom_unit: classroom_unit,
                                              user: student,
                                              activity: activity,
                                              percentage: i / 3.0)
      end

    end
  end
end
