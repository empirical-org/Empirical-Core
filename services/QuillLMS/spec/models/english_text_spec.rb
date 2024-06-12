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
      slug: text.id,
      group: true,
      comment: EnglishText::STANDARD_COMMENT})
    end

    it "allows you to mark specific words for no translation based on a tag list" do
      text = create(:english_text, text: "<em>hello</em>world <ul>BYE</ul><p>seeya</p>")
      payload = text.gengo_payload(excluded_tags: ["em", "ul"])
      expect(payload).to eq({ type: "text",
      body_src: "<em>[[[hello]]]</em>world <ul>[[[BYE]]]</ul><p>seeya</p>",
      lc_src: "en",
      lc_tgt: "es-la",
      tier: "standard",
      slug: text.id,
      group: true,
      comment: EnglishText::STANDARD_COMMENT})
    end

  end


  describe "self.translate!" do
    let(:text1) { create(:english_text)}
    let(:payload1) { text1.gengo_payload}
    let(:text2) { create(:english_text)}
    let(:payload2) { text2.gengo_payload}

    it "takes a list of jobs and sends them all to gengo" do
      expect(GengoAPI).to receive(:postTranslationJobs).with({
        jobs: {
          "#{text1.id}" => payload1,
          "#{text2.id}" => payload2
        }
      }).and_return({})
      allow(GengoAPI).to receive(:getTranslationJobs)
      EnglishText.translate!(jobs_list: [payload1, payload2])
    end

    it "kicks off a sidekiq job to save_translated_text!" do
      # expect

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

    it "calls GengoAPI.getTranslationJobs(order_id: )" do
      expect(GengoAPI).to receive(:getTranslationJobs).with(order_id: order_id)
      subject
    end

    it "calls created_translated_text_for_job_id! for each job" do
      expect(EnglishText).to receive(:create_translated_text_for_job_id!).with(job_id: job_id1)
      expect(EnglishText).to receive(:create_translated_text_for_job_id!).with(job_id: job_id2)
      subject
    end

    # it "adds a translated_text record for each of the jobs that were just sent" do
    #   expect(GengoAPI).to receive(:getTranslationJob).with(id: job_id1)
    #   expect(GengoAPI).to receive(:getTranslationJob).with(id: job_id2)

    #   subject
    # end
  end

  describe "create_translated_text_for_job_id!" do
    subject {EnglishText.create_translated_text_for_job_id!(job_id:)}

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
            "status"=>"deleted",
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

    it 'saves a translated_text with the gengo_job_id' do
      expect { subject }
        .to change { TranslatedText.where(translation_job_id: job_id).count }
        .by(1)
    end
  end
end
