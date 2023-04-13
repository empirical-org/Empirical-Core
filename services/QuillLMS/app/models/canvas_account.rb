# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_accounts
#
#  id               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  canvas_config_id :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_canvas_accounts_on_canvas_config_id  (canvas_config_id)
#  index_canvas_accounts_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_config_id => canvas_configs.id)
#  fk_rails_...  (user_id => users.id)
#
class CanvasAccount < ApplicationRecord
  belongs_to :canvas_config
  belongs_to :user
end
