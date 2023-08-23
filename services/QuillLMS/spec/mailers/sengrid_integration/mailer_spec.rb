# frozen_string_literal: true

require 'rails_helper'

module SendgridIntegration
  RSpec.describe Mailer, type: :mailer do
    describe '#monthly_email_cap_warning' do
      subject { described_class.monthly_email_cap_warning(num_emails_sent) }

      let(:num_emails_sent) { 91_000 }
      let(:to_email) { Faker::Internet.email }
      let(:percent_used) { (100.0 * num_emails_sent / described_class::SENDGRID_MONTHLY_EMAIL_CAP).to_i }
      let(:email_subject) { "Warning: Monthly Email Cap at #{percent_used}%" }

      before do
        stub_const('SendgridIntegration::Mailer::SENDGRID_STATS_EMAIL', to_email)
        stub_const('SendgridIntegration::Mailer::SENDGRID_THRESHOLD_PERCENT', percent_used)
      end

      it { expect(subject.subject).to eq email_subject }
      it { expect(subject.to).to eq [to_email] }
      it { expect(subject.from).to eq [described_class::QUILL_TEAM_EMAIL_ADDRESS] }
    end
  end
end
