# frozen_string_literal: true

require 'rails_helper'

describe MaterializedViewRefreshWorker, type: :worker do
  let(:worker) { MaterializedViewRefreshWorker.new }

  it 'sends a segment.io event' do
    MaterializedViewRefreshWorker::MATVIEWS.each do |matview|
      expect(ActiveRecord::Base).to receive(:refresh_materialized_view).with(matview)
    end
    worker.perform
  end
end
