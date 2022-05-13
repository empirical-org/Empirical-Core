# frozen_string_literal: true

# == Schema Information
#
# Table name: student_responses
#
#  id                                         :bigint           not null, primary key
#  attempt_number                             :integer          not null
#  correct                                    :boolean          not null
#  question_number                            :integer          not null
#  question_score                             :float
#  created_at                                 :datetime         not null
#  activity_session_id                        :bigint           not null
#  question_id                                :bigint           not null
#  student_response_answer_text_id            :bigint           not null
#  student_response_directions_text_id        :bigint           not null
#  student_response_instructions_text_id      :bigint           not null
#  student_response_previous_feedback_text_id :bigint           not null
#  student_response_prompt_text_id            :bigint           not null
#  student_response_question_type_id          :bigint           not null
#
# Indexes
#
#  idx_student_responses_on_student_response_instructions_text_id  (student_response_instructions_text_id)
#  idx_student_responses_on_student_response_previous_feedback_id  (student_response_previous_feedback_text_id)
#  index_student_responses_on_activity_session_id                  (activity_session_id)
#  index_student_responses_on_question_id                          (question_id)
#  index_student_responses_on_student_response_answer_text_id      (student_response_answer_text_id)
#  index_student_responses_on_student_response_directions_text_id  (student_response_directions_text_id)
#  index_student_responses_on_student_response_prompt_text_id      (student_response_prompt_text_id)
#  index_student_responses_on_student_response_question_type_id    (student_response_question_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_session_id => activity_sessions.id)
#  fk_rails_...  (student_response_answer_text_id => student_response_answer_texts.id)
#  fk_rails_...  (student_response_directions_text_id => student_response_directions_texts.id)
#  fk_rails_...  (student_response_instructions_text_id => student_response_instructions_texts.id)
#  fk_rails_...  (student_response_previous_feedback_text_id => student_response_previous_feedback_texts.id)
#  fk_rails_...  (student_response_prompt_text_id => student_response_prompt_texts.id)
#  fk_rails_...  (student_response_question_type_id => student_response_question_types.id)
#
class StudentResponse < ApplicationRecord
  belongs_to :activity_session
  belongs_to :question
  belongs_to :student_response_answer_text
  belongs_to :student_response_directions_text
  belongs_to :student_response_instructions_text
  belongs_to :student_response_previous_feedback_text
  belongs_to :student_response_prompt_text
  belongs_to :student_response_question_type

  has_one :student_response_extra_metadata, dependent: :destroy

  has_one :student_response_concept_result, dependent: :destroy
  has_one :concept_result, through: :student_response_concept_result

  has_many :student_responses_concepts, dependent: :destroy
  has_many :concepts, through: :student_responses_concepts


  validates_exclusion_of :correct, in: [nil]
  validates_presence_of :attempt_number, :question_number

  # This is a list of keys from the old ConceptResults records
  # that this model knows how to normalize.  Any keys that are
  # fed into create_from_json that aren't from this list,
  # will be stashed in a related StudentResponseExtraMetadata
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
    data_hash = data_hash.deep_symbolize_keys

    metadata = data_hash[:metadata]

    answer_text = StudentResponseAnswerText.find_or_create_by(answer: metadata[:answer] || '')
    directions_text = StudentResponseDirectionsText.find_or_create_by(text: metadata[:directions] || '')
    instructions_text = StudentResponseInstructionsText.find_or_create_by(text: metadata[:instructions] || '')
    previous_feedback_text = StudentResponsePreviousFeedbackText.find_or_create_by(text: metadata[:lastFeedback] || '')
    prompt_text = StudentResponsePromptText.find_or_create_by(text: metadata[:prompt] || '')
    question_type = StudentResponseQuestionType.find_or_create_by(text: data_hash[:question_type] || '')

    question = calculate_question_from_hash(data_hash)

    # Make sure that singular concept_id gets converted to array of
    # conept_ids if that hasn't been done by an earlier step
    data_hash[:concept_ids] = [data_hash[:concept_id]] unless data_hash.key?(:concept_ids) && !data_hash[:concept_ids].empty?

    extra_metadata = extract_extra_metadata(metadata)

    create(
      activity_session_id: data_hash[:activity_session_id],
      concept_ids: data_hash[:concept_ids].uniq,
      attempt_number: metadata[:attemptNumber],
      correct: metadata[:correct],
      question: question,
      question_number: metadata[:questionNumber],
      question_score: metadata[:questionScore],
      student_response_answer_text: answer_text,
      student_response_directions_text: directions_text,
      student_response_instructions_text: instructions_text,
      student_response_extra_metadata: extra_metadata,
      student_response_previous_feedback_text: previous_feedback_text,
      student_response_prompt_text: prompt_text,
      student_response_question_type: question_type
    )
  end

  def self.create_from_concept_result(concept_result)
    return if concept_result.student_response

    student_response = StudentResponse.find_by(
      activity_session: concept_result.activity_session,
      attempt_number: concept_result.metadata['attemptNumber'],
      question_number: concept_result.metadata['questionNumber']
    )

    StudentResponse.transaction do
      # Create a totally new record if there isn't one yet
      if !student_response
        student_response = create_from_json(concept_result.as_json)
      # If we have a student_response, but it doesn't have a the relevant
      # Concept related, add the relation.
      # This happens because old ConceptResult records do a row per Concept,
      # while we do a row per answer (using multiple StudentResponseConcept
      # records if there are multiple Concepts)
      elsif !student_response.concepts.include?(concept_result.concept)
        student_response.concepts.append(concept_result.concept)
      end

      # Whether we create a new record, or add a concept, we should ensure
      # that we record a relation to the source concept_result so we can
      # skip migrating it in future runs
      student_response.concept_result = concept_result
      student_response.save!
    end
    student_response
  end

  def legacy_format
    concepts.map do |concept|
      {
        id: id,
        activity_classification_id: activity_session.activity.activity_classification_id,
        activity_session_id: activity_session_id,
        concept_id: concept.id,
        question_type: student_response_question_type.text,
        metadata: {
          answer: student_response_answer_text.answer,
          attemptNumber: attempt_number,
          correct: correct ? 1 : 0,
          directions: student_response_directions_text.text,
          instructions: student_response_instructions_text.text,
          lastFeedback: student_response_previous_feedback_text.text,
          prompt: student_response_prompt_text.text,
          questionNumber: question_number,
          questionScore: question_score
        }.merge(student_response_extra_metadata || {})
         .reject { |_,v| v.blank? }
      }
    end
  end

  def self.bulk_create_from_json(data_hash_array)
    normalized_data_hash = roll_up_concepts(data_hash_array)

    normalized_data_hash.map { |data_hash| create_from_json(data_hash) }
  end

  private_class_method def self.extract_extra_metadata(metadata)
    extra_metadata = metadata.except(*KNOWN_METADATA_KEYS).reject{ |_,v| v.nil? || (v.is_a?(Enumerable) && v.empty?) }

    return if extra_metadata.empty?

    StudentResponseExtraMetadata.new(metadata: extra_metadata)
  end

  # Takes an input of hashes representing old-style ConceptResult
  # and rolls them up so that a single response has only one entry
  # plus an array of concept_ids that match to it
  private_class_method def self.roll_up_concepts(data_hash_array)
    data_hash_array.reduce({}) do |rollup, value|
      key = "#{value[:metadata][:questionNumber]}-#{value[:metadata][:attemptNumber]}"
      if rollup[key]
        rollup[key][:concept_ids].push(value[:concept_id])
      else
        rollup[key] = value.merge(concept_ids: [value[:concept_id]])
      end
      rollup
    end.values
  end

  private_class_method def self.calculate_question_from_hash(data_hash)
    question_uid = data_hash[:question_uid] || data_hash[:questionUid]
    unless question_uid
      activity_session = ActivitySession.find(data_hash[:activity_session_id])
      question_index = data_hash[:metadata][:questionNumber] - 1
      question_uid = activity_session.activity.data['questions'][question_index]['key']
    end
    Question.find_by_uid!(question_uid)
  end
end
