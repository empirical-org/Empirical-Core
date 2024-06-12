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
    it 'should just be the data attribute' do
      expect(concept_feedback.as_json).to eq(concept_feedback.data)
    end
  end

  describe '#callbacks' do
    let!(:concept_feedback) { create(:concept_feedback) }

    context 'after update' do
      it 'calls redis cache delete on concept concept_feedback with activity type' do
        expect($redis).to receive(:del).with(concept_feedback.cache_key)
        concept_feedback.update(data: {test: 'test'})
      end
    end

    context 'after create' do
      it 'calls redis cache delete on concept concept_feedback with activity type' do
        activity_type = "grammar"
        expect($redis).to receive(:del).with("#{ConceptFeedback::ALL_CONCEPT_FEEDBACKS_KEY}_#{activity_type}")
        ConceptFeedback.create(activity_type: activity_type, data: {test: 'test'}, uid: SecureRandom.uuid)
      end
    end
  end

  describe '#queue_translation' do
    subject {concept_feedback.queue_translation}

    context 'has a description in the data field' do
      context 'a translation mapping exists for the description' do
        let(:english_text) {create(:english_text)}
        let!(:mapping) { create(:translation_mapping, english_text: english_text, source: concept_feedback, source_key: "description")}

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

        it 'returns nil' do
          expect(concept_feedback.translation_mappings).to include(mapping)
          expect(subject).to be_nil
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

          it 'returns nil' do
            expect(subject).to be_nil
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

          it 'returns the gengo payload for the english text' do
            resp = subject
            english = EnglishText.find_by(text: concept_feedback.data["description"])
            expect(resp).to eq(english.gengo_payload)
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

  describe "#fetch_translation!" do
    context "there is a translated_text associated" do
      let(:t1) { create(:translated_text)}
      let(:t2) { create(:translated_text)}

      it "calls fetch_translation! on each of the translated_text" do
        allow(concept_feedback).to receive(:translated_texts)
        .and_return([t1, t2])
        expect(t1).to receive(:fetch_translation!)
        expect(t2).to receive(:fetch_translation!)
        concept_feedback.fetch_translation!
      end
    end
  end

  describe "#translate!" do

  end
end
