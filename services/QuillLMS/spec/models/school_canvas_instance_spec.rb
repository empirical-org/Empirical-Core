# frozen_string_literal: true

# == Schema Information
#
# Table name: school_canvas_instances
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  school_id          :bigint           not null
#
# Indexes
#
#  index_school_canvas_instances_on_canvas_instance_id  (canvas_instance_id)
#  index_school_canvas_instances_on_school_id           (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (school_id => schools.id)
#
require 'rails_helper'

RSpec.describe SchoolCanvasInstance, type: :model do
  let(:school_canvas_instance) { create(:school_canvas_instance) }

  it { expect(school_canvas_instance).to be_valid }

  it { should belong_to(:canvas_instance) }
  it { should belong_to(:school) }
end
