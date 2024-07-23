# frozen_string_literal: true

# == Schema Information
#
# Table name: english_texts
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe EnglishText, type: :model do
  describe 'active_record associations' do
    it { should have_many(:translated_texts) }
    it { should have_many(:translation_mappings) }
  end

  describe '#gengo_translation?(locale:)' do
    subject { english_text.gengo_translation?(locale:) }

    let(:english_text) { create(:english_text) }
    let(:locale) { Translatable::DEFAULT_LOCALE }
    let!(:gengo_job) do
      create(
        :gengo_job,
        english_text:,
        locale: other_locale
      )
    end


    context 'there is a translated_text record associated with that locale' do
      let(:other_locale) { locale }

      it { is_expected.to be true }

      it 'defaults to Translatable::DEFAULT_LOCALE' do
        expect(english_text.gengo_translation?).to be true
      end
    end

    context 'there is not a translated_text record with that locale' do
      let(:other_locale) { 'jp' }

      it { is_expected.to be false }
    end
  end


  describe '#translated?(locale:)' do
    subject { english_text.translated?(locale:) }

    let(:english_text) { create(:english_text) }
    let(:locale) { Translatable::DEFAULT_LOCALE }
    let!(:translated_text) do
      create(
        :translated_text,
        english_text:,
        locale: other_locale
      )
    end


    context 'there is a translated_text record associated with that locale' do
      let(:other_locale) { locale }

      it { is_expected.to be true }

      it 'defaults to Translatable::DEFAULT_LOCALE' do
        expect(english_text.translated?).to be true
      end
    end

    context 'there is not a translated_text record with that locale' do
      let(:other_locale) { 'jp' }

      it { is_expected.to be false }
    end
  end
end
