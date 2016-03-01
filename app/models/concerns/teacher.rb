module Teacher
  extend ActiveSupport::Concern
  TRIAL_LIMIT = 250
  TRIAL_START_DATE = Date.parse('1-9-2015') # September 1st 2015

  included do
    # has_many :classrooms, foreign_key: 'teacher_id'
    #has_many :students, through: :classrooms
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

  def scorebook_scores(current_page=1, classroom_id=nil, unit_id=nil, begin_date=nil, end_date=nil)
    Scorebook::Query.new(self).query(current_page, classroom_id, unit_id, begin_date, end_date)
  end

  def update_teacher params
    return if !self.teacher?
    params.permit(:id,
                  :name,
                  :role,
                  :username,
                  :email,
                  :password,
                  :school_options_do_not_apply,
                  :school_id,
                  :original_selected_school_id)

    self.validate_username = true

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
      .where("subscriptions.account_limit >= ?", self.students.count)
      .any?
  end

  def teacher_subscription
    subscriptions
      .where("subscriptions.expiration >= ?", Date.today)
      .first
      .account_type
  end

  def part_of_admin_account?
    admin_accounts.any?
  end

  def is_trial_expired?
    subscriptions
      .where("subscriptions.expiration < ?", Date.today)
      .any?
  end

  def teachers_activity_sessions_since_trial_start_date
    ActivitySession.where(user: self.students)
                   .where("completed_at >= ?", TRIAL_START_DATE)
  end

  def eligible_for_trial?
    premium_state == 'none'
  end

  def trial_days_remaining
    valid_subscription = subscriptions.where("subscriptions.expiration >= ?", Date.today).first
    if valid_subscription && (valid_subscription.account_type == 'trial')
      (valid_subscription.expiration - Date.today).to_i
    else
      nil
    end
  end

  def premium_updated_or_created_today?
    subscriptions.where("created_at >= ? OR updated_at >= ?", Time.zone.now.beginning_of_day, Time.zone.now.beginning_of_day).any?
  end

  def premium_state
    # the beta period is obsolete -- but may break things by removing it
    if !is_beta_period_over?
      "beta"
    elsif is_premium?
      ## returns 'trial' or 'paid'
      subscriptions.where("subscriptions.expiration >= ?", Date.today).first.account_type
    elsif part_of_admin_account?
      'school'
    elsif is_trial_expired?
      "locked"
    else
      'none'
    end
  end



  def is_beta_period_over?
    Date.today >= TRIAL_START_DATE
  end


end
