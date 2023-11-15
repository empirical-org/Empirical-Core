require "rails_helper"

RSpec.describe Response do
  context "ActiveRecord callbacks" do
    it "after_create_commit calls #create_index_in_elastic_search and #wipe_question_cache" do
      response = Response.new()
      expect(response).to receive(:create_index_in_elastic_search)
      expect(response).to receive(:conditional_wipe_question_cache)
      response.save
    end

    it "after_update_commit calls #update_index_in_elastic_search and #conditional_wipe_question_cache" do
      response = Response.create()
      expect(response).to receive(:update_index_in_elastic_search)
      expect(response).to receive(:conditional_wipe_question_cache)
      response.update(text: 'covfefe')
    end

    it "before_destroy calls #destroy_index_in_elastic_search and #wipe_question_cache" do
      response = Response.create()
      expect(response).to receive(:destroy_index_in_elastic_search)
      expect(response).to receive(:wipe_question_cache)
      response.destroy
    end

  end

  describe "validates unique question_uid + text" do
    let(:response) { create(:response) }

    it "should be invalid if you have a duplicate question_uid and text" do
      new_response = Response.create(question_uid: response.question_uid, text: response.text)
      expect(new_response.valid?).to be false
      expect(new_response.errors.messages[:question_uid]).to eq(["has already been taken"])
    end

    it "should be valid if you have a duplicate question_uid and new text" do
      new_response = Response.create(question_uid: response.question_uid, text: 'New unique text')
      expect(new_response.valid?).to be true
    end

    it "should be valid if you have a new question_uid with duplicate text" do
      new_response = Response.create(question_uid: 'unique-question-uid', text: response.text)
      expect(new_response.valid?).to be true
    end
  end

  describe '#wipe_question_cache' do
    let(:question_uid) { 'some-unique-uid' }
    let(:cache_key) { Response.questions_cache_key(question_uid) }

    before do
      Rails.cache.write(cache_key, 'cached content')
    end

    it 'clears the cache for the given question UID' do
      expect(Rails.cache.read(cache_key)).to eq('cached content')

      response = Response.create(question_uid: question_uid)
      response.wipe_question_cache

      expect(Rails.cache.read(cache_key)).to be_nil
    end
  end

  describe '#conditional_wipe_question_cache' do
  let(:response) { Response.create() }

  context 'when non-count attributes are updated' do
    it 'calls wipe_question_cache' do
      expect(response).to receive(:wipe_question_cache)
      response.update(text: 'new text')
    end
  end

  context 'when both count and non-count attributes are updated' do
    it 'calls wipe_question_cache' do
      expect(response).to receive(:wipe_question_cache)
      response.update(text: 'new text', count: 10)
    end
  end

  context 'when only count, child_count, or first_attempt_count are updated' do
    it 'does not call wipe_question_cache when count is updated' do
      expect(response).not_to receive(:wipe_question_cache)
      response.update(count: 5)
    end

    it 'does not call wipe_question_cache when child_count is updated' do
      expect(response).not_to receive(:wipe_question_cache)
      response.update(child_count: 3)
    end

    it 'does not call wipe_question_cache when first_attempt_count is updated' do
      expect(response).not_to receive(:wipe_question_cache)
      response.update(first_attempt_count: 2)
    end
  end
end

end
