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
        lc_tgt: Gengo::SPANISH_LOCALE,
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
        lc_tgt: Gengo::SPANISH_LOCALE,
        tier: "standard",
        auto_approve: true,
        slug: text1.id,
        group: true,
        comment: described_class::STANDARD_COMMENT
      }
    end
    let(:combined_payload) { { text1.id.to_s => text1_payload, text2.id.to_s => text2_payload }}

    subject { described_class.new([text1, text2]).gengo_payload}

    it "creates a gengo payload for the english text" do
      expect(subject).to eq(combined_payload )
    end
  end


  describe "run" do
    subject { described_class.run([text1, text2])}

    let(:order_id) { "123" }

    let(:resp) do
      { "response" => { "order_id" => order_id} }
    end

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
end
