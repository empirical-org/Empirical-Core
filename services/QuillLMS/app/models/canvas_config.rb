# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_configs
#
#  id                       :bigint           not null, primary key
#  client_id_ciphertext     :text             not null
#  client_secret_ciphertext :text             not null
#  url                      :string           not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#
class CanvasConfig < ApplicationRecord
  has_encrypted :client_id, :client_secret

  has_many :canvas_accounts, dependent: :destroy
  has_many :users, through: :canvas_accounts
end
