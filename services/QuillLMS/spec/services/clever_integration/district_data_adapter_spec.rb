# frozen_string_literal: true

require 'rails_helper'

module CleverIntegration
  RSpec.describe DistrictDataAdapter do
    include_context 'Clever District Admin auth_hash'

    subject { described_class.run(auth_hash) }

    let(:district_client) { double(district_name: district_name) }
    let(:district_name) { "#{Faker::Educator.primary_school} District" }

    let(:expected_result) do
      {
        clever_id: district_clever_id,
        name: district_name,
        token: token
      }
    end

    before { allow(DistrictClient).to receive(:new).with(token).and_return(district_client) }

    it { is_expected.to eq(expected_result) }
  end
end
