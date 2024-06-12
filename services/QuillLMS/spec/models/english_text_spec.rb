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
      })
      EnglishText.translate!(jobs_list: [payload1, payload2])
    end

    it "kicks off a sidekiq job to save_translated_text!" do

    end
  end

  describe "self.save_translated_text!" do
    it "calls gengo.get"
    it "adds translated_text for each of the jobs that were just sent" do

    end

  end

end
