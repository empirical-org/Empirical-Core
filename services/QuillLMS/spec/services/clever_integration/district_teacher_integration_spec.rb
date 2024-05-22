# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictTeacherIntegration do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:district_id) { '1abcdefg'}
  let(:district) { create(:district, clever_id: district_id) }
  let(:auth_credential_class) { CleverDistrictAuthCredential }

  subject { described_class.run(teacher, district_id) }

  it do
    expect(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district)
    expect(CleverIntegration::Importers::School).to receive(:run).with(teacher, district.token)

    expect(CleverIntegration::AuthCredentialSaver)
      .to receive(:run)
      .with(
        access_token: district.token,
        auth_credential_class: auth_credential_class,
        user: teacher
      )

    subject

    expect(teacher.districts).to eq [district]
  end

  context 'nil district' do
    let(:district) { nil }

    before { expect(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district) }

    it { expect { subject }.to raise_error described_class::NilDistrictError }
  end
end
