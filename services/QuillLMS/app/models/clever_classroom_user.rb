# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  provider_classroom_id :string           not null
#  provider_user_id      :string           not null
#
# Indexes
#
#  index_provider_classroom_users_on_provider_classroom_id    (provider_classroom_id)
#  index_provider_classroom_users_on_provider_user_id         (provider_user_id)
#  index_provider_user_id_and_provider_classroom_id_and_type  (provider_user_id,provider_classroom_id,type) UNIQUE
#
class CleverClassroomUser < ProviderClassroomUser
  def clever_classroom_id
    provider_classroom_id
  end

  def clever_user_id
    provider_user_id
  end
end
