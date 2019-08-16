require 'json'
require 'net/http'

class RematchResponsesForQuestionWorker
  include Sidekiq::Worker

  def perform(question_uid, question_type)
    responses_to_reprocess = get_ungraded_responses(question_uid) + get_machine_graded_responses(question_uid)
    responses_to_reprocess.each do |response|
      RematchResponseWorker.perform_async(response.id, question_type, question_uid)
    end
  end

  def get_ungraded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where(parent_id: nil)
            .where(parent_uid: nil)
            .where(optimal: nil)
  end

  def get_machine_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where("responses.parent_id IS NOT NULL OR responses.parent_uid IS NOT NULL")
  end

end
