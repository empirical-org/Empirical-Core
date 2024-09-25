# frozen_string_literal: true

require 'rails_helper'

module VitallyIntegration
  describe UnignoreOrganization do
    subject { described_class.run(district.id) }

    let(:district) { create(:district) }
    let(:api_double) { double }
    let(:expected_payload) do
      {
        externalId: district.id.to_s,
        name: district.name,
        traits: {
          unignore_org: true
        }
      }
    end

    before { allow(RestApi).to receive(:new).and_return(api_double) }

    it do
      expect(api_double).to receive(:create)
        .with(RestApi::ENDPOINT_ORGANIZATIONS, expected_payload)
      subject
    end
  end
end
