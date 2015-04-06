shared_context 'Student Concept Progress Report' do
  # Create 3 students
  # Create 2 concept tag, one displayed, the other not
  # Create a distribution of concept tag results for each student
  let(:alice) { FactoryGirl.create(:student, name: "Alice Cool") }
  let(:fred) { FactoryGirl.create(:student, name: "Fred Kewl") }
  let(:zojirushi) { FactoryGirl.create(:student, name: "Zojirushi Kewel") }

  let(:concept_class) { FactoryGirl.create(:concept_class) }
  let(:concept_tag) { FactoryGirl.create(:concept_tag, concept_class: concept_class) }
  let(:concept_category) { FactoryGirl.create(:concept_category, concept_class: concept_class) }
  let(:hidden_concept_tag) { FactoryGirl.create(:concept_tag, name: "Hidden", concept_class: concept_class) }

  # Boilerplate
  let(:classroom) { FactoryGirl.create(:classroom,
    name: "Bacon Weaving",
    teacher: teacher,
    students: [alice, fred, zojirushi]) }
  let(:activity) { FactoryGirl.create(:activity) }
  let(:unit) { FactoryGirl.create(:unit) }
  let(:classroom_activity) { FactoryGirl.create(:classroom_activity,
                                          classroom: classroom,
                                          activity: activity,
                                          unit: unit) }


  # Create 2 activity session for each student, one with the concept tags, one without
  let(:alice_session) { FactoryGirl.create(:activity_session,
                                      classroom_activity: classroom_activity,
                                      user: alice,
                                      activity: activity,
                                      state: 'finished',
                                      percentage: 0.75) }

  let(:fred_session) { FactoryGirl.create(:activity_session,
                                      classroom_activity: classroom_activity,
                                      user: fred,
                                      activity: activity,
                                      state: 'finished',
                                      percentage: 0.75) }

  # Zojirushi has no concept tag results, so should not display
  # in the progress report
  let(:zojirushi_session) { FactoryGirl.create(:activity_session,
                                      classroom_activity: classroom_activity,
                                      user: zojirushi,
                                      activity: activity,
                                      state: 'finished',
                                      percentage: 0.75) }

  let(:visible_students) { [alice, fred] }
  let(:classrooms) { [classroom] }

  before do
    # Incorrect result for Alice
    alice_session.concept_tag_results.create!(
      concept_tag: concept_tag,
      concept_category: concept_category,
      metadata: {
        "correct" => 0
      })

    # Correct result for Alice
    alice_session.concept_tag_results.create!(
      concept_tag: concept_tag,
      concept_category: concept_category,
      metadata: {
        "correct" => 1
      })

    # Incorrect result for Fred
    fred_session.concept_tag_results.create!(
      concept_tag: concept_tag,
      concept_category: concept_category,
      metadata: {
        "correct" => 0
      })

    # Correct result for Fred for hidden tag (not displayed)
    fred_session.concept_tag_results.create!(
      concept_tag: hidden_concept_tag,
      concept_category: concept_category,
      metadata: {
        "correct" => 1
      })
  end
end