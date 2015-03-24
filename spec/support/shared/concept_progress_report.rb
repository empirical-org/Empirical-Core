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
  let!(:classroom_activity) { FactoryGirl.create(:classroom_activity,
                                          classroom: classroom,
                                          activity: activity,
                                          unit: unit) }

  let!(:concept_class) { FactoryGirl.create(:concept_class) }
  let!(:writing_category) { FactoryGirl.create(:concept_category, name: "Writing Category", concept_class: concept_class) }
  let!(:writing_tag) { FactoryGirl.create(:concept_tag, name: "Writing Tag", concept_class: concept_class) }
  let!(:grammar_category) { FactoryGirl.create(:concept_category, name: "Grammar Category", concept_class: concept_class) }
  let!(:grammar_tag) { FactoryGirl.create(:concept_tag, name: "Grammar Tag", concept_class: concept_class) }
  let!(:empty_category) { FactoryGirl.create(:concept_category, name: "Empty / Hidden", concept_class: concept_class) }

  let!(:activity_session) { FactoryGirl.create(:activity_session,
                                        classroom_activity: classroom_activity,
                                        user: student,
                                        activity: activity,
                                        state: 'finished',
                                        percentage: 0.75
                                        ) }

  let!(:correct_writing_result1) { FactoryGirl.create(:concept_tag_result,
    activity_session: activity_session,
    concept_tag: writing_tag,
    concept_category: writing_category,
    metadata: {
      "correct" => 1
    }) }

  let!(:correct_writing_result2) { FactoryGirl.create(:concept_tag_result,
    activity_session: activity_session,
    concept_tag: writing_tag,
    concept_category: writing_category,
    metadata: {
      "correct" => 1
    }) }

  let!(:incorrect_writing_result) { FactoryGirl.create(:concept_tag_result,
    activity_session: activity_session,
    concept_tag: writing_tag,
    concept_category: writing_category,
    metadata: {
      "correct" => 0
    }) }

  let!(:correct_grammar_result) { FactoryGirl.create(:concept_tag_result,
    activity_session: activity_session,
    concept_tag: grammar_tag,
    concept_category: grammar_category,
    metadata: {
      "correct" => 1
    }) }

  let!(:incorrect_grammar_result) { FactoryGirl.create(:concept_tag_result,
    activity_session: activity_session,
    concept_tag: grammar_tag,
    concept_category: grammar_category,
    metadata: {
      "correct" => 0
    }) }

  # Should not be visible on the report
  let!(:other_teacher) { FactoryGirl.create(:teacher) }
  let!(:other_student) { FactoryGirl.create(:student) }
  let!(:other_classroom) { FactoryGirl.create(:classroom, teacher: other_teacher) }
  let!(:other_unit) { FactoryGirl.create(:unit) }
  let!(:other_classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: other_classroom,
    unit: other_unit,
    activity: activity) }
  let!(:other_activity_session) { FactoryGirl.create(:activity_session,
    classroom_activity: other_classroom_activity,
    user: other_student,
    state: 'finished',
    percentage: 0.75) }
  let!(:other_grammar_result) { FactoryGirl.create(:concept_tag_result,
    activity_session: other_activity_session,
    concept_tag: writing_tag,
    concept_category: writing_category,
    metadata: {
      "correct" => 1
    }) }

  let!(:visible_categories) { [writing_category, grammar_category] }
  let!(:writing_results) { [correct_writing_result1, correct_writing_result2, incorrect_writing_result] }
  let!(:grammar_results) { [correct_grammar_result, incorrect_grammar_result] }
  let!(:writing_category_tags) { [writing_tag] }
end