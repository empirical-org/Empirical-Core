require 'json'
require 'net/http'

MAX_RETRIES = 3

class RematchResponseWorker
  include Sidekiq::Worker

  ALLOWED_PARAMS = [
    "parent_id",
    "author",
    "feedback",
    "optimal",
    "weak",
    "concept_results",
    "spelling_error",
  ].freeze

  def perform(response_id, question_type, question_uid)
    response = Response.find_by(id: response_id)
    question = retrieve_question_from_firebase(question_uid, question_type)
    return unless question
    reference_responses = get_human_graded_responses(question_uid).to_a
    rematch_response(response, question_type, question, reference_responses)
  end

  def rematch_response(response, question_type, question, reference_responses)
    lambda_payload = construct_lambda_payload(response, question_type, question, reference_responses)
    updated_response = call_lambda_http_endpoint(lambda_payload)
    sanitized_response = sanitize_update_params(updated_response)
    response.update_attributes(sanitized_response)
  end

  def sanitize_update_params(params)
    params.keys.each do |k|
      params.delete(k) unless ALLOWED_PARAMS.include?(k)
    end
    params
  end

  def construct_lambda_payload(response, question_type, question, reference_responses)
    {
      response: response,
      type: question_type,
      question: question,
      referenceResponses: reference_responses
    }
  end

  def call_lambda_http_endpoint(lambda_payload)
    uri = URI(ENV['REMATCH_LAMBDA_URL'])
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    resp = http.post uri,
                     lambda_payload.to_json,
                     "Content-Type" => "application/json"
    raise Net::HTTPRetriableError.new("Timed out rematching response #{lambda_payload[:response][:id]}", 504) if resp.is_a?(Net::HTTPGatewayTimeOut)
    JSON.parse(resp.body)
  end

  def get_human_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where.not(optimal: nil)
            .where(parent_id: nil)
  end

  def retrieve_question_from_firebase(question_uid, question_type)
    uri = URI(ENV['FIREBASE_URL'])
    path = get_firebase_path(question_uid, question_type)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    resp = http.get path
    question = JSON.parse(resp.body)
    return unless question
    question[:key] = question_uid
    question.stringify_keys
  end

  def get_firebase_path(question_uid, question_type)
    if question_type == 'grammar_questions'
      return "/v3/questions/#{question_uid}.json"
    else
      return "/v2/#{question_type}/#{question_uid}.json"
    end
  end

end
