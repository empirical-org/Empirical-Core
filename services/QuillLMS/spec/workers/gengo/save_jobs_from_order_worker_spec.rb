# frozen_string_literal: true

require 'rails_helper'

describe Gengo::SaveJobsFromOrderWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:order_id) { "123" }

  it 'calls through to SaveJobsFromOrder' do
    expect(Gengo::SaveJobsFromOrder).to receive(:run).with(order_id)
    worker.perform(order_id)
  end
end
