# frozen_string_literal: true

# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_type_and_classroom_id_and_user_id  (type,classroom_external_id,user_external_id) UNIQUE
#
class CanvasClassroomUser < ProviderClassroomUser
  def canvas_classroom_id
    classroom_external_id
  end

  def canvas_user_id
    user_external_id
  end
end
