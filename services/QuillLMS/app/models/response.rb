# frozen_string_literal: true

# == Schema Information
#
# Table name: responses
#
#  id                            :bigint           not null, primary key
#  answer                        :jsonb
#  attempt_number                :integer
#  correct                       :boolean          not null
#  extra_metadata                :jsonb
#  question_number               :integer
#  question_score                :float
#  created_at                    :datetime         not null
#  activity_session_id           :integer          not null
#  concept_id                    :integer
#  concept_result_id             :integer
#  response_directions_id        :integer
#  response_instructions_id      :integer
#  response_previous_feedback_id :integer
#  response_prompt_id            :integer
#  response_question_type_id     :integer
#
# Indexes
#
#  index_responses_on_concept_result_id  (concept_result_id) UNIQUE
#
class Response < ApplicationRecord
  belongs_to :activity_session
  belongs_to :concept
  belongs_to :concept_result
  belongs_to :response_directions
  belongs_to :response_instructions
  belongs_to :response_previous_feedback
  belongs_to :response_prompt
  belongs_to :response_question_type

  validates_exclusion_of :correct, in: [nil]

  # This is a list of keys from the old ConceptResults records
  # that this model knows how to normalize.  Any keys that are
  # fed into create_from_json that aren't from this list,
  # will be stashed in a related ResponseExtraMetadata
  # record
  KNOWN_METADATA_KEYS = [
    :answer,
    :attemptNumber,
    :correct,
    :directions,
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

    metadata = data_hash[:metadata]

    response = new(
      activity_session_id: data_hash[:activity_session_id],
      answer: metadata[:answer],
      concept_id: data_hash[:concept_id],
      attempt_number: metadata[:attemptNumber],
      correct: metadata[:correct],
      question_number: metadata[:questionNumber],
      question_score: metadata[:questionScore]
    )

    response.assign_normalized_text(data_hash)
    response.assign_extra_metadata(metadata)

    response
  end

  def self.bulk_create_from_json(data_hash_array)
    data_hash_array.map { |data_hash| create_from_json(data_hash) }
  end

  def self.find_or_create_from_concept_result(concept_result)
    return concept_result.response if concept_result.response

    create_from_json(concept_result.as_json)
  end

  def self.parse_extra_metadata(metadata)
    metadata.deep_symbolize_keys.except(*KNOWN_METADATA_KEYS).reject{ |_,v| v.nil? || (v.is_a?(Enumerable) && v.empty?) }
  end

  def legacy_format
    {
      id: id,
      activity_classification_id: activity_session.activity.activity_classification_id,
      activity_session_id: activity_session_id,
      concept_id: concept.id,
      question_type: response_question_type&.text,
      metadata: legacy_format_metadata
    }
  end

  def assign_normalized_text(data_hash)
    metadata = data_hash[:metadata]

    self.response_directions = ResponseDirections.find_or_create_by(text: metadata[:directions])
    self.response_instructions = ResponseInstructions.find_or_create_by(text: metadata[:instructions])
    self.response_previous_feedback = ResponsePreviousFeedback.find_or_create_by(text: metadata[:lastFeedback])
    self.response_prompt = ResponsePrompt.find_or_create_by(text: metadata[:prompt])
    self.response_question_type = ResponseQuestionType.find_or_create_by(text: data_hash[:question_type])
  end

  def assign_extra_metadata(metadata)
    extra_metadata = self.class.parse_extra_metadata(metadata)

    return if extra_metadata.empty?

    self.extra_metadata = extra_metadata
  end

  private def legacy_format_metadata
    legacy_format_base_metadata
      .merge!(extra_metadata || {})
      .reject { |_,v| v.blank? }
  end

  private def legacy_format_base_metadata
    {
      answer: answer,
      attemptNumber: attempt_number,
      correct: correct ? 1 : 0,
      directions: response_directions&.text,
      instructions: response_instructions&.text,
      lastFeedback: response_previous_feedback&.text,
      prompt: response_prompt&.text,
      questionNumber: question_number,
      questionScore: question_score
    }
  end
end
