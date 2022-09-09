# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_results
#
#  id                                  :bigint           not null, primary key
#  answer                              :jsonb
#  attempt_number                      :integer
#  correct                             :boolean          not null
#  extra_metadata                      :jsonb
#  question_number                     :integer
#  question_score                      :float
#  created_at                          :datetime         not null
#  activity_session_id                 :integer          not null
#  concept_id                          :integer
#  concept_result_directions_id        :integer
#  concept_result_instructions_id      :integer
#  concept_result_previous_feedback_id :integer
#  concept_result_prompt_id            :integer
#  concept_result_question_type_id     :integer
#  old_concept_result_id               :integer
#
# Indexes
#
#  index_concept_results_on_activity_session_id    (activity_session_id)
#  index_concept_results_on_old_concept_result_id  (old_concept_result_id) UNIQUE
#
class ConceptResult < ApplicationRecord
  belongs_to :activity_session
  belongs_to :concept
  belongs_to :old_concept_result
  belongs_to :concept_result_directions
  belongs_to :concept_result_instructions
  belongs_to :concept_result_previous_feedback
  belongs_to :concept_result_prompt
  belongs_to :concept_result_question_type

  validates_inclusion_of :correct, in: [true, false]

  # This is a list of keys from the old ConceptResults records
  # that this model knows how to normalize.  Any keys that are
  # fed into create_from_json that aren't from this list,
  # will be stashed in a related extra_metadata
  # record
  KNOWN_METADATA_KEYS = [
    :answer,
    :attemptNumber,
    :correct,
    :directions,
    :instructions,
    :lastFeedback,
    :prompt,
    :questionNumber,
    :questionScore
  ]

  def self.create_from_json(data_hash)
    response = init_from_json(data_hash)
    response.save!
    response
  end

  def self.init_from_json(data_hash)
    data_hash = data_hash.deep_symbolize_keys

    metadata = parse_metadata(data_hash[:metadata])

    response = new(
      activity_session_id: data_hash[:activity_session_id],
      answer: metadata[:answer],
      concept_id: data_hash[:concept_id],
      attempt_number: metadata[:attemptNumber],
      correct: ActiveModel::Type::Boolean.new.cast(metadata[:correct]),
      old_concept_result_id: data_hash[:old_concept_result_id],
      question_number: metadata[:questionNumber],
      question_score: metadata[:questionScore]
    )

    response.assign_normalized_text(metadata, data_hash[:question_type])
    response.assign_extra_metadata(metadata)

    response
  end

  def self.bulk_create_from_json(data_hash_array)
    data_hash_array.map { |data_hash| create_from_json(data_hash) }
  end

  def self.find_or_create_from_old_concept_result(old_concept_result)
    return old_concept_result.concept_result if old_concept_result.concept_result

    data_hash = old_concept_result.as_json
    data_hash['old_concept_result_id'] = old_concept_result.id

    create_from_json(data_hash)
  end

  def self.parse_metadata(metadata)
    return metadata unless metadata.is_a?(String)
    begin
      JSON.parse(metadata).deep_symbolize_keys
    # A number of items got into the Sidekiq queue with their metadata
    # serialized using Ruby .to_s instead of .to_json.  The bug causing
    # that should be fixed, but we want to clear the queue of the weirdly
    # serialized data.
    rescue JSON::ParserError
      JSON.parse(metadata.gsub('=>', ':')).deep_symbolize_keys
    end
  end

  def self.parse_extra_metadata(metadata)
    metadata
      .deep_symbolize_keys
      .except(*KNOWN_METADATA_KEYS)
      .reject{ |_,v| v.nil? || (v.is_a?(Enumerable) && v.empty?) }
  end

  def legacy_format
    {
      id: id,
      activity_classification_id: activity_session.activity.activity_classification_id,
      activity_session_id: activity_session_id,
      concept_id: concept.id,
      question_type: concept_result_question_type&.text,
      metadata: legacy_format_metadata
    }
  end

  def assign_normalized_text(metadata, question_type)
    self.concept_result_directions = ConceptResultDirections.find_or_create_by(text: metadata[:directions])
    self.concept_result_instructions = ConceptResultInstructions.find_or_create_by(text: metadata[:instructions])
    self.concept_result_previous_feedback = ConceptResultPreviousFeedback.find_or_create_by(text: metadata[:lastFeedback])
    self.concept_result_prompt = ConceptResultPrompt.find_or_create_by(text: metadata[:prompt])
    self.concept_result_question_type = ConceptResultQuestionType.find_or_create_by(text: question_type)
  end

  def assign_extra_metadata(metadata)
    extra_metadata = self.class.parse_extra_metadata(metadata)

    return if extra_metadata.empty?

    self.extra_metadata = extra_metadata
  end

  private def legacy_format_metadata
    legacy_format_base_metadata
      .merge(extra_metadata || {})
      .reject { |_,v| v.blank? }
  end

  private def legacy_format_base_metadata
    {
      answer: answer,
      attemptNumber: attempt_number,
      correct: correct ? 1 : 0,
      directions: concept_result_directions&.text,
      instructions: concept_result_instructions&.text,
      lastFeedback: concept_result_previous_feedback&.text,
      prompt: concept_result_prompt&.text,
      questionNumber: question_number,
      questionScore: question_score
    }
  end
end
