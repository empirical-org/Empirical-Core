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
    it {should have_many(:translated_texts) }
    it {should have_many(:translation_mappings) }
  end

  describe "#has_gengo_translation?(locale:)" do
    subject { english_text.has_gengo_translation?(locale: locale) }

    let(:english_text) { create(:english_text) }
    let(:locale) { Gengo::SPANISH_LOCALE }
    let!(:gengo_job) do
      create(
        :gengo_job,
        english_text: english_text,
        locale: other_locale
      )
    end


    context 'there is a translated_text record associated with that locale' do
      let(:other_locale) { locale }

      it { is_expected.to be true }

      it "defaults to Gengo::SPANISH_LOCALE" do
        expect(english_text.has_gengo_translation?).to be true
      end
    end

    context 'there is not a translated_text record with that locale' do
      let(:other_locale) { "jp" }

      it { is_expected.to be false }
    end
  end
end
