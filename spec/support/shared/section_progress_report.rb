shared_context 'Section Progress Report' do
  let(:sections) { [] }
  let(:units) { [] }
  let(:classrooms) { [] }
  let(:students) { [] }
  let(:topics) { [] }
  before do
    ActivitySession.destroy_all
    3.times do |i|
      student = create(:user, role: 'student')
      students << student
      classroom = create(:classroom, students: [student])
      classrooms << classroom
      section = create(:section, name: "Progress Report Section #{i}")
      sections << section
      unit = create(:unit)
      units << unit
      topic = create(:topic, section: section)
      topics << topic
      activity = create(:activity, topic: topic)
      classroom_activity = create(:classroom_activity,
                                              classroom: classroom,
                                              activity: activity,
                                              unit: unit)
      3.times do |j|
        activity_session = create(:activity_session, 
                                              classroom_activity: classroom_activity,
                                              user: student,
                                              activity: activity,
                                              percentage: i / 3.0)
      end

    end
  end
end
