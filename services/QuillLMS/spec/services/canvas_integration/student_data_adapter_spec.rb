# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::StudentDataAdapter do
  subject { described_class.run(canvas_instance_id, student_data) }

  let(:canvas_instance_id) { create(:canvas_instance).id }
  let(:student_data) { create(:canvas_student_payload).deep_symbolize_keys }

  let(:name) { student_data[:name] }
  let(:email) { student_data[:login_id] }
  let(:external_id) { student_data[:id] }
  let(:user_external_id) { CanvasAccount.build_user_external_id(canvas_instance_id, external_id) }

  let(:student_attrs) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  it { expect(subject).to eq student_attrs }

  context 'with uppercase email' do
    before { student_data[:login_id] = email.upcase }

    it { expect(subject).to eq student_attrs }
  end

  context 'with invalid email' do
    let(:email) { nil }

    before { student_data[:login_id] = 'not-a-valid-email' }

    it { expect(subject).to eq student_attrs }
  end
end

