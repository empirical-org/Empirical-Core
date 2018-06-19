require 'rails_helper'

RSpec.describe "VocabularyWords", type: :request do
  describe "GET /vocabulary_words" do
    it "works! (now write some real specs)" do
      get vocabulary_words_path
      expect(response).to have_http_status(200)
    end
  end
end
