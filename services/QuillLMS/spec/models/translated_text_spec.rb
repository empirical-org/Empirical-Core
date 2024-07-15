# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id              :bigint           not null, primary key
#  locale          :string           not null
#  source_api      :string
#  translation     :text             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#
require 'rails_helper'

RSpec.describe TranslatedText, type: :model do
  describe 'active_record associations' do
    it {should belong_to(:english_text) }
    it {should have_many(:translation_mappings) }
  end

  describe 'ordered_by_source_api' do
    let!(:gengo_text) { create(:gengo_translated_text).translation }
    let!(:open_ai_text) { create(:translated_text).translation }

    context 'no source API' do
      subject{ TranslatedText.ordered_by_source_api }

      it { expect(subject.map(&:translation)).to eq([open_ai_text, gengo_text])}
    end

    context 'with a source API' do
      subject{ TranslatedText.ordered_by_source_api(source_api) }

      context 'open_ai' do
        let(:source_api) {Translatable::OPEN_AI_SOURCE}

        it { expect(subject.map(&:translation)).to eq([open_ai_text, gengo_text])}
      end

      context 'gengo' do
        let(:source_api) {Translatable::GENGO_SOURCE}

        it { expect(subject.map(&:translation)).to eq([gengo_text, open_ai_text])}
      end

      context 'not in our list' do
        let(:source_api) { 'sql injection attempt' }

        it { expect(subject.map(&:translation)).to eq([open_ai_text, gengo_text])}
      end
    end
  end

  describe '#text' do
    subject { translated_text.text }

    let(:translated_text) { create(:translated_text)}

    it 'is the text of the english text' do
      expect(subject).to eq(translated_text.english_text.text)
    end
  end

  describe '#source' do
    subject { translated_text.source }

    let(:translated_text) { create(:translated_text)}

    context 'translation mapping exists' do
      it 'is the source of the first translation_mapping' do
        translation_mapping = create(:translation_mapping, english_text: translated_text.english_text)
        expect(subject).to eq(translation_mapping.source_type)
      end
    end

    context 'translation mapping does not exist' do
      it 'is null' do
        expect(subject).to be_nil
      end
    end
  end
end
