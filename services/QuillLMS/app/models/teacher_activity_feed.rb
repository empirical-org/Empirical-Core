# frozen_string_literal: true

# Usage: TeacherActivityFeed.add(teacher_id, activity_session_id)
# Usage: TeacherActivityFeed.get(teacher_id)
class TeacherActivityFeed < RedisFeed
  KEY = 'teacher-activity-feed-'
  LIMIT = 40

  def key
    KEY
  end

  def limit
    LIMIT
  end

  def hydrate(ids:)
    return [] if ids.empty?

    sessions = ActivitySession
      .includes(:user, :classification, :classroom_unit)
      .where(id: ids)
      .where.not(user_id: nil)
      .where.not(completed_at: nil)
      .select(:id, :user_id, :classroom_unit_id, :activity_id, :percentage, :completed_at)

    # purposely avoiding the SQL sort on the large activity_sessions table
    sessions.sort_by(&:completed_at).reverse.map do |session|
      {
        id: session.id,
        student_name: session.user.name,
        activity_name: session.activity.name,
        unit_id: session.classroom_unit&.unit_id,
        classroom_id: session.classroom_unit&.classroom_id,
        user_id: session.user_id,
        activity_id: session.activity_id,
        score: text_for_score(session.classification.key, session.percentage),
        completed: text_for_completed(session.completed_at)
      }
    end
  end

  # PUSHER_EVENT = 'teacher-activity-feed'
  def callback_on_add(id)
    # TODO: add pusher code for real time updates
    # PusherTrigger.run(key_id, PUSHER_EVENT, hydrate(ids: id).first)
  end

  private def text_for_score(key, percentage)
    return '' unless percentage

    if ActivityClassification.unscored?(key)
      return ActivitySession::COMPLETED
    end

    if percentage >= ProficiencyEvaluator.proficiency_cutoff
      ActivitySession::PROFICIENT
    elsif percentage >= ProficiencyEvaluator.nearly_proficient_cutoff
      ActivitySession::NEARLY_PROFICIENT
    else
      ActivitySession::NOT_YET_PROFICIENT
    end
  end

  # NB, this only works with timestamps (not dates)
  private def text_for_completed(completed_at, now = Time.current.in_time_zone.utc)
    return '' unless completed_at

    diff = (now - completed_at).round.abs

    minutes = diff / 60
    hours = minutes / 60
    days = hours / 24

    if minutes <= 59
      "#{minutes} #{'min'.pluralize(minutes)} ago"
    elsif hours <= 23
      "#{hours} #{'hour'.pluralize(hours)} ago"
    elsif days <= 6
      "#{days} #{'day'.pluralize(days)} ago"
    elsif completed_at.year == now.year
      completed_at.strftime("%b #{completed_at.day.ordinalize}")
    else
      completed_at.strftime("%b #{completed_at.day.ordinalize}, %Y")
    end
  end
end
