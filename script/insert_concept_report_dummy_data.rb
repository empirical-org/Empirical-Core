teacher = User.find(498)

activity_sessions = ActivitySession.completed.by_teacher(teacher)

random_session = activity_sessions.order("RANDOM()").first

grammar_concepts = ConceptClass.find_by_name('Grammar Concepts')
random_category = ConceptCategory.where(concept_class: grammar_concepts).order("RANDOM()").first
ConceptTag.where(concept_class: grammar_concepts).find_each do |concept_tag|
  ConceptTagResult.create!(
    activity_session: random_session,
    concept_tag: concept_tag,
    concept_category: random_category,
    metadata: {
      "correct" => [1, 0].sample
    }
  )
end