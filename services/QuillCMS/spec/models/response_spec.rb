require "rails_helper"

RSpec.describe Response do
  context "ActiveRecord callbacks" do
    it "after_create_commit calls #create_index_in_elastic_search" do
      response = Response.new()
      expect(response).to receive(:create_index_in_elastic_search)
      response.save
    end

    it "after_update_commit calls #update_index_in_elastic_search" do
      response = Response.create()
      expect(response).to receive(:update_index_in_elastic_search)
      response.update(text: 'covfefe')
    end

    it "after_update_commit calls #destroy_index_in_elastic_search" do
      response = Response.create()
      expect(response).to receive(:destroy_index_in_elastic_search)
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
end
