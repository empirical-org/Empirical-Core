# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Gengo::RequestTranslations, type: :service do

  let(:text1) { create(:english_text)}
  let(:text2) { create(:english_text)}

  before do
    allow(GengoAPI).to receive(:getTranslationJobs)
    allow(GengoAPI).to receive(:getTranslationJob)
  end

  describe "gengo_payload" do
    let(:text2_payload) do
      {
        type: "text",
        body_src: text2.text,
        lc_src: "en",
        lc_tgt: TranslatedText::DEFAULT_LOCALE,
        tier: "standard",
        auto_approve: true,
        slug: text2.id,
        group: true,
        comment: described_class::STANDARD_COMMENT
      }
    end
    let(:text1_payload) do
      {
        type: "text",
        body_src: text1.text,
        lc_src: "en",
        lc_tgt: TranslatedText::DEFAULT_LOCALE,
        tier: "standard",
        auto_approve: true,
        slug: text1.id,
        group: true,
        comment: described_class::STANDARD_COMMENT
      }
    end
    let(:combined_payload) { { text1.id.to_s => text1_payload, text2.id.to_s => text2_payload }}

    subject { described_class.new([text1, text2], TranslatedText::DEFAULT_LOCALE).gengo_payload}

    context "the english text does not yet have a translation for that language" do
      it "creates a gengo payload for the english text" do
        expect(subject).to eq(combined_payload )
      end
    end

    context "the english text already has a translated_text for that language" do
      it "does not add that text to the payload" do
        text1.gengo_jobs << create(:gengo_job, locale: TranslatedText::DEFAULT_LOCALE)
        expect(subject).to eq({text2.id.to_s => text2_payload})
      end
    end
  end


  describe "run" do
    subject { described_class.run([text1, text2], TranslatedText::DEFAULT_LOCALE)}

    let(:order_id) { "123" }

    let(:resp) do
      { "response" => { "order_id" => order_id} }
    end

    context 'there is a payload' do
      before do
        allow(GengoAPI).to receive(:postTranslationJobs).and_return(resp)
      end

      it "takes a list of english_texts and sends them all to gengo" do
        expect(GengoAPI).to receive(:postTranslationJobs)
        .and_return(resp)
        subject
      end

      it "starts a SaveTranslatedTextWorker" do
        expect(Gengo::SaveJobsFromOrderWorker).to receive(:perform_in)
        .with(1.minute, order_id)
        subject
      end

      context "there is no response" do
        let(:resp) { nil }

        it { expect{subject}.to raise_error(described_class::RequestTranslationError) }
      end
    end

    context "the payload returns an empty hash" do
      subject { described_class.run([], TranslatedText::DEFAULT_LOCALE)}

      it {
        subject
        expect(GengoAPI).not_to receive(:postTranslationJobs)
      }
    end
  end
end
