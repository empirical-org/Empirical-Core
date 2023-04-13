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
FactoryBot.define do
  factory :canvas_config do
    url { Faker::Internet.url }
    client_id { SecureRandom.hex(12) }
    client_secret { SecureRandom.hex(32) }
  end
end
