module ProgressReportHelper

  def setup_concepts_progress_report
    # Stats should come out like this:
    # name,         result_count,     correct_count,      incorrect_count,
    # Writing,      3,                2,                  1
    # Grammar,      2,                1,                  1

    # When filtered by empty_classroom, nothing displays
    # when filtered by empty_unit, nothing displays
    # When filtered by unassigned student, nothing displays

    activity = FactoryGirl.create(:activity)
    student = FactoryGirl.create(:student)
    classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [student])
    unit = FactoryGirl.create(:unit)
    classroom_activity = FactoryGirl.create(:classroom_activity,
                                            classroom: classroom,
                                            activity: activity,
                                            unit: unit)

    concept_class = FactoryGirl.create(:concept_class)
    @writing_category = FactoryGirl.create(:concept_category, name: "Writing Category", concept_class: concept_class)
    @writing_tag = FactoryGirl.create(:concept_tag, name: "Writing Tag", concept_class: concept_class)
    @grammar_category = FactoryGirl.create(:concept_category, name: "Grammar Category", concept_class: concept_class)
    grammar_tag = FactoryGirl.create(:concept_tag, name: "Grammar Tag", concept_class: concept_class)
    empty_category = FactoryGirl.create(:concept_category, name: "Empty / Hidden", concept_class: concept_class)

    activity_session = FactoryGirl.create(:activity_session,
                                          classroom_activity: classroom_activity,
                                          user: student,
                                          activity: activity,
                                          state: 'finished',
                                          percentage: 0.75
                                          )

    correct_writing_result1 = FactoryGirl.create(:concept_tag_result,
      activity_session: activity_session,
      concept_tag: @writing_tag,
      concept_category: @writing_category,
      metadata: {
        "correct" => 1
      })

    correct_writing_result2 = FactoryGirl.create(:concept_tag_result,
      activity_session: activity_session,
      concept_tag: @writing_tag,
      concept_category: @writing_category,
      metadata: {
        "correct" => 1
      })

    incorrect_writing_result = FactoryGirl.create(:concept_tag_result,
      activity_session: activity_session,
      concept_tag: @writing_tag,
      concept_category: @writing_category,
      metadata: {
        "correct" => 0
      })

    correct_grammar_result = FactoryGirl.create(:concept_tag_result,
      activity_session: activity_session,
      concept_tag: grammar_tag,
      concept_category: @grammar_category,
      metadata: {
        "correct" => 1
      })

    incorrect_grammar_result = FactoryGirl.create(:concept_tag_result,
      activity_session: activity_session,
      concept_tag: grammar_tag,
      concept_category: @grammar_category,
      metadata: {
        "correct" => 0
      })

    # Should not be visible on the report
    other_teacher = FactoryGirl.create(:teacher)
    other_student = FactoryGirl.create(:student)
    other_classroom = FactoryGirl.create(:classroom, teacher: other_teacher)
    other_unit = FactoryGirl.create(:unit)
    other_classroom_activity = FactoryGirl.create(:classroom_activity,
      classroom: other_classroom,
      unit: other_unit,
      activity: activity)
    other_activity_session = FactoryGirl.create(:activity_session,
      classroom_activity: other_classroom_activity,
      user: other_student,
      state: 'finished',
      percentage: 0.75)
    other_grammar_result = FactoryGirl.create(:concept_tag_result,
      activity_session: other_activity_session,
      concept_tag: @writing_tag,
      concept_category: @writing_category,
      metadata: {
        "correct" => 1
      })

    @visible_categories = [@writing_category, @grammar_category]
    @writing_results = [correct_writing_result1, correct_writing_result2, incorrect_writing_result]
    @grammar_results = [correct_grammar_result, incorrect_grammar_result]
    @writing_category_tags = [@writing_tag]
  end

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
    @second_grade_topic = FactoryGirl.create(:topic, section: @section, name: "2nd Grade CCSS")
    @first_grade_topic = FactoryGirl.create(:topic, section: @section, name: "1st Grade CCSS")
    @hidden_topic = FactoryGirl.create(:topic, section: @section)
    @full_classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [@student1, @student2, @student3])
    @empty_classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [])
    @unit1 = FactoryGirl.create(:unit)
    @empty_unit = FactoryGirl.create(:unit)
    @activity_for_second_grade_topic = FactoryGirl.create(:activity, topic: @second_grade_topic)
    classroom_activity1 = FactoryGirl.create(:classroom_activity,
                                              classroom: @full_classroom,
                                              activity: @activity_for_second_grade_topic,
                                              unit: @unit1)
    @activity_for_first_grade_topic = FactoryGirl.create(:activity, topic: @first_grade_topic)
    classroom_activity2 = FactoryGirl.create(:classroom_activity,
                                              classroom: @full_classroom,
                                              activity: @activity_for_first_grade_topic,
                                              unit: @unit1)

    @student1_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student1,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @student2_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student2,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @student3_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @student3,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not proficient

    @student1_first_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @student1,
                                                  activity: @activity_for_first_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient

    @student2_first_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @student2,
                                                  activity: @activity_for_first_grade_topic,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not Proficient

    @visible_topics = [@first_grade_topic, @second_grade_topic]
    @visible_students = [@student1, @student2, @student3]
    @visible_activity_sessions = [
      @student1_second_grade_topic_session,
      @student1_first_grade_topic_session,
      @student2_second_grade_topic_session,
      @student2_first_grade_topic_session,
      @student3_second_grade_topic_session
    ]
  end
end