# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::StudentCreator do
  subject { described_class.run(data) }

  let(:user_external_id) { CanvasAccount.build_user_external_id(canvas_instance.id, external_id) }
  let(:canvas_instance) { create(:canvas_instance) }
  let(:external_id) { Faker::Number.number.to_s }
  let(:email) { Faker::Internet.email }
  let(:name) { 'Canvas Student' }

  let(:data) do
    {
      email: email,
      name: name,
      user_external_id: user_external_id
    }
  end

  let(:canvas_account) { subject.canvas_accounts.first }

  it { expect { subject }.to change(User, :count).from(0).to(1) }
  it { expect { subject }.to change(CanvasAccount, :count).from(0).to(1) }

  it { expect(subject.canvas_accounts.count).to eq 1 }

  it { expect(canvas_account.user_external_id).to eq user_external_id }
  it { expect(canvas_account.canvas_instance).to eq canvas_instance }
  it { expect(canvas_account.external_id).to eq external_id }
  it { expect(canvas_account.user).to eq subject }

  it { expect(subject.email).to eq email }
  it { expect(subject.name).to eq name }

  it { expect(subject).to be_student }
end
