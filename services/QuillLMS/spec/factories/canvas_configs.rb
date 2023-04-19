# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_configs
#
#  id                       :bigint           not null, primary key
#  client_id_ciphertext     :text             not null
#  client_secret_ciphertext :text             not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  canvas_instance_id       :bigint           not null
#
# Indexes
#
#  index_canvas_configs_on_canvas_instance_id  (canvas_instance_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
FactoryBot.define do
  factory :canvas_config do
    client_id { SecureRandom.hex(12) }
    client_secret { SecureRandom.hex(32) }
    canvas_instance
  end
end
