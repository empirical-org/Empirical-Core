# frozen_string_literal: true

# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translation_job_id :string           not null
#
require 'rails_helper'

RSpec.describe TranslatedText, type: :model do
  describe "self.pending_translation" do
    subject { TranslatedText.pending_translation }

    let!(:untranslated) { create(:translated_text) }
    let!(:complete) { create(:translated_text, translation: "foo") }

    it { expect(subject).to(include{untranslated}) }
    it { expect(subject).not_to(include{complete}) }

  end

  describe "fetch_and_save_pending!" do
    subject { TranslatedText.fetch_and_save_pending! }

    let(:untranslated) { create(:translated_text) }
    let(:complete) { create(:translated_text, translation: "foo") }

    it "calls fetch_translation! on all the pending translations" do
      expect(TranslatedText).to receive(:pending_translation)
      .and_return([untranslated])
      expect(untranslated).to receive(:fetch_translation!)
      expect(complete).not_to receive(:fetch_translation!)
      subject
    end


  end

  describe "fetch_translation!" do
    subject {translated_text.fetch_translation!}

    let(:translated_text) { create(:translated_text) }

    it do
      expect(Gengo::SaveTranslatedText).to receive(:run)
      .with(translated_text.translation_job_id)
      subject
    end
  end
end
