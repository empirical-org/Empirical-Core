  FactoryBot.define do
  factory :concept_result do
    concept
    activity_session
    metadata {{"answer": Faker::Lorem.sentence, "correct": [0,1].sample}}

    # TODO: generate metadata.

    factory :sentence_fragment_expansion do
      question_type { 'sentence-fragment-expansion' }
      activity_session { FactoryBot.create(:diagnostic_activity_session) }
    end

    factory :sentence_writing do
      question_type { 'sentence-writing' }
      activity_session { FactoryBot.create("#{['proofreader', 'grammar'].sample}_activity_session".to_s) }
    end

    factory :passage_proofreader do
      question_type { 'passage-proofreader' }
      activity_session { FactoryBot.create(:proofreader_activity_session) }
    end

    factory :fill_in_the_blanks do
      question_type { 'fill-in-the-blanks' }
      activity_session { FactoryBot.create(:diagnostic_activity_session) }
    end

    factory :sentence_combining do
      question_type { 'sentence-combining' }
      activity_session { FactoryBot.create("#{['connect', 'diagnostic'].sample}_activity_session".to_s) }
    end

    factory :sentence_fragment_identification do
      question_type { 'sentence-fragment-identification' }
      activity_session { FactoryBot.create(:diagnostic_activity_session) }
    end

    # factory :lessons_slide do
    #   question_type { 'lessons-slide' }
    #   activity_session { FactoryBot.create(:lesson_activity_session) }
    # end
  end
end
