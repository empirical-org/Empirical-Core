class ProviderClassroom < SimpleDelegator
  def active_student?(student_attrs)
    provider_active_user_ids.include?(provider_user_id(student_attrs))
  end

  private def provider_active_user_ids
    @provider_active_user_ids ||=
      provider_classroom_user_class
        .active
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
end
