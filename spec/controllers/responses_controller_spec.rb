require "rails_helper"

RSpec.describe ResponsesController, type: :controller do

  def hashify_nested_ar_objects(array)
    array.map { |obj| obj.attributes }
  end

  def get_ids(array)
    array.map { |r| r['id'] }
  end

  describe 'POST #batch_responses_for_lesson' do
    it 'returns an object with question uids as keys and an array of responses as values' do
      question_uids = [1, 2, 3, 4, 5]
      10.times { Response.create(question_uid: question_uids.sample) }
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
  end

end
