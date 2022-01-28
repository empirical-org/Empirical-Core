# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(PlagiarismText, :type => :model) do

    context 'relations' do
      it { should belong_to(:rule) }
    end

    context 'should validations' do

      it { should validate_presence_of(:rule) }

      it { should validate_presence_of(:text) }
    end

    context 'should serializable_hash' do
      let!(:plagiarism_text) { create(:evidence_plagiarism_text) }

      it "fill out hash with all fields" do
        json_hash = plagiarism_text.as_json
        expect(plagiarism_text.id).to(eq(json_hash["id"]))
        expect(plagiarism_text.text).to(eq(json_hash["text"]))
      end
    end
  end
end
