# frozen_string_literal: true

# == Schema Information
#
# Table name: translation_mappings
#
#  id              :bigint           not null, primary key
#  source_type     :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  english_text_id :integer          not null
#  source_id       :integer          not null
#
require 'rails_helper'
RSpec.describe TranslationMapping, type: :model do
  describe 'active_record associations' do
    it {should belong_to(:english_text) }
    it {should belong_to(:source) }
    it {should have_many(:translated_texts) }
  end

  describe '.translated(language)' do
    subject { TranslationMapping.translated(locale) }

    let!(:mapping_no_translation) { create(:translation_mapping)}
    let(:english_text) { create(:english_text)}
    let(:locale) { Translatable::DEFAULT_LOCALE }
    let!(:translated_text) { create(:translated_text, english_text:, locale: translated_locale)}
    let!(:mapping_with_translation) { create(:translation_mapping, english_text:)}

    context 'a mapping with translation in the correct locale' do
      let(:translated_locale) { locale }

      it 'only returns records that have a translated_text associated' do
        expect(subject).to include(mapping_with_translation)
        expect(subject).not_to include(mapping_no_translation)
      end
    end

    context 'a mapping in the wrong locale' do
      let(:translated_locale) { "jp" }

      it 'does not return records in the wrong locale' do
        expect(subject).not_to include(mapping_with_translation)
      end
    end
  end

  describe '#text' do
    it { is_expected.to delegate_method(:text).to(:english_text) }
  end

  describe "#translation(locale:source:)" do
    let(:translation_mapping) { create(:translation_mapping, english_text:)}
    let(:english_text) { create(:english_text)}
    let(:locale) { "fa" }
    let(:source_api) { Translatable::GENGO_SOURCE }

    context "there is a translation that does not match the source_api" do
      subject { translation_mapping.translation(locale:, source_api:)}

      let!(:translated_text_open_ai_source) { create(:translated_text, english_text:, locale:, source_api: Translatable::OPEN_AI_SOURCE)}

      it "returns that translation" do
        expect(subject).to eq(translated_text_open_ai_source.translation)
      end
    end

    context 'there is a translation' do
      let!(:translated_text_wrong_locale) { create(:translated_text, english_text:, locale: "jp", source_api:)}
      let!(:translated_text_open_ai_source) { create(:translated_text, english_text:, locale:, source_api: Translatable::OPEN_AI_SOURCE)}
      let!(:translated_text_gengo_source) { create(:translated_text, english_text:, locale:, source_api:)}

      context "parameters passed in" do
        subject { translation_mapping.translation(locale:, source_api:)}

        it "returns the first translated_text record's translation for that locale and source" do
          expect(subject).to eq(translated_text_gengo_source.translation)
        end
      end

      context "no parameters passed in" do
        let(:locale) { Translatable::DEFAULT_LOCALE }

        subject { translation_mapping.translation }

        it "defaults to open_ai and DEFAULT_LOCALE" do
          expect(subject).to eq(translated_text_open_ai_source.translation)
        end
      end
    end

    context 'there is no translation' do
      subject { translation_mapping.translation }

      let(:translation_mapping) { create(:translation_mapping)}

      it "returns an empty string" do
        expect(subject).to eq("")
      end
    end

  end

end
