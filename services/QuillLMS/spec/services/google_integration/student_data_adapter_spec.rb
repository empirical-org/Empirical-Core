# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe StudentDataAdapter do
    subject { described_class.run(student) }

    let(:profile) { create(:google_classroom_api_user_profile) }
    let(:student) { create(:google_classroom_api_student, user_id: profile.id, profile: profile) }

    let(:expected_result) do
      {
          email: profile.email_address.downcase,
          first_name: profile.name.given_name,
          last_name: profile.name.family_name,
          name: profile.name.full_name,
          user_external_id: profile.id
      }
    end

    it { is_expected.to eq expected_result }

    context 'with uppercase email' do
      before { student.profile.email_address = profile.email_address.upcase }

      it { is_expected.to eq expected_result }
    end
  end
end
