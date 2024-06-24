# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Gengo::SaveJobsFromOrder, type: :service do
  describe "run" do
    subject { described_class.run(order_id)}

    let(:order_id) { 123 }
    let(:job_id1) { "4637671" }
    let(:job_id2) { "4637670" }
    let(:translation_job_response) do
      {
        "opstat"=>"ok",
        "response"=>
        [
          {"job_id"=>job_id1, "ctime"=>1718145986},
          {"job_id"=>job_id2, "ctime"=>1718145986}
        ]
      }
    end

    before do
      allow(GengoAPI).to receive(:getTranslationJobs).and_return(translation_job_response)
    end

    it "calls GengoAPI.getTranslationJobs({order_id: })" do
      expect(GengoAPI).to receive(:getTranslationJobs).with({order_id:})
      subject
    end

    it "does not use the named param syntax" do
      expect(GengoAPI).not_to receive(:getTranslationJobs).with(order_id:)
      subject
    end

    it "calls created_translated_text_for_job_id! for each job" do
      expect(Gengo::SaveTranslatedTextWorker).to receive(:perform_async).with(job_id1)
      expect(Gengo::SaveTranslatedTextWorker).to receive(:perform_async).with(job_id2)
      subject
    end

    context "there is no gengo API response" do
      let(:translation_job_response) { nil }

      it { expect{subject}.to raise_error(described_class::FetchTranslationOrderError)}
    end
  end
end
