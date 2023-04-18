# frozen_string_literal: true

# == Schema Information
#
# Table name: school_canvas_configs
#
#  id               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  canvas_config_id :bigint           not null
#  school_id        :bigint           not null
#
# Indexes
#
#  index_school_canvas_configs_on_canvas_config_id  (canvas_config_id)
#  index_school_canvas_configs_on_school_id         (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_config_id => canvas_configs.id)
#  fk_rails_...  (school_id => schools.id)
#
require 'rails_helper'

RSpec.describe SchoolCanvasConfig, type: :model do
  let(:school_canvas_config) { create(:school_canvas_config) }

  it { expect(school_canvas_config).to be_valid }

  it { should belong_to(:canvas_config) }
  it { should belong_to(:school) }
end
