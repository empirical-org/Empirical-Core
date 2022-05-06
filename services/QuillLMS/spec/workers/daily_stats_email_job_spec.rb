# frozen_string_literal: true

require 'rails_helper'

describe DailyStatsEmailJob do
  let(:job) { described_class.new}

  describe '#perform' do
    it 'should send the stats email' do
      date = Time.current.to_s

      expect(UserMailer).to receive(:daily_stats_email)
        .with(date)
        .and_return(double('mailer', deliver_now!: true))

      job.perform(date)
    end
  end
end
