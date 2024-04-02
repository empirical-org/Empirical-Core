# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::Webhooks::EarnedCertificateEventHandler do
  include_context 'LearnWorlds Earned Certificate Event Data'

  subject { described_class.run(earned_certificate_event_data) }

  it { expect { subject }.to change { LearnWorldsAccountCourseEvent.earned_certificate.count }.by(1) }
end
