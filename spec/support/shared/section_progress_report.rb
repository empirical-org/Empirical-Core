shared_context 'Section Progress Report' do
  let(:sections) { [] }
  let(:units) { [] }
  let(:classrooms) { [] }
  let(:students) { [] }
  let(:topics) { [] }
  before do
    ActivitySession.destroy_all
    3.times do |i|
      student = FactoryBot.create(:user, role: 'student')
      students << student
      classroom = FactoryBot.create(:classroom, teacher: teacher, students: [student])
      classrooms << classroom
      section = FactoryBot.create(:section, name: "Progress Report Section #{i}")
      sections << section
      unit = FactoryBot.create(:unit)
      units << unit
      topic = FactoryBot.create(:topic, section: section)
      topics << topic
      activity = FactoryBot.create(:activity, topic: topic)
      classroom_activity = FactoryBot.create(:classroom_activity,
                                              classroom: classroom,
                                              activity: activity,
                                              unit: unit)
      3.times do |j|
        activity_session = FactoryBot.create(:activity_session,
                                              classroom_activity: classroom_activity,
                                              user: student,
                                              activity: activity,
                                              state: 'finished',
                                              percentage: i / 3.0)
      end

    end
  end
end