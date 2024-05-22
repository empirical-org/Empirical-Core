# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_configs
#
#  id                 :bigint           not null, primary key
#  client_secret      :text             not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  client_id          :text             not null
#
# Indexes
#
#  index_canvas_configs_on_canvas_instance_id  (canvas_instance_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
class CanvasConfig < ApplicationRecord
  encrypts :client_id, :client_secret

  belongs_to :canvas_instance
end
