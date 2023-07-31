# frozen_string_literal: true

class ProviderClassroomDelegator < SimpleDelegator
  def synced_status(student_attrs)
    return true if synced_user_external_ids.include?(user_external_id(student_attrs))
    return false if unsynced_user_external_ids.include?(user_external_id(student_attrs))

    return nil
  end

  def unsynced_students
    students.where(id: unsynced_users.pluck(:id))
  end

  private def synced_user_external_ids
    @synced_user_external_ids ||=
      provider_classroom_user_class
        .active
        .where(classroom_external_id: classroom_external_id)
        .pluck(:user_external_id)
  end

  private def unsynced_user_external_ids
    @unsynced_user_external_ids ||=
      provider_classroom_user_class
        .deleted
        .where(classroom_external_id: classroom_external_id)
        .pluck(:user_external_id)
  end

  private def provider_classroom_user_class
    return GoogleClassroomUser if google_classroom?
    return CleverClassroomUser if clever_classroom?
    return CanvasClassroomUser if canvas_classroom?
  end

  private def user_external_id(student_attrs)
    return student_attrs['google_id'] if google_classroom?
    return student_attrs['clever_id'] if clever_classroom?
    return User.find(student_attrs['id']).user_external_id(canvas_instance: canvas_instance) if canvas_classroom?
  end

  private def unsynced_users
    return User.where(google_id: unsynced_user_external_ids) if google_classroom?
    return User.where(clever_id: unsynced_user_external_ids) if clever_classroom?
    return User.find_by_canvas_user_external_ids(unsynced_user_external_ids) if canvas_classroom?

    User.none
  end
end
