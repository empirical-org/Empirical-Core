require 'json'
require 'rails_helper'
require 'webmock/rspec'

describe RematchResponseWorker do
  ENV['REMATCH_LAMBDA_URL'] = 'https://fake.url'
  ENV['LMS_URL'] = 'https://fake.url'
  WebMock.disable_net_connect!(allow_localhost: true)

  sample_lambda_response = {
    "id": 19262125,
    "uid": nil,
    "parent_id": "10723242",
    "parent_uid": nil,
    "question_uid": "-Km49BK-JxPlcgtO4x9P",
    "author": "Modified Word Hint",
    "text": "My brother goes jogging /day.",
    "feedback": "Revise your work. You may have mixed up a word.",
    "count": 1,
    "first_attempt_count": 0,
    "child_count": 0,
    "optimal": nil,
    "weak": false,
    "concept_results": {
        "H-2lrblngQAQ8_s-ctye4g": false
    }.stringify_keys,
    "created_at": "2019-07-09T01:36:54.360Z",
    "updated_at": "2019-07-09T01:36:54.360Z",
    "spelling_error": false
  }
  sample_partial_lambda_response = {
    "feedback": "Revise your work.",
    "spelling_error": false
  }
  subject { described_class.new }

  sample_payload = {
    "response":{
      "id":19262125,
      "uid":nil,
      "parent_id":10723242,
      "parent_uid":nil,
      "question_uid":"-Km49BK-JxPlcgtO4x9P",
      "author":"Focus Point Hint",
      "text":"My brother goes jogging /day.",
      "feedback":"\u003cp\u003e\u003cstrong\u003eTry again\u003c/strong\u003e. Do not use \u003cem\u003eday\u003c/em\u003e to describe an action. Use \u003cem\u003edaily\u003c/em\u003e to describe actions that happen every day.\u003c/p\u003e",
      "count":1,
      "first_attempt_count":0,
      "child_count":0,
      "optimal":nil,
      "weak":nil,
      "concept_results":{
        "tz_mTSJAeZq_jm4Fry_wRw":false
      },
      "created_at":"2019-07-09T01:36:54.360Z",
      "updated_at":"2019-07-09T01:36:54.360Z",
      "spelling_error":false
    },
    "type":"grammar_questions",
    "question":{
      "answers":[{"text":"My brother goes jogging {daily}."}.stringify_keys],
      "concept_uid":"tz_mTSJAeZq_jm4Fry_wRw",
      "flag":"production",
      "focusPoints":{
        "-LavTv-oaFUhre_oJAs7":{
          "conceptResults":{
            "tz_mTSJAeZq_jm4Fry_wRw":{
              "conceptUID":"tz_mTSJAeZq_jm4Fry_wRw",
              "correct":false,
              "name":"Adjectives \u0026 Adverbs | Adverbs | Adverbs of Frequency"
            }.stringify_keys
          }.stringify_keys,
          "feedback":"\u003cp\u003e\u003cstrong\u003eTry again\u003c/strong\u003e. Do not use \u003cem\u003eday\u003c/em\u003e to describe an action. Use \u003cem\u003edaily\u003c/em\u003e to describe actions that happen every day.\u003c/p\u003e",
          "order":1,
          "text":"ily|||aly"
        }.stringify_keys
      }.stringify_keys,
      "instructions":"Write this sentence using the correct underlined word.",
      "prompt":"\u003cp\u003eMy brother goes jogging \u003cu\u003edaily / day\u003c/u\u003e.\u003c/p\u003e",
      "rule_description":"\u003cbr/\u003e",
      "key":"-Km49BK-JxPlcgtO4x9P"
    }.stringify_keys,
    "referenceResponses":[{
      "id":10723242,
      "uid":nil,
      "parent_id":nil,
      "parent_uid":nil,
      "question_uid":"-Km49BK-JxPlcgtO4x9P",
      "author":nil,
      "text":"My brother goes jogging daily.",
      "feedback":"\u003cb\u003eWell done!\u003c/b\u003e That's the correct answer.",
      "count":1359,
      "first_attempt_count":1222,
      "child_count":77,
      "optimal":true,
      "weak":nil,
      "concept_results":"{\"kaQ0iXhpy1L8WvJEFeC7sg\":true}",
      "created_at":"2018-12-05T21:38:31.644Z",
      "updated_at":"2018-12-05T21:38:31.644Z",
      "spelling_error":false
    },
    {
      "id":16671745,
      "uid":nil,
      "parent_id":nil,
      "parent_uid":nil,
      "question_uid":"-Km49BK-JxPlcgtO4x9P",
      "author":"",
      "text":"my brother goes jogging daily / day.",
      "feedback":"\u003cp\u003e\u003cstrong\u003eTry again\u003c/strong\u003e. Choose either \u003cem\u003edaily\u003c/em\u003e or \u003cem\u003eday.\u003c/em\u003e\u003c/p\u003e",
      "count":4,
      "first_attempt_count":2,
      "child_count":0,
      "optimal":false,
      "weak":false,
      "concept_results":{"tz_mTSJAeZq_jm4Fry_wRw":false},
      "created_at":"2019-04-01T16:54:38.819Z",
      "updated_at":"2019-04-23T14:58:55.512Z",
      "spelling_error":false
    }]
  }.stringify_keys


  describe '#perform' do
    let(:response) { Response.create(sample_payload['response']) }
    let(:reference_responses) do
      sample_payload["referenceResponses"].map do |params|
        create(:response, params)
      end
    end

    it 'should update the response based on the lambda payload' do
      stub_request(:post, /#{ENV['REMATCH_LAMBDA_URL']}/)
        .to_return(status: 200, body: sample_lambda_response.to_json, headers: {})

      reference_response_ids = reference_responses.map { |r| r.id }

      expect(subject).to receive(:rematch_response).with(response, sample_payload['type'], sample_payload['question'], reference_responses).and_call_original
      subject.perform(response.id, sample_payload['type'], sample_payload['question'], reference_response_ids)
      response.reload
      expect(response.feedback).to eq(sample_lambda_response[:feedback])
    end

    it 'should raise an Net::HTTPRetriableError on Gateway Timeout' do
      stub_request(:post, /#{ENV['REMATCH_LAMBDA_URL']}/)
        .to_return(status: [504, "Gateway timed out"])
      expect{subject.rematch_response(response, sample_payload['type'], sample_payload['question'], sample_payload['reference_responses'])}.to raise_error(Net::HTTPRetriableError)
    end
  end

  describe "#construct_lambda_payload" do
    it 'should take the params and return an appropriately-shaped hash' do
      result = subject.construct_lambda_payload(
        "Response Object",
        "Question Type String",
        "Question Object",
        "Array of Human-graded Response Objects")
      expect(result.stringify_keys).to eq({
        response: "Response Object",
        type: "Question Type String",
        question: "Question Object",
        referenceResponses: "Array of Human-graded Response Objects"
      }.stringify_keys)
    end
  end

  describe "#call_http_lambda_endpoint" do
    it 'should make an HTTP request and return the response payload' do
      stub_request(:post, /#{ENV['REMATCH_LAMBDA_URL']}/)
        .to_return(status: 200, body: sample_lambda_response.to_json, headers: {})

      result = subject.call_lambda_http_endpoint({})
      expect(result.stringify_keys).to eq(sample_lambda_response.stringify_keys)
    end

    it 'should make an HTTP request and raise LambdaHTTPError when status is 504' do
      stub_request(:post, /#{ENV['REMATCH_LAMBDA_URL']}/)
        .to_return(status: 504, body: sample_lambda_response.to_json, headers: {})

      expect do
        subject.call_lambda_http_endpoint({})
      end.to raise_error(Net::HTTPRetriableError)
    end

    it 'should make an HTTP request and raise LambdaHTTPError when status is not 200' do
      stub_request(:post, /#{ENV['REMATCH_LAMBDA_URL']}/)
        .to_return(status: 503, body: sample_lambda_response.to_json, headers: {})

      expect do
        subject.call_lambda_http_endpoint({})
      end.to raise_error(RematchResponseWorker::LambdaHTTPError)
    end
  end

  describe "#sanitize_update_params" do
    it 'should strip out non-permitted params' do
      sanitized_response = subject.sanitize_update_params(sample_lambda_response)
      sanitized_response.keys.each do |k|
        expect(RematchResponseWorker::DEFAULT_PARAMS_HASH.keys).to include(k)
      end
    end

    it 'should contain default values for params not included in argument object' do
      sanitized_response = subject.sanitize_update_params(sample_partial_lambda_response)
      RematchResponseWorker::DEFAULT_PARAMS_HASH.keys.each do |k|
        expect(sanitized_response.keys).to include(k)
      end
    end
  end
end
