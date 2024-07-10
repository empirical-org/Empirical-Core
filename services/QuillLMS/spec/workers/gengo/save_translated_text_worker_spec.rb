# frozen_string_literal: true

require 'rails_helper'

describe Gengo::SaveTranslatedTextWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:job_id) { '123' }

  it 'calls through to SaveJobsFromOrder' do
    expect(Gengo::SaveTranslatedText).to receive(:run).with(job_id)
    worker.perform(job_id)
  end
end
