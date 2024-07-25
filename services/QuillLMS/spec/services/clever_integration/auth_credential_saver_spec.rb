# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::AuthCredentialSaver do
  let(:teacher) { create(:teacher, :signed_up_with_clever) }
  let(:access_token) { 'asfUI213bda2j' }

  subject do
    described_class.run(
      access_token: access_token,
      auth_credential_class: auth_credential_class,
      user: teacher
    )
  end

  context 'Clever Library' do
    let(:auth_credential_class) { CleverLibraryAuthCredential }
    let(:expires_at) { auth_credential_class::EXPIRATION_DURATION.from_now }

    it { expects_new_credentials_are_saved }

    context 'with previous credentials' do
      let!(:previous_credential) { create(:clever_library_auth_credential, user: teacher) }

      it { expects_new_credentials_are_saved }
      it { removes_previous_credentials }
    end
  end

  context 'Clever District' do
    let(:auth_credential_class) { CleverDistrictAuthCredential }
    let(:expires_at) { auth_credential_class::EXPIRATION_DURATION.from_now }

    it { expects_new_credentials_are_saved }

    context 'with previous credentials' do
      let!(:previous_credential) { create(:clever_district_auth_credential, user: teacher) }

      it { expects_new_credentials_are_saved }
      it { removes_previous_credentials }
    end
  end

  def expects_new_credentials_are_saved
    subject
    expect(teacher.auth_credential).to be_a auth_credential_class
    expect(teacher.auth_credential.access_token).to eq access_token
    expect(teacher.auth_credential.expires_at).to be_within(1.minute).of(expires_at)
  end

  def removes_previous_credentials
    subject
    expect(AuthCredential.find_by(id: previous_credential.id)).to eq nil
  end
end
