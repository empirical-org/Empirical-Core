# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherDataAdapter do
  include_context 'Clever Teacher auth_hash'

  subject { described_class.run(info_hash) }

  let(:auth_hash) { library_auth_hash }
  let(:info_hash) { auth_hash.info }
  let(:name) { [first_name, last_name].join(' ') }
  let(:user_external_id) { teacher_clever_id }

  let(:data) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  it { is_expected.to eq data }

  context 'nil email' do
    let(:email) { nil }

    it { expect { subject }.to raise_error described_class::BlankEmailError }
  end

  context 'empty email' do
    let(:email) { ' ' }

    it { expect { subject }.to raise_error described_class::BlankEmailError }
  end
end
