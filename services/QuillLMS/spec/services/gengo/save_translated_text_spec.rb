# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Gengo::SaveTranslatedText, type: :service do
  describe "run" do
    subject { described_class.run(job_id)}

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

    context "the response is nil" do
      let(:response) { nil }

      it { expect{subject}.to raise_error(described_class::FetchTranslationJobError)}
    end
  end
end
