require 'json'
require 'net/http'

MAX_RETRIES = 3

class RematchResponseWorker
  include Sidekiq::Worker

  def perform(response_id, question_type, question_uid, retry_count=0)
    response = Response.find_by(id: response_id)
    question = retrieve_question_from_firebase(question_uid, question_type)
    reference_responses = get_human_graded_responses(question_uid).to_a
    rematch_response(response, question_type, question, reference_responses, retry_count)
  end

  def rematch_response(response, question_type, question, reference_responses, retry_count=0)
    lambda_payload = construct_lambda_payload(response, question_type, question, reference_responses)
    updated_response = call_lambda_http_endpoint(lambda_payload)
    if updated_response["message"] == "Endpoint request timed out"
      if retry_count < MAX_RETRIES
        RematchResponseWorker.perform_async(response.id, question_type, question["key"], retry_count+1)
      else
        raise "Retry limit exceeded for Response: #{response.id}"
      end
    else
      updated_response.delete("created_at")
      response.update_attributes(updated_response)
    end
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
    http = Net::HTTP.new(uri.host)
    http.use_ssl = true
    resp = http.post uri,
                     lambda_payload.to_json,
                     "Content-Type" => "application/json"
    JSON.parse(resp.body)
  end

  def get_human_graded_responses(question_uid)
    Response.where(question_uid: question_uid)
            .where.not(optimal: nil)
            .where(parent_id: nil)
  end

  def retrieve_question_from_firebase(question_uid, question_type)
    url = get_firebase_url(question_uid, question_type)
    uri = URI(url)
    http = Net::HTTP.new(uri.host)
    http.use_ssl = true
    resp = http.get uri
    question = JSON.parse(resp.body)
    question[:key] = question_uid
    question.stringify_keys
  end

  def get_firebase_url(question_uid, question_type)
    if question_type == 'grammar_questions'
      return "#{ENV['FIREBASE_URL']}/v3/questions/#{question_uid}.json"
    else
      return "#{ENV['FIREBASE_URL']}/v2/#{question_type}/#{question_uid}.json"
    end
  end

end
