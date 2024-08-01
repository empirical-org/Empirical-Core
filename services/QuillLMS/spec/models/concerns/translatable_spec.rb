# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Translatable do
  let(:translatable_class) do
    Class.new(ApplicationRecord) do
      include Translatable

      def self.name
        'TranslatableTestModel'
      end

      def self.custom_prompt
        'Test prompt'
      end

      def self.default_translatable_field
        'test_text'
      end

      def self.config_file = Rails.root.join('app/models/translation_config/concept_feedback.yml')
    end
  end

  let(:translatable_object) { translatable_class.create(data: { 'test_text' => 'Test text to translate' }) }

  before do
    stub_const('TranslatableTestModel', translatable_class)
    ActiveRecord::Base.connection.create_table :translatable_test_models, force: true do |t|
      t.jsonb :data
    end
  end

  after do
    ActiveRecord::Base.connection.drop_table :translatable_test_models
  end

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
          expect(translatable_object.english_texts.first.text).to eq('Test text to translate')
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
    let(:translation) { 'Translated text' }

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
        let(:other_locale) { 'jp' }
        let!(:other_translated_text) do
          create(:translated_text,
            translation: 'Other translation',
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
          translation: 'OpenAI translation',
          locale: locale,
          source_api: Translatable::OPEN_AI_SOURCE,
          english_text: translatable_object.english_texts.first
        )
      end

      let!(:gengo_translation) do
        create(:translated_text,
          translation: 'Gengo translation',
          locale: locale,
          source_api: Translatable::GENGO_SOURCE,
          english_text: translatable_object.english_texts.first
        )
      end

      it 'returns translations ordered by source_api' do
        expect(subject.map(&:translation)).to eq(['OpenAI translation', 'Gengo translation'])
      end

      context 'when specifying a different source_api' do
        let(:source_api) { Translatable::GENGO_SOURCE }

        it 'returns translations ordered by the specified source_api' do
          expect(subject.map(&:translation)).to eq(['Gengo translation', 'OpenAI translation'])
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
    subject { translatable_object.translate!(locale:, source_api:) }

    let(:locale) { Translatable::DEFAULT_LOCALE }
    let(:source_api) { Translatable::GENGO_SOURCE }

    before do
      allow(Gengo::RequestTranslations).to receive(:run)
      translatable_object.create_translation_mappings
    end

    it 'calls create_translation_mappings first' do
      expect(translatable_object).to receive(:create_translation_mappings)
      subject
    end

    context 'when using Gengo as the source' do
      it 'calls Gengo::RequestTranslations' do
        expect(Gengo::RequestTranslations).to receive(:run).with(translatable_object.english_texts, locale)
        subject
      end
    end

    context 'when using OpenAI as the source' do
      let(:source_api) { Translatable::OPEN_AI_SOURCE }
      let(:prompt) { TranslatableTestModel.open_ai_prompt(locale:) }

      context 'there is not an existing translation' do
        it 'calls OpenAI::TranslateAndSaveText for each English text' do
          translatable_object.english_texts.each do |text|
            expect(OpenAI::TranslateAndSaveText).to receive(:run).with(text, prompt:, locale:)
          end
          subject
        end
      end

      context 'a translation exists for OpenAI' do
        before do
          translatable_object.english_texts.each do |english_text|
            create(:translated_text, english_text:, source_api:)
          end
        end

        context 'the force parameter is passed through' do
          subject { translatable_object.translate!(locale:, source_api:, force: true) }

          it 'calls OpenAI::TranslateAndSaveText for each English text' do
            translatable_object.english_texts.each do |text|
              expect(OpenAI::TranslateAndSaveText).to receive(:run).with(text, prompt:, locale:)
            end
            subject
          end
        end

        context 'the force parameter is not passed through' do
          it 'does not call OpenAI::TranslateAndSaveText' do
            translatable_object.english_texts.each do |text|
              expect(OpenAI::TranslateAndSaveText).not_to receive(:run).with(text, prompt:)
            end
            subject
          end
        end
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

  describe '#open_ai_prompt(locale:)' do
    let(:locale) { Translatable::DEFAULT_LOCALE }

    it 'returns the expected prompt' do
      expected = TranslationPrompts.prompt_start(locale:)
      expected += "Test prompt\n text to translate: "
      expect(TranslatableTestModel.open_ai_prompt(locale:)).to eq(expected)
    end

    it 'adds in the example_json' do
      filename = 'question.yml'
      allow(TranslatableTestModel).to receive(:config_file).and_return(Rails.root.join('app/models/translation_config', filename))
      prompt = TranslatableTestModel.open_ai_prompt(locale:)
      expect(prompt).to match(TranslatableTestModel.send(:examples))
      expect(TranslatableTestModel.send(:examples)).to match('1. English: "Combine the sentences')
    end
  end
end
