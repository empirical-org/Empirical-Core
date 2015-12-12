shared_context 'Concept Progress Report' do
  # Stats should come out like this:
  # name,         result_count,     correct_count,      incorrect_count,
  # Writing,      3,                2,                  1
  # Grammar,      2,                1,                  1

  # When filtered by empty_classroom, nothing displays
  # when filtered by empty_unit, nothing displays
  # When filtered by unassigned student, nothing displays

  let!(:activity) { FactoryGirl.create(:activity) }
  let!(:student) { FactoryGirl.create(:student) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher, students: [student]) }
  let!(:unit) { FactoryGirl.create(:unit) }
  let!(:classroom_activity) do
    FactoryGirl.create(:classroom_activity,
                       classroom: classroom,
                       activity: activity,
                       unit: unit)
  end

  let!(:writing_grandparent_concept) { FactoryGirl.create(:concept, name: 'Writing Grandparent') }
  let!(:writing_parent_concept) { FactoryGirl.create(:concept, name: 'Writing Parent', parent: writing_grandparent_concept) }
  let!(:writing_concept) { FactoryGirl.create(:concept, name: 'Writing Tag', parent: writing_parent_concept) }
  let!(:grammar_tag) { FactoryGirl.create(:concept, name: 'Grammar Tag') }

  let!(:activity_session) do
    FactoryGirl.create(:activity_session,
                       classroom_activity: classroom_activity,
                       user: student,
                       activity: activity,
                       state: 'finished',
                       percentage: 0.75
                      )
  end

  let!(:correct_writing_result1) do
    FactoryGirl.create(:concept_result,
                       activity_session: activity_session,
                       concept: writing_concept,
                       metadata: {
                         'correct' => 1
                       })
  end

  let!(:correct_writing_result2) do
    FactoryGirl.create(:concept_result,
                       activity_session: activity_session,
                       concept: writing_concept,
                       metadata: {
                         'correct' => 1
                       })
  end

  let!(:incorrect_writing_result) do
    FactoryGirl.create(:concept_result,
                       activity_session: activity_session,
                       concept: writing_concept,
                       metadata: {
                         'correct' => 0
                       })
  end

  let!(:correct_grammar_result) do
    FactoryGirl.create(:concept_result,
                       activity_session: activity_session,
                       concept: grammar_tag,
                       metadata: {
                         'correct' => 1
                       })
  end

  let!(:incorrect_grammar_result) do
    FactoryGirl.create(:concept_result,
                       activity_session: activity_session,
                       concept: grammar_tag,
                       metadata: {
                         'correct' => 0
                       })
  end

  # Should not be visible on the report
  let!(:other_teacher) { FactoryGirl.create(:teacher) }
  let!(:other_student) { FactoryGirl.create(:student) }
  let!(:other_classroom) { FactoryGirl.create(:classroom, teacher: other_teacher) }
  let!(:other_unit) { FactoryGirl.create(:unit) }
  let!(:other_classroom_activity) do
    FactoryGirl.create(:classroom_activity,
                       classroom: other_classroom,
                       unit: other_unit,
                       activity: activity)
  end
  let!(:other_activity_session) do
    FactoryGirl.create(:activity_session,
                       classroom_activity: other_classroom_activity,
                       user: other_student,
                       state: 'finished',
                       percentage: 0.75)
  end
  let!(:other_grammar_result) do
    FactoryGirl.create(:concept_result,
                       activity_session: other_activity_session,
                       concept: writing_concept,
                       metadata: {
                         'correct' => 1
                       })
  end

  let!(:writing_results) { [correct_writing_result1, correct_writing_result2, incorrect_writing_result] }
  let!(:grammar_results) { [correct_grammar_result, incorrect_grammar_result] }
end
