shared_context 'Section Progress Report' do
  let(:sections) { [] }
  let(:units) { [] }
  let(:classrooms) { [] }
  let(:students) { [] }
  let(:topics) { [] }
  before do
    ActivitySession.destroy_all
    3.times do |i|
      student = FactoryGirl.create(:student)
      students << student
      classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [student])
      classrooms << classroom
      section = FactoryGirl.create(:section, name: "Progress Report Section #{i}")
      sections << section
      unit = FactoryGirl.create(:unit)
      units << unit
      topic = FactoryGirl.create(:topic, section: section)
      topics << topic
      activity = FactoryGirl.create(:activity, topic: topic)
      classroom_activity = FactoryGirl.create(:classroom_activity,
                                              classroom: classroom,
                                              activity: activity,
                                              unit: unit)
      3.times do |j|
        activity_session = FactoryGirl.create(:activity_session,
                                              classroom_activity: classroom_activity,
                                              user: student,
                                              activity: activity,
                                              state: 'finished',
                                              percentage: i / 3.0)
      end

    end
  end
end