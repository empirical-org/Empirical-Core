# frozen_string_literal: true

require 'rails_helper'
RSpec.describe OpenAI::TranslateAndSaveText, type: :service do
  describe 'run' do
    subject { described_class.run(english_text, prompt:) }

    let(:english_text) { create(:english_text) }
    let(:prompt) { 'translate please' }
    let(:text) { english_text.text }
    let(:response) { 'Do not go gentle into that good night' }
    let(:locale) { Translatable::DEFAULT_LOCALE }

    before do
      allow(OpenAI::Translate).to receive(:run).with(english_text: text, prompt:).and_return(response)
    end

    context 'the response is a success' do
      it do
        expect { subject }
          .to change(TranslatedText, :count)
          .by(1)
      end

      it do
        expect { subject }
          .to change {
                TranslatedText
                  .where(english_text_id: english_text.id)
                  .count
              }.by(1)
      end

      it 'always translates to spanish' do
        expect { subject }
          .to change {
                TranslatedText
                  .where(locale:)
                  .count
              }.by(1)
      end

      it 'sets the translation to be the response' do
        subject
        expect(english_text.translated_texts.first.translation).to eq(response)
      end

      it 'updates if the translated_text exists' do
        translated_text = create(:translated_text,
          english_text_id: english_text.id,
          translation: 'Foo',
          locale:)
        subject
        expect(translated_text.reload.translation).to eq(response)
      end
    end

    context 'the response is nil' do
      let(:response) { nil }

      it { expect{ subject }.to raise_error(described_class::OpenAITranslationError) }
    end
  end
end
