# frozen_string_literal: true

class ProviderClassroom < SimpleDelegator
  def synced_status(student_attrs)
    return true if provider_active_user_ids.include?(provider_user_id(student_attrs))
    return false if provider_deleted_user_ids.include?(provider_user_id(student_attrs))

    return nil
  end

  def unsynced_students
    students.where(id: unsynced_users.pluck(:id))
  end

  private def provider_active_user_ids
    @provider_active_user_ids ||=
      provider_classroom_user_class
        .active
        .where(provider_classroom_id: provider_classroom_id)
        .pluck(:provider_user_id)
  end

  private def provider_deleted_user_ids
    @provider_deleted_user_ids ||=
      provider_classroom_user_class
        .deleted
        .where(provider_classroom_id: provider_classroom_id)
        .pluck(:provider_user_id)
  end

  private def provider_classroom_id
    return google_classroom_id if google_classroom?
    return clever_id if clever_classroom?
  end

  private def provider_classroom_user_class
    return GoogleClassroomUser if google_classroom?
    return CleverClassroomUser if clever_classroom?
  end

  private def provider_user_id(student_attrs)
    return student_attrs['google_id'] if google_classroom?
    return student_attrs['clever_id'] if clever_classroom?
  end

  private def unsynced_users
    return User.where(google_id: provider_deleted_user_ids) if google_classroom?
    return User.where(clever_id: provider_deleted_user_ids) if clever_classroom?

    User.none
  end
end
