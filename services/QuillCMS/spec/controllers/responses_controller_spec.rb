require "rails_helper"

RSpec.describe ResponsesController, type: :controller do

  def hashify_nested_ar_objects(array)
    array&.map { |obj| obj.attributes }
  end

  def get_ids(array)
    return [] if array.nil?

    array.map { |r| r['id'] }.sort
  end

  def filter_optimal_nil_responses(array)
    get_ids(array&.reject { |r| r['optimal'].nil?})
  end

  def filter_responses_with_parent_id(array)
    get_ids(array&.select { |r| r['parent_id'].nil?})
  end

  describe "#count_affected_by_incorrect_sequences" do
    before do
      create(:response, question_uid: '123', text: "some words", optimal: nil)
      create(:response, question_uid: '123', text: "matchyword some words", optimal: nil)
      create(:response, question_uid: '123', text: "some matchyword words", optimal: nil)
    end

    it 'should enumerate matching responses' do
      post :count_affected_by_incorrect_sequences, params: {
        "data" => {
          "used_sequences"=>[],
          "selected_sequences"=>["matchyword", ""]
          },
          "question_uid"=>'123',
          "response"=>{}
      }
      matched_count = JSON.parse(response.body)["matchedCount"]
      expect(matched_count).to eq 2
    end

    it 'should enumerate matching responses with && delimited input' do
      post :count_affected_by_incorrect_sequences, params: {
        "data" => {
          "used_sequences"=>[],
          "selected_sequences"=>["matchyword&&some", ""]
          },
          "question_uid"=>'123',
          "response"=>{}
      }
      matched_count = JSON.parse(response.body)["matchedCount"]
      expect(matched_count).to eq 2
    end

    it 'should not match when sequences are already used' do
      post :count_affected_by_incorrect_sequences, params: {
        "data" => {
          "used_sequences"=>['matchyword'],
          "selected_sequences"=>["matchy&&word", ""]
          },
          "question_uid"=>'123',
          "response"=>{}
      }
      matched_count = JSON.parse(response.body)["matchedCount"]
      expect(matched_count).to eq 0
    end

  end

  describe '#create_or_increment' do
    let(:q_response) { create(:response, question_uid: '123456', text: 'Reading is fundamental.') }
    let(:response_payload) { {question_uid: q_response.question_uid, text: q_response.text} }

    before do
      allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
    end

    it 'should enqueue CreateOrIncrementResponseWorker' do
      expect(CreateOrIncrementResponseWorker).to receive(:perform_async).with(response_payload)
      post :create_or_increment, params: {response: response_payload}

    end

    it 'should return a 200' do
      allow(CreateOrIncrementResponseWorker).to receive(:perform_async)
      post :create_or_increment, params: {response: response_payload}
      expect(response.status).to eq(200)
    end
  end

  describe '#create_or_update' do
    let(:client) { double(:client, trigger: true) }

    before do
      allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
      allow_any_instance_of(Response).to receive(:update_index_in_elastic_search)
      ENV['PUSHER_APP_ID'] = 'pusher-app-id'
      ENV['PUSHER_KEY'] = 'pusher-key'
      ENV['PUSHER_SECRET'] = 'pusher-secret'
      allow(Pusher::Client).to receive(:new) { client }
    end

    it 'should create a new response if the response text does not exist' do
      count = Response.count
      response_payload = {question_uid: '12345', text: 'response text', optimal: true}

      expect(Pusher::Client).to receive(:new).with(
        app_id: ENV['PUSHER_APP_ID'],
        key: ENV['PUSHER_KEY'],
        secret: ENV['PUSHER_SECRET'],
        encrypted: true
      )
      expect(client).to receive(:trigger).with("admin-12345", "new-response", message: "time to reload!")
      post :create_or_update, params: {response: response_payload}

      expect(Response.count).to eq(count+1)
      new_response = Response.find_by(text: response_payload[:text])
      expect(new_response.text).to eq(response_payload[:text])
      expect(new_response.question_uid).to eq(response_payload[:question_uid])
      expect(new_response.optimal).to eq(response_payload[:optimal])

      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)['text']).to eq(response_payload[:text])
      expect(JSON.parse(response.body)['question_uid']).to eq(response_payload[:question_uid])
      expect(JSON.parse(response.body)['optimal']).to eq(response_payload[:optimal])
    end

    it 'should update an old response with new attributes if the response text exists' do
      new_response = create(:response, question_uid: '123456', text: 'Reading is fundamental.', optimal: false, concept_results: {"12345": false})
      response_payload = {question_uid: new_response.question_uid, text: new_response.text, optimal: true,  concept_results: {"12345": true}}
      post :create_or_update, params: {response: response_payload}

      new_response.reload

      expect(new_response.optimal).to eq(true)
      expect(new_response.concept_results).to eq({"12345"=> true})
    end
  end

  describe 'POST #batch_responses_for_lesson' do

  it 'returns an object with question uids as keys and an array of responses as values' do
    question_uids = [1, 2, 3, 4, 5]
    true_or_false = [true, false]
    10.times { Response.create(question_uid: question_uids.sample, optimal: true_or_false.sample) }
    post :batch_responses_for_lesson, params: {question_uids: question_uids}
    questions_with_responses = {}
    question_uids.each do |uid|
      questions_with_responses[uid] = Response.where(question_uid: uid)
    end

    parsed_response = (JSON.parse(response.body))['questionsWithResponses']

    # because of the nested structure of these values and the difficulty of comparing json strings and active record objects,
    # we are checking to see if each key in the returned json hash contains objects with the ids of the active record responses
    # that have that question uid
    question_uids.each do |quid|
      expect(get_ids(parsed_response[quid.to_s])).to eq(get_ids(hashify_nested_ar_objects(questions_with_responses[quid])))
    end

  end

  it 'will not return responses with optimal nil' do
    question_uids = [1, 2, 3, 4, 5]
    true_false_or_nil = [true, false, nil]
    10.times { Response.create(question_uid: question_uids.sample, optimal: true_false_or_nil.sample) }
    post :batch_responses_for_lesson, params: {question_uids: question_uids}
    questions_with_responses = {}
    question_uids.each do |uid|
      questions_with_responses[uid] = Response.where(question_uid: uid)
    end

    parsed_response = (JSON.parse(response.body))['questionsWithResponses']

    # because of the nested structure of these values and the difficulty of comparing json strings and active record objects,
    # we are checking to see if each key in the returned json hash contains objects with the ids of the active record responses
    # that have that question uid
    question_uids.each do |quid|
      expect(get_ids(parsed_response[quid.to_s])).to eq(filter_optimal_nil_responses(hashify_nested_ar_objects(questions_with_responses[quid])))
    end
  end

  it 'will not return responses with a parent id' do
    question_uids = [1, 2, 3, 4, 5]
    true_or_false = [true, false]
    parent_id = [nil, 1]
    10.times { Response.create(question_uid: question_uids.sample, optimal: true_or_false.sample, parent_id: parent_id.sample) }
    post :batch_responses_for_lesson, params: {question_uids: question_uids}
    questions_with_responses = {}
    question_uids.each do |uid|
      questions_with_responses[uid] = Response.where(question_uid: uid)
    end

    parsed_response = (JSON.parse(response.body))['questionsWithResponses']

    # because of the nested structure of these values and the difficulty of comparing json strings and active record objects,
    # we are checking to see if each key in the returned json hash contains objects with the ids of the active record responses
    # that have that question uid
    question_uids.each do |quid|
      expect(get_ids(parsed_response[quid.to_s])).to eq(filter_responses_with_parent_id(hashify_nested_ar_objects(questions_with_responses[quid])))
    end
  end

end

  describe "#concept_results_to_boolean" do
    it "should return a hash of keys with booleans based on the input hash" do
      input = {:foo => "bar"}
      output = controller.send(:concept_results_to_boolean, input)
      expect(output.keys).to eq(input.keys)
    end

    it "should evaluate hash values of boolean true as true" do
      input = {foo: true}
      output = controller.send(:concept_results_to_boolean, input)
      expect(output[:foo]).to eq(true)
    end

    it "should evaluate hash values of string 'true' as true" do
      input = {:foo => 'true'}
      output = controller.send(:concept_results_to_boolean, input)
      expect(output[:foo]).to eq(true)
    end

    it "should extract conceptUID and correct from sub-hash values" do
      input = {foo: {'conceptUID' => 'mock_uid',
                     'correct' => 'true'}}
      output = controller.send(:concept_results_to_boolean, input)
      expect(output['mock_uid']).to eq(true)
    end
  end

  describe 'question_dashboard_data' do
    before do
      allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
    end

    let!(:question_uid) { SecureRandom.uuid}
    let!(:response1) { create(:response, question_uid: question_uid, optimal: nil, count: 20)}
    let!(:response2) { create(:response, question_uid: question_uid, optimal: false, author: "Modified Word Hint", count: 20)}
    let!(:response3) { create(:response, question_uid: question_uid, optimal: false, author: "Required Words Hint", count: 20)}
    let!(:response4) { create(:response, question_uid: question_uid, optimal: false, author: "Spelling Hint", count: 20)}
    let!(:response5) { create(:response, question_uid: question_uid, optimal: true, count: 20)}

    it 'gets question dashboard data' do
      get :question_dashboard, params: { question_uid: question_uid}

      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)['percent_common_unmatched']).to eq(20)
      expect(JSON.parse(response.body)['percent_specified_algos']).to eq(40)
    end
  end

  describe 'rematch_all_responses_for_question' do
    it 'queues a job without delay as default' do
      expect(RematchResponsesForQuestionWorker).to receive(:perform_in).with(0, '123', 'some_type')

      post :rematch_all_responses_for_question, params: { uid: '123', type: 'some_type'}
    end

    it 'queues a job with delay when delay is passed in' do
      expect(RematchResponsesForQuestionWorker).to receive(:perform_in).with('999', '123', 'some_type')

      post :rematch_all_responses_for_question, params: { uid: '123', type: 'some_type', delay: '999'}
    end
  end
end
