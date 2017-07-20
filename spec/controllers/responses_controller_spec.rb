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
        expect(get_ids(parsed_response["#{quid}"])).to eq(get_ids(hashify_nested_ar_objects(questions_with_responses[quid])))
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
      expect(get_ids(parsed_response["#{quid}"])).to eq(filter_optimal_nil_responses(hashify_nested_ar_objects(questions_with_responses[quid])))
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
      expect(get_ids(parsed_response["#{quid}"])).to eq(filter_responses_with_parent_id(hashify_nested_ar_objects(questions_with_responses[quid])))
    end
  end

end


end
