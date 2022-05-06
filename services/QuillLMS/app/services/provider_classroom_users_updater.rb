# frozen_string_literal: true

class ProviderClassroomUsersUpdater < ApplicationService
  attr_reader :provider_classroom_id, :provider_user_ids, :provider_classroom_user_class

  def initialize(provider_classroom_id, provider_user_ids, provider_classroom_user_class)
    @provider_classroom_id = provider_classroom_id
    @provider_user_ids = provider_user_ids
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
      .where(provider_classroom_id: provider_classroom_id)
      .where(provider_user_id: provider_user_ids)
      .update_all(deleted_at: nil)
  end

  private def update_active_to_deleted
    provider_classroom_user_class
      .active
      .where(provider_classroom_id: provider_classroom_id)
      .where.not(provider_user_id: provider_user_ids)
      .update_all(deleted_at: Time.current)
  end

  private def create_new_active
    provider_classroom_user_class.create_list(provider_classroom_id, new_provider_user_ids)
  end

  private def existing_provider_user_ids
    provider_classroom_user_class
      .where(provider_classroom_id: provider_classroom_id)
      .pluck(:provider_user_id)
  end

  private def new_provider_user_ids
    provider_user_ids - existing_provider_user_ids
  end
end
