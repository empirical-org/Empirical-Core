# frozen_string_literal: true

module CleverIntegration::Creators::Teacher

  def self.run(hash)
    teacher = User.find_or_initialize_by(email: hash[:email])

    teacher.update(
      # necessary to have both due to difference in structure between Clever Library user auth hash and district user auth hash
      clever_id: hash[:clever_id] || hash[:id],
      name: hash[:name],
      role: User::TEACHER
    )

    remove_google_link(teacher)
    teacher
  end

  def self.remove_google_link(teacher)
    return if teacher.google_id.blank?

    teacher.update(google_id: nil)

    SegmentAnalytics.new.track_event_from_string('TEACHER_GOOGLE_AND_CLEVER', teacher.id)
  end
end
