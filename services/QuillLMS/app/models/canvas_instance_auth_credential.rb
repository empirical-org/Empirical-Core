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
class CanvasInstanceAuthCredential < ApplicationRecord
  belongs_to :canvas_instance
  belongs_to :auth_credential

  validates :auth_credential_id, uniqueness: true
end
