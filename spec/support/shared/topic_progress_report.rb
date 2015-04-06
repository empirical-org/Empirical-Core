shared_context 'Topic Progress Report' do
  # Stats should come out like this:
  # name,     student_count,    proficient_count,   not_proficient_count,
  # 1st Grade CCSS,  3,                2,                  1
  # 2nd Grade CCSS,  2,                1,                  1

  # hidden_topic should never be displayed
  # When filtered by empty_classroom, nothing displays
  # when filtered by empty_unit, nothing displays
  # When filtered by unassigned student, nothing displays

  let!(:section) { FactoryGirl.create(:section) }

  let!(:alice) { FactoryGirl.create(:student, name: "Alice Cool") }
  let!(:fred) { FactoryGirl.create(:student, name: "Fred Kewl") }
  let!(:zojirushi) { FactoryGirl.create(:student, name: "Zojirushi Kewel") }
  let!(:unassigned_student) { FactoryGirl.create(:student) }
  let!(:second_grade_topic) { FactoryGirl.create(:topic, section: section, name: "2nd Grade CCSS") }
  let!(:first_grade_topic) { FactoryGirl.create(:topic, section: section, name: "1st Grade CCSS") }
  let!(:hidden_topic) { FactoryGirl.create(:topic, section: section) }
  let!(:full_classroom) { FactoryGirl.create(:classroom, name: "full", teacher: teacher, students: [alice, fred, zojirushi]) }
  let!(:empty_classroom) { FactoryGirl.create(:classroom, name: "empty", teacher: teacher, students: []) }
  let!(:unit1) { FactoryGirl.create(:unit) }
  let!(:empty_unit) { FactoryGirl.create(:unit) }
  let!(:activity_for_second_grade_topic) { FactoryGirl.create(:activity, topic: second_grade_topic) }
  let!(:classroom_activity1) { FactoryGirl.create(:classroom_activity,
                                            classroom: full_classroom,
                                            activity: activity_for_second_grade_topic,
                                            unit: unit1) }
  let!(:activity_for_first_grade_topic) { FactoryGirl.create(:activity, topic: first_grade_topic) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                            classroom: full_classroom,
                                            activity: activity_for_first_grade_topic,
                                            unit: unit1) }

  let!(:alice_second_grade_topic_session) { FactoryGirl.create(:activity_session,
                                                classroom_activity: classroom_activity1,
                                                user: alice,
                                                activity: activity_for_second_grade_topic,
                                                state: 'finished',
                                                percentage: 1) } # Proficient
  let!(:fred_second_grade_topic_session) { FactoryGirl.create(:activity_session,
                                                classroom_activity: classroom_activity1,
                                                user: fred,
                                                activity: activity_for_second_grade_topic,
                                                state: 'finished',
                                                percentage: 1) } # Proficient
  let!(:zojirushi_second_grade_topic_session) { FactoryGirl.create(:activity_session,
                                                classroom_activity: classroom_activity1,
                                                user: zojirushi,
                                                activity: activity_for_second_grade_topic,
                                                state: 'finished',
                                                percentage: 0.50) } # Not proficient

  let!(:alice_first_grade_topic_session) { FactoryGirl.create(:activity_session,
                                                classroom_activity: classroom_activity2,
                                                user: alice,
                                                activity: activity_for_first_grade_topic,
                                                state: 'finished',
                                                percentage: 1) } # Proficient

  let!(:fred_first_grade_topic_session) { FactoryGirl.create(:activity_session,
                                                classroom_activity: classroom_activity2,
                                                user: fred,
                                                activity: activity_for_first_grade_topic,
                                                state: 'finished',
                                                percentage: 0.50) } # Not Proficient

  let!(:visible_topics) { [first_grade_topic, second_grade_topic] }
  let!(:visible_students) { [alice, fred, zojirushi] }
  let!(:visible_activity_sessions) { [
    alice_second_grade_topic_session,
    alice_first_grade_topic_session,
    fred_second_grade_topic_session,
    fred_first_grade_topic_session,
    zojirushi_second_grade_topic_session
  ] }
  let!(:first_grade_topic_students) { [alice, fred] }

end