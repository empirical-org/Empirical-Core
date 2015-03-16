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
    @student = FactoryGirl.create(:student)
    @classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [@student])
    @unit = FactoryGirl.create(:unit)
    classroom_activity = FactoryGirl.create(:classroom_activity,
                                            classroom: @classroom,
                                            activity: activity,
                                            unit: @unit)

    concept_class = FactoryGirl.create(:concept_class)
    @writing_category = FactoryGirl.create(:concept_category, name: "Writing Category", concept_class: concept_class)
    @writing_tag = FactoryGirl.create(:concept_tag, name: "Writing Tag", concept_class: concept_class)
    @grammar_category = FactoryGirl.create(:concept_category, name: "Grammar Category", concept_class: concept_class)
    grammar_tag = FactoryGirl.create(:concept_tag, name: "Grammar Tag", concept_class: concept_class)
    empty_category = FactoryGirl.create(:concept_category, name: "Empty / Hidden", concept_class: concept_class)

    activity_session = FactoryGirl.create(:activity_session,
                                          classroom_activity: classroom_activity,
                                          user: @student,
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
    @other_student = FactoryGirl.create(:student)
    @other_classroom = FactoryGirl.create(:classroom, teacher: other_teacher)
    @other_unit = FactoryGirl.create(:unit)
    other_classroom_activity = FactoryGirl.create(:classroom_activity,
      classroom: @other_classroom,
      unit: @other_unit,
      activity: activity)
    other_activity_session = FactoryGirl.create(:activity_session,
      classroom_activity: other_classroom_activity,
      user: @other_student,
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

  def setup_students_concepts_progress_report
    # Create 3 students
    # Create 2 concept tag, one displayed, the other not
    # Create a distribution of concept tag results for each student
    @alice = FactoryGirl.create(:student, name: "Alice")
    @fred = FactoryGirl.create(:student, name: "Fred")
    @zojirushi = FactoryGirl.create(:student, name: "Zojirushi")

    concept_class = FactoryGirl.create(:concept_class)
    @concept_tag = FactoryGirl.create(:concept_tag, concept_class: concept_class)
    @concept_category = FactoryGirl.create(:concept_category, concept_class: concept_class)
    hidden_concept_tag = FactoryGirl.create(:concept_tag, name: "Hidden", concept_class: concept_class)

    # Boilerplate
    classroom = FactoryGirl.create(:classroom,
      name: "Bacon Weaving",
      teacher: teacher,
      students: [@alice, @fred, @zojirushi])
    activity = FactoryGirl.create(:activity)
    unit = FactoryGirl.create(:unit)
    classroom_activity = FactoryGirl.create(:classroom_activity,
                                            classroom: classroom,
                                            activity: activity,
                                            unit: unit)


    # Create 2 activity session for each student, one with the concept tags, one without
    @alice_session = FactoryGirl.create(:activity_session,
                                        classroom_activity: classroom_activity,
                                        user: @alice,
                                        activity: activity,
                                        state: 'finished',
                                        percentage: 0.75)

    # Incorrect result for Alice
    @alice_session.concept_tag_results.create!(
      concept_tag: @concept_tag,
      concept_category: @concept_category,
      metadata: {
        "correct" => 0
      })

    # Correct result for Alice
    @alice_session.concept_tag_results.create!(
      concept_tag: @concept_tag,
      concept_category: @concept_category,
      metadata: {
        "correct" => 1
      })

    @fred_session = FactoryGirl.create(:activity_session,
                                        classroom_activity: classroom_activity,
                                        user: @fred,
                                        activity: activity,
                                        state: 'finished',
                                        percentage: 0.75)

    # Incorrect result for Fred
    @fred_session.concept_tag_results.create!(
      concept_tag: @concept_tag,
      concept_category: @concept_category,
      metadata: {
        "correct" => 0
      })

    # Correct result for Fred for hidden tag (not displayed)
    @fred_session.concept_tag_results.create!(
      concept_tag: hidden_concept_tag,
      concept_category: @concept_category,
      metadata: {
        "correct" => 1
      })

    # Zojirushi has no concept tag results, so should not display
    # in the progress report
    @zojirushi_session = FactoryGirl.create(:activity_session,
                                        classroom_activity: classroom_activity,
                                        user: @zojirushi,
                                        activity: activity,
                                        state: 'finished',
                                        percentage: 0.75)

    @visible_students = [@alice, @fred]
    @classrooms = [@classroom]
  end

  def setup_topics_progress_report
    # Stats should come out like this:
    # name,     student_count,    proficient_count,   not_proficient_count,
    # 1st Grade CCSS,  3,                2,                  1
    # 2nd Grade CCSS,  2,                1,                  1

    # hidden_topic should never be displayed
    # When filtered by empty_classroom, nothing displays
    # when filtered by empty_unit, nothing displays
    # When filtered by unassigned student, nothing displays

    ActivitySession.destroy_all
    @section = FactoryGirl.create(:section)

    @alice = FactoryGirl.create(:student, name: "Alice")
    @fred = FactoryGirl.create(:student, name: "Fred")
    @zojirushi = FactoryGirl.create(:student, name: "Zojirushi")
    @unassigned_student = FactoryGirl.create(:student)
    @second_grade_topic = FactoryGirl.create(:topic, section: @section, name: "2nd Grade CCSS")
    @first_grade_topic = FactoryGirl.create(:topic, section: @section, name: "1st Grade CCSS")
    @hidden_topic = FactoryGirl.create(:topic, section: @section)
    @full_classroom = FactoryGirl.create(:classroom, name: "full", teacher: teacher, students: [@alice, @fred, @zojirushi])
    @empty_classroom = FactoryGirl.create(:classroom, name: "empty", teacher: teacher, students: [])
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

    @alice_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @alice,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @fred_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @fred,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient
    @zojirushi_second_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity1,
                                                  user: @zojirushi,
                                                  activity: @activity_for_second_grade_topic,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not proficient

    @alice_first_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @alice,
                                                  activity: @activity_for_first_grade_topic,
                                                  state: 'finished',
                                                  percentage: 1) # Proficient

    @fred_first_grade_topic_session = FactoryGirl.create(:activity_session,
                                                  classroom_activity: classroom_activity2,
                                                  user: @fred,
                                                  activity: @activity_for_first_grade_topic,
                                                  state: 'finished',
                                                  percentage: 0.50) # Not Proficient

    @visible_topics = [@first_grade_topic, @second_grade_topic]
    @visible_students = [@alice, @fred, @zojirushi]
    @visible_activity_sessions = [
      @alice_second_grade_topic_session,
      @alice_first_grade_topic_session,
      @fred_second_grade_topic_session,
      @fred_first_grade_topic_session,
      @zojirushi_second_grade_topic_session
    ]
    @first_grade_topic_students = [@alice, @fred]
  end
end