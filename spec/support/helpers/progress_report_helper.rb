module ProgressReportHelper
  def setup_sections_progress_report
    ActivitySession.destroy_all
    @sections = []
    @units = []
    @classrooms = []
    @students = []
    @topics = []
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
      @topics << topic
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

  def setup_topics_progress_report
    # Stats should come out like this:
    # name,     student_count,    proficient_count,   not_proficient_count,
    # Topic 1,  3,                2,                  1
    # Topic 2,  2,                1,                  1

    # hidden_topic should never be displayed
    # When filtered by empty_classroom, nothing displays
    # when filtered by empty_unit, nothing displays
    # When filtered by unassigned student, nothing displays

    ActivitySession.destroy_all
    @section = FactoryGirl.create(:section)

    @student1 = FactoryGirl.create(:student)
    @student2 = FactoryGirl.create(:student)
    @student3 = FactoryGirl.create(:student)
    @unassigned_student = FactoryGirl.create(:student)
    @topic1 = FactoryGirl.create(:topic, section: @section)
    @topic2 = FactoryGirl.create(:topic, section: @section)
    @hidden_topic = FactoryGirl.create(:topic, section: @section)
    @full_classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [@student1, @student2, @student3])
    @empty_classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [])
    @unit1 = FactoryGirl.create(:unit)
    @empty_unit = FactoryGirl.create(:unit)
    @activity_for_topic1 = FactoryGirl.create(:activity, topic: @topic1)
    classroom_activity1 = FactoryGirl.create(:classroom_activity,
                                              classroom: @full_classroom,
                                              activity: @activity_for_topic1,
                                              unit: @unit1)
    @activity_for_topic2 = FactoryGirl.create(:activity, topic: @topic2)
    classroom_activity2 = FactoryGirl.create(:classroom_activity,
                                              classroom: @full_classroom,
                                              activity: @activity_for_topic2,
                                              unit: @unit1)

    @student1_topic1_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student1,
                                                  activity: @activity_for_topic1,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @student2_topic1_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student2,
                                                  activity: @activity_for_topic1,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @student3_topic1_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student3,
                                                  activity: @activity_for_topic1,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not proficient

    @student1_topic2_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @student1,
                                                  activity: @activity_for_topic2,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient

    @student2_topic2_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @student2,
                                                  activity: @activity_for_topic2,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not Proficient

    @visible_topics = [@topic1, @topic2]
    @visible_students = [@student1, @student2, @student3]
  end
end