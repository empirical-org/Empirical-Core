# frozen_string_literal: true

# == Schema Information
#
# Table name: gengo_jobs
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer          not null
#  translated_text_id :integer
#  translation_job_id :string           not null
#
require 'rails_helper'

RSpec.describe GengoJob, type: :model do
  describe "self.pending_translation" do
    subject { GengoJob.pending_translation }

    let!(:untranslated) { create(:gengo_job) }
    let!(:complete) { create(:gengo_job, translated_text_id: 2) }

    it { expect(subject).to include(untranslated) }
    it { expect(subject).not_to include(complete) }
  end

  describe "fetch_and_save_pending!" do
    subject { GengoJob.fetch_and_save_pending! }

    let(:untranslated) { create(:gengo_job) }
    let!(:complete) { create(:gengo_job, translated_text_id: 2) }

    it "calls fetch_translation! on all the pending translations" do
      expect(GengoJob).to receive(:pending_translation)
      .and_return([untranslated])
      expect(untranslated).to receive(:fetch_translation!)
      expect(complete).not_to receive(:fetch_translation!)
      subject
    end
  end

  describe "fetch_translation!" do
    subject {gengo_job.fetch_translation!}

    let(:gengo_job) { create(:gengo_job) }

    it do
      expect(Gengo::SaveTranslatedText).to receive(:run)
      .with(gengo_job.translation_job_id)
      subject
    end
  end

  describe "find_or_create_translated_text!(translation)" do
    subject { gengo_job.find_or_create_translated_text!(translation) }

    let(:translation) { Faker::Quotes::Shakespeare.hamlet }
    let(:gengo_job) { create(:gengo_job) }

    context 'the job has a translated text' do
      let(:translated_text) { create(:gengo_translated_text) }

      it 'returns the translated text' do
        gengo_job.translated_text = translated_text
        expect(subject.id).to eq(translated_text.id)
      end
    end

    context 'the job does not have a translated text' do
      it 'creates a new translated text' do
        expect(gengo_job.translated_text).to be_nil
        subject
        expect(gengo_job.translated_text).to be_present
      end

      it 'saves the translation' do
        subject
        expect(gengo_job.translated_text.translation).to eq(translation)
      end
    end
  end
end
