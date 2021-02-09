require 'test_helper'

module Comprehension
  class PlagiarismTextTest < ActiveSupport::TestCase
    context 'relations' do
      should belong_to(:rule)
    end

    context 'validations' do
      should validate_presence_of(:rule)
      should validate_presence_of(:text)
    end

    context 'serializable_hash' do
      setup do
        @plagiarism_text = create(:comprehension_plagiarism_text)
      end

      should 'fill out hash with all fields' do
        json_hash = @plagiarism_text.as_json

        assert_equal json_hash['id'], @plagiarism_text.id
        assert_equal json_hash['text'], @plagiarism_text.text
      end
    end
  end
end
