# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instance_auth_credentials
#
#  id                 :bigint           not null, primary key
#  auth_credential_id :bigint           not null
#  canvas_instance_id :bigint           not null
#
# Indexes
#
#  index_canvas_instance_auth_credentials_on_auth_credential_id  (auth_credential_id) UNIQUE
#  index_canvas_instance_auth_credentials_on_canvas_instance_id  (canvas_instance_id)
#
# Foreign Keys
#
#  fk_rails_...  (auth_credential_id => auth_credentials.id)
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
require 'rails_helper'

describe CanvasInstanceAuthCredential, type: :model do
  subject { create(:canvas_instance_auth_credential) }

  it { expect(subject).to be_valid }

  it { should belong_to(:canvas_instance) }
  it { should belong_to(:auth_credential) }

  it { should validate_uniqueness_of(:auth_credential_id) }

  it 'validates database uniqueness constraint of auth_credential_id' do
    expect {
      build(:canvas_instance_auth_credential, auth_credential: subject.auth_credential).save(validate: false)
    }.to raise_error(ActiveRecord::RecordNotUnique)
  end
end

