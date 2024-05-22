# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instance_schools
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  school_id          :bigint           not null
#
# Indexes
#
#  index_canvas_instance_schools_on_canvas_instance_and_school  (canvas_instance_id,school_id) UNIQUE
#  index_canvas_instance_schools_on_canvas_instance_id          (canvas_instance_id)
#  index_canvas_instance_schools_on_school_id                   (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (school_id => schools.id)
#
class CanvasInstanceSchool < ApplicationRecord
  belongs_to :canvas_instance
  belongs_to :school
end
