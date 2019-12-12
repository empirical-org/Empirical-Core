require 'rails_helper'

describe DailyStatsEmailJob do
  let(:mail) { described_class.new}

  describe '#perform' do
    it 'should send the stats email to the Quill team' do
      date = Time.now.getlocal('-05:00').yesterday
      stats_email = mail.perform(date)
      last_email = ActionMailer::Base.deliveries.last
      expect(stats_email.to).to eq ["team@quill.org"]
      expect(stats_email).to eq last_email
    end
  end
end