# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictTeacherIntegration do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:district_id) { '1abcdefg'}
  let(:district) { create(:district, clever_id: district_id) }

  subject { described_class.run(teacher, district_id) }

  it do
    expect(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district)
    expect(CleverIntegration::Importers::School).to receive(:run).with(teacher, district.token)

    subject

    expect(AuthCredential.count).to eq 1
    expect(teacher.districts).to eq [district]
  end

  context 'nil district' do
    let(:district) { nil }

    before { expect(CleverIntegration::Importers::CleverDistrict).to receive(:run).and_return(district) }

    it { expect { subject }.to raise_error described_class::NilDistrictError }
  end
end
