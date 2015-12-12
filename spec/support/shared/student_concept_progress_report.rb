shared_context 'Student Concept Progress Report' do
  # Create 3 students
  # Create 2 concept tag, one displayed, the other not
  # Create a distribution of concept tag results for each student
  let(:alice) { FactoryGirl.create(:student, name: 'Alice Cool') }
  let(:fred) { FactoryGirl.create(:student, name: 'Fred Kewl') }
  let(:zojirushi) { FactoryGirl.create(:student, name: 'Zojirushi Kewel') }

  let(:concept) { FactoryGirl.create(:concept) }
  let(:hidden_concept) { FactoryGirl.create(:concept, name: 'Hidden') }

  # Boilerplate
  let(:classroom) do
    FactoryGirl.create(:classroom,
                       name: 'Bacon Weaving',
                       teacher: teacher,
                       students: [alice, fred, zojirushi])
  end
  let(:activity) { FactoryGirl.create(:activity) }
  let(:unit) { FactoryGirl.create(:unit) }
  let(:classroom_activity) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity,
                       unit: unit)
  end

  # Create 2 activity session for each student, one with the concept tags, one without
  let(:alice_session) do
    FactoryGirl.create(:activity_session,
                       classroom_activity: classroom_activity,
                       user: alice,
                       activity: activity,
                       state: 'finished',
                       percentage: 0.75)
  end

  let(:fred_session) do
    FactoryGirl.create(:activity_session,
                       classroom_activity: classroom_activity,
                       user: fred,
                       activity: activity,
                       state: 'finished',
                       percentage: 0.75)
  end

  # Zojirushi has no concept tag results, so should not display
  # in the progress report
  let(:zojirushi_session) do
    FactoryGirl.create(:activity_session,
                       classroom_activity: classroom_activity,
                       user: zojirushi,
                       activity: activity,
                       state: 'finished',
                       percentage: 0.75)
  end

  let(:visible_students) { [alice, fred] }
  let(:classrooms) { [classroom] }

  before do
    # Incorrect result for Alice
    alice_session.concept_results.create!(
      concept: concept,
      metadata: {
        'correct' => 0
      })

    # Correct result for Alice
    alice_session.concept_results.create!(
      concept: concept,
      metadata: {
        'correct' => 1
      })

    # Incorrect result for Fred
    fred_session.concept_results.create!(
      concept: concept,
      metadata: {
        'correct' => 0
      })

    # Correct result for Fred for hidden tag (not displayed)
    fred_session.concept_results.create!(
      concept: hidden_concept,
      metadata: {
        'correct' => 1
      })
  end
end
