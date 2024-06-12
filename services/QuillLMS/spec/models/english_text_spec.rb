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
  before do
    allow(GengoAPI).to receive(:getTranslationJobs)
    allow(GengoAPI).to receive(:getTranslationJob)
  end

  describe "gengo_payload" do
    let(:text) { create(:english_text)}
    let(:payload) { text.gengo_payload}

    it "creates a gengo payload for the english text" do
      expect(payload).to eq({ type: "text",
      body_src: text.text,
      lc_src: "en",
      lc_tgt: "es-la",
      tier: "standard",
      auto_approve: true,
      slug: text.id,
      group: true,
      comment: EnglishText::STANDARD_COMMENT})
    end
  end


  describe "self.translate!" do
    subject { EnglishText.translate!(jobs_list: [payload1, payload2])}

    let(:text1) { create(:english_text)}
    let(:payload1) { text1.gengo_payload}
    let(:text2) { create(:english_text)}
    let(:payload2) { text2.gengo_payload}
    let(:order_id) { "123" }
    let(:resp) do
      { response: { order_id: order_id} }
    end
    let(:full_payload) do
      {
        jobs: {
          text1.id.to_s => payload1,
          text2.id.to_s => payload2
        }
      }
    end

    it "takes a list of jobs and sends them all to gengo" do
      expect(GengoAPI).to receive(:postTranslationJobs)
      .with(full_payload)
      .and_return(resp)
      subject
    end

    it "calls save_translated_text!" do
      allow(GengoAPI).to receive(:postTranslationJobs)
      .with(full_payload)
      .and_return(resp)
      expect(EnglishText).to receive(:save_translated_text!)
      subject
    end
  end

  describe "self.save_translated_text!" do
    subject { EnglishText.save_translated_text!(order_id: order_id) }

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

    it "does not call GengoAPI.getTranslationJobs(order_id: )" do
      expect(GengoAPI).not_to receive(:getTranslationJobs).with(order_id:)
      subject
    end

    it "calls created_translated_text_for_job_id! for each job" do
      expect(EnglishText).to receive(:create_translated_text!).with(job_id: job_id1)
      expect(EnglishText).to receive(:create_translated_text!).with(job_id: job_id2)
      subject
    end
  end

  describe "create_translated_text!" do
    subject {EnglishText.create_translated_text!(job_id:)}

    let(:order_id) { "123" }
    let(:job_id) { "124" }
    let(:english_word_id) { "1493" }
    let(:locale) { "es-la" }
    let(:response ) do
      {"opstat"=>"ok",
        "response"=>
          {"job"=>
            {"job_id"=> job_id,
            "order_id"=> order_id,
            "slug"=> english_word_id,
            "body_src"=>
              "<p>Use to + an action word (<em>to go</em>, <em>to eat</em>, <em>to love</em>) before a group of words to tell more about something. </p><br/><p>In this example, <em>to go on a trip</em> tells more about why I saved up money. </p>",
            "lc_src"=>"en",
            "lc_tgt"=>locale,
            "unit_count"=>"37",
            "tier"=>"standard",
            "credits"=>"1.85",
            "currency"=>"USD",
            "status"=>status,
            "eta"=>-1,
            "type"=>"text",
            "ctime"=>1718145667,
            "services"=>["translation"],
            "auto_approve"=>"0",
            "position"=>0,
            "file_download_ready"=>false,
            "translator_ids"=>["1"]}}}
    end

    before do
      allow(GengoAPI).to receive(:getTranslationJob).and_return(response)
    end


    context 'the response status is available' do
      let(:status) { "available" }

      it do
        expect { subject }
          .to change(TranslatedText, :count)
          .by(1)
      end

      it do
        expect { subject }
          .to change { TranslatedText.where(english_text_id: english_word_id).count }
          .by(1)
      end

      it do
        expect { subject }
          .to change { TranslatedText.where(locale:).count }
          .by(1)
      end

      it do
        expect { subject }
          .to change { TranslatedText.where(translation_job_id: job_id).count }
          .by(1)
      end
    end

    context 'the response status is deleted' do
      let(:status) { "deleted" }

      it 'does not save the translated text' do
        expect { subject }
          .not_to change(TranslatedText, :count)
      end
    end

    context 'the response status is canceled' do
      let(:status) { "canceled" }

      it 'does not save the translated text' do
        expect { subject }
          .not_to change(TranslatedText, :count)
      end
    end
  end
end
