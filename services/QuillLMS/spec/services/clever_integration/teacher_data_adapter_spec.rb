# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::TeacherDataAdapter do
  include_context 'Clever Teacher auth_hash'

  let(:auth_hash) { library_auth_hash }
  let(:info_hash) { auth_hash.info }
  let(:clever_id) { teacher_clever_id }
  let(:name) { [first_name, last_name].join(' ') }

  subject { described_class.run(info_hash) }

  it { expect(subject).to eq(clever_id: clever_id, email: email, name: name) }

  context 'nil email' do
    let(:email) { nil }

    it { expect { subject }.to raise_error described_class::BlankEmailError }
  end

  context 'empty email' do
    let(:email) { ' ' }

    it { expect { subject }.to raise_error described_class::BlankEmailError }
  end
end
