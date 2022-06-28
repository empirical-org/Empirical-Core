# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result_old do
    concept
    activity_session
    metadata { { "answer": 'Arbitrary sample correct answer.', "correct": 1 } }

    # TODO: generate metadata.

    factory :sentence_fragment_expansion do
      question_type { 'sentence-fragment-expansion' }
      activity_session { FactoryBot.create(:diagnostic_activity_session) }
    end

    factory :sentence_writing do
      question_type { 'sentence-writing' }
      activity_session { FactoryBot.create("#{%w[proofreader grammar].sample}_activity_session".to_s) }
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
      activity_session { FactoryBot.create("#{%w[connect diagnostic].sample}_activity_session".to_s) }
    end

    factory :sentence_fragment_identification do
      question_type { 'sentence-fragment-identification' }
      activity_session { FactoryBot.create(:diagnostic_activity_session) }
    end

    factory :concept_result_with_correct_answer do
      metadata { { "answer" => 'Arbitrary sample correct answer.', "correct" => 1 } }
    end

    factory :concept_result_with_incorrect_answer do
      metadata { { "answer" => 'Arbitrary sample incorrect answer.', "correct" => 0 } }
    end

    # factory :lessons_slide do
    #   question_type { 'lessons-slide' }
    #   activity_session { FactoryBot.create(:lesson_activity_session) }
    # end
  end
end
