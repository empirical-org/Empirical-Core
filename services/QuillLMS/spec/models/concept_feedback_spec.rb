# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_feedbacks
#
#  id            :integer          not null, primary key
#  activity_type :string           not null
#  data          :jsonb
#  uid           :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_concept_feedbacks_on_activity_type          (activity_type)
#  index_concept_feedbacks_on_uid_and_activity_type  (uid,activity_type) UNIQUE
#
require 'rails_helper'

RSpec.describe ConceptFeedback, type: :model do
  let(:concept_feedback) { create(:concept_feedback) }

  describe '#valid?' do
    it 'should be valid from the factory' do
      expect(concept_feedback.valid?).to be true
    end

    it 'should be invalid without a uid' do
      concept_feedback.uid = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid without data' do
      concept_feedback.data = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid without activity_type' do
      concept_feedback.activity_type = nil
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid if activity_type is not an allowed value' do
      concept_feedback.activity_type = 'some_totally_invalid_type'
      expect(concept_feedback.valid?).to be false
    end

    it 'should be invalid if data is not a hash' do
      concept_feedback.data = 1
      expect(concept_feedback.valid?).to be false
      expect(concept_feedback.errors[:data]).to include('must be a hash')
    end
  end

  describe '#as_json' do
    subject { concept_feedback.as_json(options) }

    let(:options) { nil }
    let(:data) { concept_feedback.data }

    context 'there are no translations' do
      it { expect(subject).to eq(data) }
    end

    context 'there are translations available' do
      let(:translation) { "test translation" }
      let(:translated_text) { create(:translated_text, translation: translation)}

      before do
        concept_feedback.create_translation_mappings
        concept_feedback.english_texts.first.translated_texts << translated_text
      end

      it 'adds the translations to the data' do
        expect(subject["translatedDescription"]).to eq(translation)
      end

      context 'there is only a gengo translation' do
        let(:translated_text) { create(:gengo_translated_text, translation: translation)}

        it 'adds the translations to the data' do
          expect(subject["translatedDescription"]).to eq(translation)
        end
      end

      context 'there is a gengo and open ai translation' do
        let(:gengo_text) { create(:gengo_translated_text)}

        before do
          concept_feedback.english_texts.first.translated_texts = [gengo_text, translated_text]
        end

        it 'defaults to the open_ai translation' do
          expect(subject["translatedDescription"]).to eq(translation)
        end

        context 'passed in gengo as an option' do
          let(:options) { {source_api: TranslatedText::GENGO_SOURCE} }

          it 'returns the gengo translation' do
            expect(subject["translatedDescription"]).to eq(gengo_text.translation)
          end
        end

      end
    end
  end

  describe '#translation(locale:, source:)' do
    let(:locale) {"es-la"}
    let(:translation_locale) { locale }
    let(:source_api) { TranslatedText::OPEN_AI_SOURCE }

    context 'source is not passed in' do
      subject { concept_feedback.translation(locale: locale)}

      context 'a translation exists' do
        let(:translation) { "test translation" }
        let(:translated_text) do
          create(:translated_text,
           translation: translation,
           locale: translation_locale,
           source_api:
          )
        end

        before do
          concept_feedback.create_translation_mappings
          concept_feedback.english_texts.first.translated_texts << translated_text
        end

        context 'the translation is from open_ai' do
          context 'there is a translation for the locale' do
            it {expect(subject).to eq(translation)}
          end

          context 'there are only translations for different locales' do
            let(:translation_locale) { "jp" }

            it {expect(subject).to be_nil}
          end
        end

        context 'the translation is from gengo' do
          let(:source) { TranslatedText::GENGO_SOURCE}

          it { expect(subject).to eq(translation)}
        end

        context 'there are two translations' do
          let(:gengo_translation) { create(:gengo_translated_text) }

          before do
            concept_feedback.english_texts.first.translated_texts << gengo_translation
          end

          it 'returns the open ai translation' do
            expect(subject).to eq(translation)
          end
        end
      end

      context 'there are no translations' do
        it {expect(subject).to be_nil}
      end

    end

    context 'the source is gengo' do
      subject { concept_feedback.translation(locale: locale, source_api: TranslatedText::GENGO_SOURCE)}

      context 'there are two translations' do
        let(:gengo_translated_text) { create(:gengo_translated_text) }
        let(:open_ai_translated_text) { create(:translated_text) }

        before do
          concept_feedback.create_translation_mappings
          concept_feedback.english_texts.first.translated_texts = [open_ai_translated_text, gengo_translated_text]
        end

        it 'returns the gengo translation' do
          expect(subject).to eq(gengo_translated_text.translation)
        end
      end
    end

  end

  describe '#callbacks' do
    let!(:concept_feedback) { create(:concept_feedback) }

    context 'after update' do
      it 'calls redis cache delete on concept feedback with activity type' do
        expect($redis).to receive(:del).with(concept_feedback.cache_key)
        concept_feedback.update(data: {test: 'test'})
      end
    end

    context 'after create' do
      it 'calls redis cache delete on concept feedback with activity type' do
        activity_type = "grammar"
        expect($redis).to receive(:del).with("#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{activity_type}")
        ConceptFeedback.create(activity_type: activity_type, data: {test: 'test'}, uid: SecureRandom.uuid)
      end
    end
  end

  describe '#create_translation_mappings' do
    subject {concept_feedback.create_translation_mappings}

    context 'has a description in the data field' do
      context 'a translation mapping exists for the description' do
        let(:english_text) {create(:english_text)}
        let!(:mapping) { create(:translation_mapping, english_text: english_text, source: concept_feedback)}

        it 'does not create a translation mapping' do
          expect(concept_feedback.translation_mappings).to include(mapping)
          expect {
            subject
          }.not_to change(TranslationMapping, :count)
        end

        it 'does not create an english text' do
          expect(concept_feedback.translation_mappings).to include(mapping)
          expect { subject }.not_to change(EnglishText, :count)
        end
      end

      context 'a translation mapping does not exist for the description' do
        context 'an english text already exists for the description' do
          let!(:english_text) {create(:english_text, text: concept_feedback.data['description'])}

          it 'creates a mapping between the english text and the concept_feedback' do
            expect(concept_feedback.translation_mappings).to be_empty
            subject
            mapping = concept_feedback.translation_mappings.first
            expect(mapping&.english_text).to eq(english_text)
          end
        end

        context 'an english text does not yet exist for the description' do
          it 'makes an english text for the description' do
            expect(EnglishText.find_by(text: concept_feedback.data["description"])).to be_nil
            subject
            expect(EnglishText.find_by(text: concept_feedback.data["description"])).to be_present
          end

          it 'makes a translation mapping between the english text and the concept concept_feedback' do
            expect(concept_feedback.translation_mappings).to be_empty
            subject
            expect(concept_feedback.translation_mappings).to be_present
          end
        end
      end
    end

    context 'no description in the data field' do
      before do
        concept_feedback.update_attribute(:data, {})
      end

      it 'does not create an english_text' do
        expect { subject }.not_to change(EnglishText, :count)
      end

      it 'returns nil' do
        expect(subject).to be_nil
      end
    end
  end

  describe "#gengo_jobs" do
    subject { concept_feedback.gengo_jobs }

    let(:english_text) { create(:english_text)}
    let!(:gengo_job) { create(:gengo_job, english_text:)}
    let(:concept_feedback) { create(:concept_feedback) }
    let!(:mapping) { create(:translation_mapping, english_text:, source: concept_feedback)}

    it { expect(subject).to include(gengo_job)}
  end

  describe "#fetch_translations!" do
    context "there is a gengo_job associated" do
      let(:translation1) { create(:gengo_job)}
      let(:translation2) { create(:gengo_job)}

      before do
        allow(concept_feedback).to receive(:gengo_jobs)
        .and_return([translation1, translation2])
      end

      it "calls fetch_translation! on each of the gengo jobs" do
        expect(translation1).to receive(:fetch_translation!)
        expect(translation2).to receive(:fetch_translation!)
        concept_feedback.fetch_translations!
      end
    end
  end

  describe "#translate!(source_api)" do
    subject { concept_feedback.translate!(locale:, source_api:)}

    let(:locale) { TranslatedText::DEFAULT_LOCALE }
    let(:concept_feedback) { create(:concept_feedback)}

    before do
      concept_feedback.create_translation_mappings
    end

    context 'open_ai' do
      let(:source_api) {TranslatedText::OPEN_AI_SOURCE}

      it 'sends a request to the OpenAI api' do
        concept_feedback.english_texts.each do |text|
          expect(OpenAI::TranslateAndSaveText).to receive(:run)
            .with(text)
        end
        subject
      end
    end

    context 'gengo' do
      let(:source_api) {TranslatedText::GENGO_SOURCE}

      it 'requests translations for the english_texts' do
        expect(Gengo::RequestTranslations).to receive(:run).with(concept_feedback.english_texts, locale)
        subject
      end
    end
  end
end
