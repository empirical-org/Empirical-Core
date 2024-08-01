# frozen_string_literal: true

require 'rails_helper'
RSpec.describe Gengo::SaveTranslatedText, type: :service do
  describe 'run' do
    subject { described_class.run(job_id) }

    let(:status) { 'available' }
    let(:order_id) { '123' }
    let(:job_id) { '124' }
    let(:english_text_id) { '1493' }
    let(:locale) { Translatable::DEFAULT_LOCALE }
    let(:job_payload) do
      { 'job_id' => job_id,
        'order_id' => order_id,
        'slug' => english_text_id,
        'body_src' =>
              '<p>Use to + an action word (<em>to go</em>, <em>to eat</em>, <em>to love</em>) before a group of words to tell more about something. </p><br/><p>In this example, <em>to go on a trip</em> tells more about why I saved up money. </p>',
        'lc_src' => 'en',
        'lc_tgt' => locale,
        'unit_count' => '37',
        'tier' => 'standard',
        'credits' => '1.85',
        'currency' => 'USD',
        'status' => status,
        'eta' => -1,
        'type' => 'text',
        'ctime' => 1718145667,
        'services' => ['translation'],
        'auto_approve' => '0',
        'position' => 0,
        'file_download_ready' => false,
        'translator_ids' => ['1'] }
    end

    let(:response_job) { job_payload }
    let(:response) do
      { 'opstat' => 'ok',
        'response' =>
          { 'job' => response_job } }
    end

    before do
      allow(GengoAPI).to receive(:getTranslationJob).and_return(response)
    end

    it { expect { subject }.to change { GengoJob.where(english_text_id:, locale:, translation_job_id: job_id).count }.by(1) }

    context 'the gengo_job already exists in our database' do
      let(:translated_text_id) { nil }
      let(:gengo_job) { create(:gengo_job, translation_job_id: job_id, translated_text_id:) }

      before { gengo_job }

      it { expect { subject }.to not_change(GengoJob, :count) }

      context 'the gengo_job already has a translation' do
        let(:translated_text) { create(:gengo_translated_text) }
        let(:translated_text_id) { translated_text.id }

        it do
          expect(GengoAPI).not_to receive(:getTranslationJob)
          subject
        end

        it do
          expect { subject }.to not_change(TranslatedText, :count)
            .and not_change(gengo_job, :translated_text_id)
        end
      end

      context 'the gengo job does not have a translation' do
        context 'the response status is available' do
          let(:status) { 'available' }

          it { expect { subject }.to not_change(TranslatedText, :count) }

          context 'gengo payload contains translated text' do
            let(:translation) { 'Usa una letra mayuscula para indicar que es un nombre.' }
            let(:response_job) do
              job_payload.merge({ 'body_tgt' => translation })
            end

            it { expect { subject }.to change(TranslatedText, :count).by(1) }

            it do
              expect { subject }.to change { TranslatedText.where(translation:, source_api: Translatable::GENGO_SOURCE).count }
                .from(0)
                .to(1)
            end

            it do
              translated_text = create(:gengo_translated_text, translation:)
              expect(TranslatedText).to receive(:create).and_return(translated_text)
              expect { subject }.to change { gengo_job.reload.translated_text_id }.to(translated_text.id)
            end
          end
        end

        context 'the response status is deleted' do
          let(:status) { 'deleted' }

          it 'does not save the translated text' do
            expect { subject }
              .not_to change(TranslatedText, :count)
          end
        end

        context 'the response status is canceled' do
          let(:status) { 'canceled' }

          it 'does not save the translated text' do
            expect { subject }
              .not_to change(TranslatedText, :count)
          end
        end

        context 'the response is nil' do
          let(:response) { nil }

          it { expect { subject }.to raise_error(described_class::FetchTranslationJobError) }
        end
      end
    end
  end
end
