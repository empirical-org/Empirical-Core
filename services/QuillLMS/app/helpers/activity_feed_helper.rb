module ActivityFeedHelper

  def data_for_activity_feed(teacher)
    classroom_ids = teacher.classrooms_teachers.pluck(:id)
    classroom_unit_ids = ClassroomUnit.where(classroom_id: classroom_ids).pluck(:id)

    return [] if classroom_unit_ids.none?

    activity_sessions = ActivitySession.joins(:user, :activity, :classification).select('activity_sessions.id, users.name AS "student_name", activities.name AS "activity_name", activity_classifications.key, percentage, completed_at').where("completed_at IS NOT NULL AND classroom_unit_id = ANY(ARRAY[?])", classroom_unit_ids).order("completed_at DESC").limit(40)
    activity_sessions.map do |as|
      {
        id: as.id,
        student_name: as.student_name,
        activity_name: as.activity_name,
        score: text_for_score(as.key, as.percentage),
        completed: text_for_completed(as.completed_at)
      }
    end
  end

  def text_for_score(key, percentage)
    if [ActivityClassification::DIAGNOSTIC_KEY, ActivityClassification::LESSONS_KEY].include?(key)
      ActivitySession::COMPLETED
    elsif percentage >= ProficiencyEvaluator.proficiency_cutoff
      ActivitySession::PROFICIENT
    elsif percentage >= ProficiencyEvaluator.nearly_proficient_cutoff
      ActivitySession::NEARLY_PROFICIENT
    else
      ActivitySession::NOT_YET_PROFICIENT
    end
  end

  def text_for_completed(completed_at)
    now = Time.now().in_time_zone.utc
    diff = (now - completed_at).round.abs

    minutes = diff / 60
    hours = minutes / 60
    days = hours / 24

    if minutes <= 59
      "#{minutes} min#{minutes == 1 ? '' : 's'} ago"
    elsif hours <= 23
      "#{hours} hour#{hours == 1 ? '' : 's'} ago"
    elsif days <= 6
      "#{days} day#{days == 1 ? '' : 's'} ago"
    elsif completed_at.year == now.year
      completed_at.strftime("%b #{completed_at.day.ordinalize}")
    else
      completed_at.strftime("%b #{completed_at.day.ordinalize}, %Y")
    end
  end

end
