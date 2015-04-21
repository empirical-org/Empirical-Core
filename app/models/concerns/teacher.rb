module Teacher
  extend ActiveSupport::Concern
  SCORES_PER_PAGE = 200

  included do
    has_many :classrooms, foreign_key: 'teacher_id'
    has_many :students, through: :classrooms
  end

  class << self
    delegate :first, :find, :where, :all, :count, to: :scope

    def scope
      User.where(role: 'teacher')
    end
  end

  # Occasionally teachers are populated in the view with
  # a single blank classroom.
  def has_classrooms?
    !classrooms.empty? && !classrooms.all?(&:new_record?)
  end

  def scorebook_scores current_page=1, classroom_id=nil, unit_id=nil, begin_date=nil, end_date=nil

    if classroom_id.present?
      users = Classroom.find(classroom_id).students
    else
      users = classrooms.map(&:students).flatten.compact.uniq
    end

    results = ActivitySession.select("users.name, activity_sessions.id, activity_sessions.percentage,
                                #{User.sorting_name_sql}")
                              .includes(:user, :activity => [:classification, :topic => [:section, :topic_category]])
                              .references(:user)
                              .where(user: users)
                              .where('(activity_sessions.is_final_score = true) or ((activity_sessions.completed_at IS NULL) and activity_sessions.is_retry = false)')

    if unit_id.present?
      classroom_activity_ids = Unit.find(unit_id).classroom_activities.map(&:id)
      results = results.where(classroom_activity_id: classroom_activity_ids)
    end

    if (begin_date.present? or end_date.present?) then results = results.where("activity_sessions.completed_at IS NOT NULL") end

    if begin_date.present? then results = results.where("activity_sessions.completed_at > ?", (begin_date.to_date - 1.day)) end
    if end_date.present?   then results = results.where("activity_sessions.completed_at < ?", (end_date.to_date + 1.day) ) end

    results = results.order('sorting_name, activity_sessions.completed_at, activity_sessions.id')
                      .limit(SCORES_PER_PAGE)
                      .offset( (current_page -1 )*SCORES_PER_PAGE)

    is_last_page = (results.length < SCORES_PER_PAGE)

    x1 = results.group_by(&:user_id)

    x2 = []
    x1.each do |user_id, scores|
      split_scores = scores.partition{|s| s.completed_at.present? }
      those_completed = split_scores[0]
      those_not_completed   = split_scores[1]

      those_completed.sort_by!{|s| s.completed_at}
      those_not_completed.sort_by!{|s| (s.classroom_activity.present? and s.classroom_activity.due_date.present?) ? s.classroom_activity.due_date : (Date.today - 10000)}

      scores = those_completed.concat those_not_completed

      formatted_scores = scores.map do |s|
        {
          id: s.id,
          percentage: s.percentage,
          due_date_or_completed_at_date: s.display_due_date_or_completed_at_date,
          activity: (ActivitySerializer.new(s.activity)).as_json(root: false)
        }
      end
      ele = {
        user: User.find(user_id),
        results: formatted_scores
      }
      x2.push ele
    end

    x2 = x2.sort_by{|x2| x2[:user].sorting_name}
    all = x2

    [all, is_last_page]
  end
end