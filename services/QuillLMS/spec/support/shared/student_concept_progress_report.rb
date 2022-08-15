# frozen_string_literal: true

shared_context 'Student Concept Progress Report' do
  # Create 3 students
  # Create 2 concept tag, one displayed, the other not
  # Create a distribution of concept tag results for each student
  let(:alice) { create(:student, name: "Alice Cool") }
  let(:fred) { create(:student, name: "Fred Kewl") }
  let(:zojirushi) { create(:student, name: "Zojirushi Kewel") }

  let(:concept) { create(:concept) }
  let(:hidden_concept) { create(:concept, name: "Hidden") }

  # Boilerplate
  let(:classroom) { create(:classroom,
    name: "Bacon Weaving",
    students: [alice, fred, zojirushi]) }
  let(:teacher) {classroom.owner}
  let(:activity) { create(:activity) }
  let(:unit) { create(:unit, user: teacher ) }
  let(:classroom_unit) { create(:classroom_unit,
                                          classroom: classroom,
                                          assign_on_join: true,
                                          unit: unit,
                                          assigned_student_ids: [alice.id, fred.id, zojirushi.id]
                                          ) }
  let(:unit_activity) { create(:unit_activity,
                                activity: activity,
                                unit: unit)}


  # Create 2 activity session for each student, one with the concept tags, one without
  let(:alice_session) { create(:activity_session,
                                      classroom_unit: classroom_unit,
                                      user: alice,
                                      activity: activity,
                                      percentage: 0.75) }

  let(:fred_session) { create(:activity_session,
                                      classroom_unit: classroom_unit,
                                      user: fred,
                                      activity: activity,
                                      percentage: 0.75) }

  # Zojirushi has no concept tag results, so should not display
  # in the progress report
  let(:zojirushi_session) { create(:activity_session,
                                      classroom_unit: classroom_unit,
                                      user: zojirushi,
                                      activity: activity,
                                      percentage: 0.75) }

  let(:visible_students) { [alice, fred] }
  let(:classrooms) { [classroom] }

  before do
    # Incorrect result for Alice
    alice_session.concept_results.create!(
      concept: create(:concept_with_grandparent),
      correct: false)

    # Correct result for Alice
    alice_session.concept_results.create!(
      concept: concept,
      correct: true)

    # Incorrect result for Fred
    fred_session.concept_results.create!(
      concept: concept,
      correct: true)

    # Correct result for Fred for hidden tag (not displayed)
    fred_session.concept_results.create!(
      concept: hidden_concept,
      correct: true)
  end
end
