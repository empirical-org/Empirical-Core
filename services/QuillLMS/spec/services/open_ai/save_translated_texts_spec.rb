# frozen_string_literal: true

require 'rails_helper'
RSpec.describe OpenAI::SaveTranslatedTexts, type: :service do
  describe "run" do
    subject { described_class.run(english_texts)}

    let(:english_text1) {create(:english_text)}
    let(:english_text2) {create(:english_text)}
    let(:english_texts) { [english_text1, english_text2]}

    it 'calls SaveTranslatedText with each english_text' do
      expect(OpenAI::SaveTranslatedText).to receive(:run).with(english_text1)
      expect(OpenAI::SaveTranslatedText).to receive(:run).with(english_text2)
      subject
    end

  end
end
