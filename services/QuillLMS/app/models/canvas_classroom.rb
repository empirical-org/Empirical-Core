# frozen_string_literal: true

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
class CanvasClassroom < ProviderClassroom
  class InvalidClassroomExternalIdFormatError < StandardError; end

  VALID_CLASSROOM_EXTERNAL_ID_FORMAT = /\A\d+:\d+\z/

  belongs_to :canvas_instance
  belongs_to :classroom

  def self.build_classroom_external_id(canvas_instance_id, external_id)
    [canvas_instance_id, external_id].join(':')
  end

  def self.custom_find_by_classroom_external_id(classroom_external_id)
    return nil unless valid_classroom_external_id_format?(classroom_external_id)

    canvas_instance_id, external_id = unpack_classroom_external_id!(classroom_external_id)

    find_by(canvas_instance_id: canvas_instance_id, external_id: external_id)
  end

  def self.unpack_classroom_external_id!(classroom_external_id)
    raise InvalidClassroomExternalIdFormatError unless valid_classroom_external_id_format?(classroom_external_id)

    classroom_external_id.split(':')
  end

  def self.valid_classroom_external_id_format?(classroom_external_id)
    classroom_external_id&.match?(VALID_CLASSROOM_EXTERNAL_ID_FORMAT)
  end

  def classroom_external_id
    self.class.build_classroom_external_id(canvas_instance_id, external_id)
  end
end
