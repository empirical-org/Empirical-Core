require 'json'
require 'net/http'

class RematchResponsesForQuestionWorker
  include Sidekiq::Worker
  sidekiq_options retry: 3

  def perform(question_uid, question_type)
    response_ids_to_reprocess = get_ungraded_responses(question_uid) + get_machine_graded_responses(question_uid)
    reference_response_ids = get_human_graded_response_ids(question_uid)
    response_ids_to_reprocess.each do |response_id|
      RematchResponseWorker.perform_async(response_id, question_type, question_uid, reference_response_ids)
    end
  end

  def get_ungraded_response_ids(question_uid)
    Response.where(question_uid: question_uid)
            .where(parent_id: nil)
            .where(parent_uid: nil)
            .where(optimal: nil)
            .pluck(:id)
  end

  def get_machine_graded_responses_ids(question_uid)
    Response.where(question_uid: question_uid)
            .where("responses.parent_id IS NOT NULL OR responses.parent_uid IS NOT NULL")
            .pluck(:id)
  end

  def get_human_graded_response_ids(question_uid)
    Response.where(question_uid: question_uid)
            .where.not(optimal: nil)
            .where(parent_id: nil)
            .pluck(:id)
  end
end
