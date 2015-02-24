module ProgressReportHelper
  def setup_sections_progress_report
    ActivitySession.destroy_all
    @sections = []
    @units = []
    @classrooms = []
    @students = []
    3.times do |i|
      student = FactoryGirl.create(:student)
      @students << student
      classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [student])
      @classrooms << classroom
      section = FactoryGirl.create(:section)
      @sections << section
      unit = FactoryGirl.create(:unit)
      @units << unit
      topic = FactoryGirl.create(:topic, section: section)
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