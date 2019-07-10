require 'json'
require 'net/http'

class RematchResponse
  include Sidekiq::Worker

  def perform(response_id, question_type, question)
    response = Response.find_by(id: response_id)
    updated_response = call_lambda_http_endpoint(response, question_type, question)
    response.update_attributes(updated_response)
  end

  def call_lambda_http_endpoint(response, question_type, question)
    # "https://p8147zy7qj.execute-api.us-east-1.amazonaws.com/prod"
    url = URI.parse(ENV['REMATCH_LAMBDA_URL'])
    req = Net::HTTP::Post.new(url.to_s, {'Content-Type' => 'application/json'}
    req.body = {
      response: response,
      type: question_type,
      question: question
    }.to_json
    res = Net::HTTP.start(url.host, url, port) { |http|
      http.request(req)
    }
    JSON.parse(res.body)
  end

end
