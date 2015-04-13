shared_context 'Topic Progress Report' do
  # Stats should come out like this:
  # name,     student_count,    proficient_count,   not_proficient_count,
  # 1st Grade CCSS,  3,                2,                  1
  # 2nd Grade CCSS,  2,                1,                  1

  # hidden_topic should never be displayed
  # When filtered by empty_classroom, nothing displays
  # when filtered by empty_unit, nothing displays
  # When filtered by unassigned student, nothing displays
  let!(:teacher) { FactoryGirl.create(:teacher, name: 'Teacher Person', username: 'teacherperson') }
  let!(:section) { FactoryGirl.create(:section) }
  let!(:full_classroom) { FactoryGirl.create(:classroom, name: "full", teacher: teacher) }
  let!(:alice) { FactoryGirl.create(:student, name: "Alice Cool", classroom: full_classroom) }
  let!(:fred) { FactoryGirl.create(:student, name: "Fred Kewl", classroom: full_classroom) }
  let!(:zojirushi) { FactoryGirl.create(:student, name: "Zojirushi Kewel", classroom: full_classroom) }
  let!(:unassigned_student) { FactoryGirl.create(:student, classroom: nil) }
  let!(:second_grade_topic) { FactoryGirl.create(:topic, section: section, name: "2nd Grade CCSS") }
  let!(:first_grade_topic) { FactoryGirl.create(:topic, section: section, name: "1st Grade CCSS") }
  let!(:hidden_topic) { FactoryGirl.create(:topic, section: section) }
  let!(:empty_classroom) { FactoryGirl.create(:classroom, name: "empty", teacher: teacher) }
  let!(:unit1) { FactoryGirl.create(:unit) }
  let!(:empty_unit) { FactoryGirl.create(:unit) }
  let!(:activity_for_second_grade_topic) { FactoryGirl.create(:activity,
    name: '2nd Grade Activity', topic: second_grade_topic) }
  let!(:classroom_activity1) { FactoryGirl.create(:classroom_activity,
                                            classroom: full_classroom,
                                            activity: activity_for_second_grade_topic,
                                            unit: unit1) }
  let!(:activity_for_first_grade_topic) { FactoryGirl.create(:activity,
    name: '1st Grade Activity', topic: first_grade_topic) }
  let!(:classroom_activity2) { FactoryGirl.create(:classroom_activity,
                                            classroom: full_classroom,
                                            activity: activity_for_first_grade_topic,
                                            unit: unit1) }

  # NOTE: ClassroomActivity.create creates new activity sessions for every student in the classroom.
  # These lets will update the existing activity sessions instead of creating new ones.
  let!(:alice_second_grade_topic_session) do
    session = alice.activity_sessions.for_activity(activity_for_second_grade_topic)
    session.update!(state: 'finished', percentage: 1, completed_at: 1.month.ago) # proficient
    session
  end

  let!(:fred_second_grade_topic_session) do
    session = fred.activity_sessions.for_activity(activity_for_second_grade_topic)
    session.update!(state: 'finished', percentage: 1, completed_at: 1.month.ago) # proficient
    session
  end

  let!(:zojirushi_second_grade_topic_session) do
    session = zojirushi.activity_sessions.for_activity(activity_for_second_grade_topic)
    session.update!(state: 'finished', percentage: 0.49, completed_at: 25.days.ago) # Not Proficient
    session
  end

  let!(:alice_first_grade_topic_session)  do
    session = alice.activity_sessions.for_activity(activity_for_first_grade_topic)
    session.update!(state: 'finished', percentage: 0.70, completed_at: 28.days.ago) # Near-proficient
    session
  end

  let!(:fred_first_grade_topic_session) do
    session = fred.activity_sessions.for_activity(activity_for_first_grade_topic)
    session.update!(state: 'finished', percentage: 0.50, completed_at: 2.days.ago) # Nearly Proficient
    session
  end

  let!(:visible_topics) { [first_grade_topic, second_grade_topic] }
  let!(:visible_classrooms) { [full_classroom] }
  let!(:visible_students) { [alice, fred, zojirushi] }
  let!(:visible_activity_sessions) { [
    alice_second_grade_topic_session,
    alice_first_grade_topic_session,
    fred_second_grade_topic_session,
    fred_first_grade_topic_session,
    zojirushi_second_grade_topic_session
  ] }

  let(:best_activity_sessions) { visible_activity_sessions }

  let(:proficient_students) { [alice] }

  let(:near_proficient_students) { [fred] }

  let(:not_proficient_students) { [zojirushi] }

  let!(:first_grade_topic_students) { [alice, fred] }

  let(:worst_score_session) { zojirushi_second_grade_topic_session }

  let(:best_score_sessions) { [alice_second_grade_topic_session, fred_second_grade_topic_session] }
end