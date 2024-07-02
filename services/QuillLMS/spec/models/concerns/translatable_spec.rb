# spec/models/concerns/translatable_spec.rb
require 'rails_helper'

RSpec.describe Translatable do
  before(:all) do
    class TranslatableTestModel < ApplicationRecord
      include Translatable

      def prompt
        "Test prompt"
      end

      private

      def translatable_text
        data["test_text"]
      end
    end

    ActiveRecord::Migration.create_table :translatable_test_models do |t|
      t.jsonb :data
    end
  end

  after(:all) do
    ActiveRecord::Migration.drop_table :translatable_test_models
    Object.send(:remove_const, :TranslatableTestModel)
  end

  let(:translatable_object) { TranslatableTestModel.create(data: {"test_text" => "Test text to translate"}) }

  describe '#create_translation_mappings' do
    subject { translatable_object.create_translation_mappings }

    context 'when translatable_text is present' do
      context 'when a translation mapping does not exist' do
        it 'creates a translation mapping' do
          expect { subject }.to change(TranslationMapping, :count).by(1)
        end

        it 'creates an english text' do
          expect { subject }.to change(EnglishText, :count).by(1)
        end

        it 'associates the english text with the translatable object' do
          subject
          expect(translatable_object.english_texts.first.text).to eq("Test text to translate")
        end
      end

      context 'when a translation mapping already exists' do
        before do
          translatable_object.create_translation_mappings
        end

        it 'does not create a new translation mapping' do
          expect { subject }.not_to change(TranslationMapping, :count)
        end

        it 'does not create a new english text' do
          expect { subject }.not_to change(EnglishText, :count)
        end
      end
    end

    context 'when translatable_text is nil' do
      before do
        allow(translatable_object).to receive(:translatable_text).and_return(nil)
      end

      it 'does not create a translation mapping' do
        expect { subject }.not_to change(TranslationMapping, :count)
      end

      it 'does not create an english text' do
        expect { subject }.not_to change(EnglishText, :count)
      end
    end
  end

  describe '#translation' do
    subject { translatable_object.translation(locale: locale, source_api: source_api) }

    let(:locale) { Translatable::DEFAULT_LOCALE }
    let(:source_api) { Translatable::OPEN_AI_SOURCE }
    let(:translation) { "Translated text" }

    before do
      translatable_object.create_translation_mappings
    end

    context 'when a translation exists' do
      let!(:translated_text) do
        create(:translated_text,
          translation: translation,
          locale: locale,
          source_api: source_api,
          english_text: translatable_object.english_texts.first
        )
      end

      it 'returns the translation' do
        expect(subject).to eq(translation)
      end

      context 'when there are translations for different locales' do
        let(:other_locale) { "jp" }
        let!(:other_translated_text) do
          create(:translated_text,
            translation: "Other translation",
            locale: other_locale,
            source_api: source_api,
            english_text: translatable_object.english_texts.first
          )
        end

        it 'returns the translation for the specified locale' do
          expect(subject).to eq(translation)
        end
      end
    end

    context 'when no translation exists' do
      it 'returns nil' do
        expect(subject).to be_nil
      end
    end
  end

  describe '#translations' do
    subject { translatable_object.translations(locale: locale, source_api: source_api) }

    let(:locale) { Translatable::DEFAULT_LOCALE }
    let(:source_api) { Translatable::OPEN_AI_SOURCE }

    before do
      translatable_object.create_translation_mappings
    end

    context 'when translations exist' do
      let!(:open_ai_translation) do
        create(:translated_text,
          translation: "OpenAI translation",
          locale: locale,
          source_api: Translatable::OPEN_AI_SOURCE,
          english_text: translatable_object.english_texts.first
        )
      end

      let!(:gengo_translation) do
        create(:translated_text,
          translation: "Gengo translation",
          locale: locale,
          source_api: Translatable::GENGO_SOURCE,
          english_text: translatable_object.english_texts.first
        )
      end

      it 'returns translations ordered by source_api' do
        expect(subject.map(&:translation)).to eq(["OpenAI translation", "Gengo translation"])
      end

      context 'when specifying a different source_api' do
        let(:source_api) { Translatable::GENGO_SOURCE }

        it 'returns translations ordered by the specified source_api' do
          expect(subject.map(&:translation)).to eq(["Gengo translation", "OpenAI translation"])
        end
      end
    end

    context 'when no translations exist' do
      it 'returns an empty relation' do
        expect(subject).to be_empty
      end
    end
  end

  describe '#translate!' do
    subject { translatable_object.translate!(locale: locale, source_api: source_api) }

    let(:locale) { "es" }

    before do
      translatable_object.create_translation_mappings
    end

    context 'when using Gengo as the source' do
      let(:source_api) { Translatable::GENGO_SOURCE }

      it 'calls Gengo::RequestTranslations' do
        expect(Gengo::RequestTranslations).to receive(:run).with(translatable_object.english_texts, locale)
        subject
      end
    end

    context 'when using OpenAI as the source' do
      let(:source_api) { Translatable::OPEN_AI_SOURCE }
      let(:prompt) { described_class.prompt }

      it 'calls OpenAI::TranslateAndSaveText for each English text' do
        translatable_object.english_texts.each do |text|
          expect(OpenAI::TranslateAndSaveText).to receive(:run).with(text, prompt:)
        end
        subject
      end
    end
  end

  describe '#fetch_translations!' do
    subject { translatable_object.fetch_translations! }

    let(:gengo_job1) { instance_double(GengoJob) }
    let(:gengo_job2) { instance_double(GengoJob) }

    before do
      allow(translatable_object).to receive(:gengo_jobs).and_return([gengo_job1, gengo_job2])
    end

    it 'calls fetch_translation! on each gengo job' do
      expect(gengo_job1).to receive(:fetch_translation!)
      expect(gengo_job2).to receive(:fetch_translation!)
      subject
    end
  end

  describe '#prompt' do
    it 'returns the expected prompt' do
      expect(translatable_object.prompt).to eq("Test prompt")
    end
  end

  describe '#translated_json' do
    subject { translatable_object.translated_json(options) }

    let(:options) { {} }
    let(:data) { translatable_object.data }

    before do
      allow(translatable_object).to receive(:translatable_attribute).and_return("test_text")
    end

    context 'when there are no translations' do
      it { is_expected.to eq(data) }
    end

    context 'when there are translations available' do
      let(:translation) { "test translation" }
      let(:translated_text) { create(:translated_text, translation: translation) }

      before do
        translatable_object.create_translation_mappings
        translatable_object.english_texts.first.translated_texts << translated_text
      end

      it 'adds the translations to the data' do
        expect(subject["translatedTestText"]).to eq(translation)
      end

      context 'when a specific source_api is provided' do
        let(:options) { { source_api: TranslatedText::GENGO_SOURCE } }
        let(:gengo_translation) { "gengo translation" }
        let(:gengo_translated_text) { create(:translated_text, translation: gengo_translation, source_api: TranslatedText::GENGO_SOURCE) }

        before do
          translatable_object.english_texts.first.translated_texts << gengo_translated_text
        end

        it 'uses the specified source_api for translation' do
          expect(subject["translatedTestText"]).to eq(gengo_translation)
        end
      end
    end
  end
end
