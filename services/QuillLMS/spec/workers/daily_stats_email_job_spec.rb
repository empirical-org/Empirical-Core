require 'rails_helper'

describe DailyStatsEmailJob do
  let(:mail) { described_class.new}

  describe '#perform' do
    it 'should send the stats email to the Quill team' do
      # Sidekiq converts variables to strings, so we explicity do that here for testing
      date = Time.now.getlocal('-05:00').yesterday.to_s

      mock_nps_data = ({
        'nps': 100,
        'respondents': [9, 0, 0]
      }).as_json

      allow_any_instance_of(UserMailer).to receive(:get_satismeter_nps_data).and_return(mock_nps_data)
      allow_any_instance_of(UserMailer).to receive(:get_satismeter_comment_data).and_return([])
      allow_any_instance_of(UserMailer).to receive(:get_intercom_data).and_return({})

      stats_email = mail.perform(date)
      last_email = ActionMailer::Base.deliveries.last
      expect(stats_email.to).to eq ["team@quill.org"]
      expect(stats_email).to eq last_email
    end
  end
end
