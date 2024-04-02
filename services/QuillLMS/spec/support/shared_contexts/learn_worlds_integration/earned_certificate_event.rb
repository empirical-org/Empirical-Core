# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Earned Certificate Event' do
  include_context 'LearnWorlds Earned Certificate Event Data'

  let(:earned_certificate_event) do
    {
      "version" => 2,
      "type" => "awardedCertificate",
      "trigger" => "certificate_awarded",
      "school_id" => "60004a6de11ac0798538ccc2",
      "data" => earned_certificate_event_data
    }
  end
end
