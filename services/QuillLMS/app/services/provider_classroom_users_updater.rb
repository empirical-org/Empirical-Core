# frozen_string_literal: true

class ProviderClassroomUsersUpdater < ApplicationService
  attr_reader :classroom_external_id, :user_external_ids, :provider_classroom_user_class

  def initialize(classroom_external_id, user_external_ids, provider_classroom_user_class)
    @classroom_external_id = classroom_external_id
    @user_external_ids = user_external_ids
    @provider_classroom_user_class = provider_classroom_user_class
  end

  def run
    update_deleted_to_active
    update_active_to_deleted
    create_new_active
  end

  private def update_deleted_to_active
    provider_classroom_user_class
      .deleted
      .where(classroom_external_id: classroom_external_id)
      .where(user_external_id: user_external_ids)
      .update_all(deleted_at: nil)
  end

  private def update_active_to_deleted
    provider_classroom_user_class
      .active
      .where(classroom_external_id: classroom_external_id)
      .where.not(user_external_id: user_external_ids)
      .update_all(deleted_at: Time.current)
  end

  private def create_new_active
    provider_classroom_user_class.create_list(classroom_external_id, new_user_external_ids)
  end

  private def existing_user_external_ids
    provider_classroom_user_class
      .where(classroom_external_id: classroom_external_id)
      .pluck(:user_external_id)
  end

  private def new_user_external_ids
    user_external_ids - existing_user_external_ids
  end
end
