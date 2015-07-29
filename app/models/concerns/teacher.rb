module Teacher
  extend ActiveSupport::Concern
  SCORES_PER_PAGE = 200
  PROGRESS_REPORT_TRIAL_LIMIT = 30
  PROGRESS_REPORT_TRIAL_START_DATE = Date.parse('1-9-2015') # September 1st 2015

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

  def update_teacher params
    return if !self.teacher?
    params.permit(:id,
                  :name,
                  :role,
                  :username,
                  :email,
                  :password,
                  :password_confirmation,
                  :school_options_do_not_apply,
                  :school_id,
                  :original_selected_school_id)

    self.validate_username = true
    self.require_password_confirmation_when_password_present = true

    are_there_school_related_errors = false
    if params[:school_options_do_not_apply] == 'false'
      if params[:school_id].nil? or params[:school_id].length == 0
        are_there_school_related_errors = true
      else
        if !(params[:original_selected_school_id].nil? or params[:original_selected_school_id].length == 0)
          if params[:original_selected_school_id] != params[:school_id]
            self.schools.delete(School.find(params[:school_id])) # this will not destroy the school, just the assocation to this user
          end
        end
        (self.schools << School.find(params[:school_id])) unless self.schools.where(id: params[:school_id]).any?
      end
    end

    if !are_there_school_related_errors
      if self.update_attributes(username: params[:username],
                                        email: params[:email],
                                        name: params[:name],
                                        password: params[:password],
                                        password_confirmation: params[:password_confirmation],
                                        role: params[:role])
        are_there_non_school_related_errors = false
      else
        are_there_non_school_related_errors = true
      end
    end


    if are_there_school_related_errors
      response = {errors: {school: "can't be blank"}}
    elsif are_there_non_school_related_errors
      response = {errors: self.errors}
    else
      response = self
    end
    response
  end

  def is_premium?
    subscriptions
      .where("subscriptions.expiration >= ?", Date.today)
      .where("subscriptions.account_limit >= ?", self.my_students.length)
      .any?
  end

  def my_students
    User.joins("JOIN classrooms ON users.classcode = classrooms.code")
        .joins("JOIN users AS teachers ON teachers.id = classrooms.teacher_id")
        .where("teachers.id = ?", self.id)
  end

  def is_trial_expired?
    # extracted logic into below helper so that we can test the functionality in a way thats agnostic to the constants
    self.is_trial_expired_helper(PROGRESS_REPORT_TRIAL_START_DATE, PROGRESS_REPORT_TRIAL_LIMIT)
  end

  def is_trial_expired_helper trial_start_date, trial_limit
    acss = self.teachers_activity_sessions_since_date(trial_start_date)
    acss.count > trial_limit
  end

  def teachers_activity_sessions_since_date date
    ActivitySession.where(user: self.my_students)
                   .where("completed_at >= ?", date)
  end
end
