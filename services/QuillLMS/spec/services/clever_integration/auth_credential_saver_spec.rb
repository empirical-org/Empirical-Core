# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::AuthCredentialSaver do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:access_token) { 'asfUI213bda2j'}
  let(:expires_at) { AuthCredential::CLEVER_EXPIRATION_DURATION.from_now }

  subject { described_class.run(teacher, access_token, provider) }

  context 'Clever Library' do
    let(:provider) { AuthCredential::CLEVER_LIBRARY_PROVIDER }

    it { expects_new_credentials_are_saved }
    it { purges_expired_auth_credentials }

    context 'with previous credentials' do
      let!(:previous_credential) { create(:clever_library_auth_credential, user: teacher) }

      it { expects_new_credentials_are_saved }
      it { removes_previous_credentials }
    end
  end

  context 'Clever District' do
    let(:provider) { AuthCredential::CLEVER_DISTRICT_PROVIDER }

    it { expects_new_credentials_are_saved }
    it { purges_expired_auth_credentials }

    context 'with previous credentials' do
      let!(:previous_credential) { create(:clever_district_auth_credential, user: teacher) }

      it { expects_new_credentials_are_saved }
      it { removes_previous_credentials }
    end
  end

  def expects_new_credentials_are_saved
    subject
    expect(teacher.auth_credential.provider).to eq provider
    expect(teacher.auth_credential.access_token).to eq access_token
    expect(teacher.auth_credential.expires_at).to be_within(1.minute).of(expires_at)
  end

  def purges_expired_auth_credentials
    Sidekiq::Testing.inline! do
      subject
      expect(teacher.auth_credential).not_to be_nil
      teacher.reload

      Timecop.travel(expires_at) { expect(teacher.auth_credential).to be_nil }
    end
  end

  def removes_previous_credentials
    subject
    expect(AuthCredential.find_by(id: previous_credential.id)).to eq nil
  end
end
