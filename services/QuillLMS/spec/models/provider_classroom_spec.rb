# == Schema Information
#
# Table name: provider_classrooms
#
#  id                 :bigint           not null, primary key
#  type               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint
#  classroom_id       :bigint           not null
#  external_id        :string           not null
#
# Indexes
#
#  index_provider_classrooms_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_classrooms_on_classroom_id        (classroom_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (classroom_id => classrooms.id)
#
require 'rails_helper'

RSpec.describe ProviderClassroom, type: :model do
  it { should belong_to(:classroom) }

  it { should validate_inclusion_of(:type).in_array(described_class::TYPES) }
end
