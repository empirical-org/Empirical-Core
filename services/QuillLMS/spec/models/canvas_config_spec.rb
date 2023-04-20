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
require 'rails_helper'

RSpec.describe CanvasConfig, type: :model do
  let(:canvas_config) { create(:canvas_config) }

  it { expect(canvas_config).to be_valid }

  it { should belong_to(:canvas_instance) }
end
