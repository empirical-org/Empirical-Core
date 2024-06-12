# == Schema Information
#
# Table name: translated_texts
#
#  id                 :bigint           not null, primary key
#  locale             :string           not null
#  translation        :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  english_text_id    :integer
#  translation_job_id :string           not null
#
require 'rails_helper'

RSpec.describe TranslatedText, type: :model do

  before do
    allow(GengoAPI).to receive(:getTranslationJob)
  end

  describe "self.pending_translation" do
    subject { TranslatedText.pending_translation }

    let!(:untranslated) { create(:translated_text) }
    let!(:complete) { create(:translated_text, translation: "foo") }

    it { expect(subject).to(include{untranslated}) }
    it { expect(subject).not_to(include{complete}) }

  end

  describe "fetch_pending!" do
    subject { TranslatedText.fetch_pending! }

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

    context "the translation is pending" do
      let(:translated_text) { create(:translated_text) }

      context "gengo translation is complete" do
        let(:translation) { "simulated translation" }
        let(:response) do
          {"opstat"=>"ok",
            "response"=>
              {"job"=>
                {"job_id"=>"4637962",
                "order_id"=>"1012969",
                "slug"=>"1566",
                "body_src"=>"<p>When there is more than one <em>woman</em>, use <em>women.</em></p>",
                "lc_src"=>"en",
                "lc_tgt"=>"es-la",
                "unit_count"=>"9",
                "tier"=>"standard",
                "credits"=>"0.45",
                "currency"=>"USD",
                "status"=>"approved",
                "eta"=>-1,
                "type"=>"text",
                "ctime"=>1718217213,
                "services"=>["translation"],
                "auto_approve"=>"1",
                "position"=>0,
                "body_tgt"=>translation,
                "file_download_ready"=>false,
                "translator_ids"=>["8"]}}}
        end


        it "calls through to gengo and saves the translation" do
          expect(GengoAPI).to receive(:getTranslationJob)
          .with({id: translated_text.translation_job_id})
          .and_return(response)
          subject
          expect(translated_text.reload.translation).to eq(translation)
        end
      end

      context "gengo translation is not complete" do
        let(:response) do
          {"opstat"=>"ok",
            "response"=>
              {"job"=>
                {"job_id"=>"4637962",
                "order_id"=>"1012969",
                "slug"=>"1566",
                "body_src"=>"<p>When there is more than one <em>woman</em>, use <em>women.</em></p>",
                "lc_src"=>"en",
                "lc_tgt"=>"es-la",
                "unit_count"=>"9",
                "tier"=>"standard",
                "credits"=>"0.45",
                "currency"=>"USD",
                "status"=>"available",
                "eta"=>-1,
                "type"=>"text",
                "ctime"=>1718217213,
                "services"=>["translation"],
                "auto_approve"=>"1",
                "position"=>0,
                "file_download_ready"=>false,
                "translator_ids"=>["8"]}}}
        end

        it "calls through to gengo and but does not save a translation" do
          expect(GengoAPI).to receive(:getTranslationJob)
          .with({id: translated_text.translation_job_id})
          .and_return(response)
          subject
          expect(translated_text.reload.translation).to be_nil
        end
      end
    end

    context "the translation is complete" do
      let(:translation) {"old translation"}
      let(:translated_text) { create(:translated_text, translation: translation) }

      it "does not call gengo or save a translation" do
        expect(GengoAPI).not_to receive(:getTranslationJob)
        subject
        expect(translated_text.reload.translation).to eq(translation)
      end
    end

  end
end
