require 'newrelic_rpm'
require 'new_relic/agent'

class ActivitySession < ActiveRecord::Base

  include ::NewRelic::Agent

  include Uid
  include Concepts

  default_scope { where(visible: true)}
  belongs_to :classroom_activity
  belongs_to :activity
  has_one :unit, through: :classroom_activity
  has_many :concept_results
  has_many :concepts, -> { uniq }, through: :concept_results

  validate :correctly_assigned, :on => :create


  # ownable :user
  belongs_to :user

  before_create :set_state
  before_save   :set_completed_at
  before_save   :set_activity_id

  after_save    :determine_if_final_score, :update_milestones

  after_commit :invalidate_activity_session_count_if_completed

  around_save   :trigger_events

  # FIXME: do we need the below? if we omit it, may make things faster
  default_scope -> { joins(:activity) }

  scope :completed,  -> { where('completed_at is not null') }
  scope :incomplete, -> { where('completed_at is null').where('is_retry = false') }
  # scope :started_or_better, -> { where("state != 'unstarted'") }
  #
  # scope :current_session, -> {
  #   complete_session   = completed.first
  #   incomplete_session = incomplete.first
  #   (complete_session || incomplete_session)
  # }

  RESULTS_PER_PAGE = 25

  def self.paginate(current_page, per_page)
    offset = (current_page.to_i - 1) * per_page
    limit(per_page).offset(offset)
  end

  def self.with_best_scores
    where(is_final_score: true)
  end

  def self.by_teacher(teacher)
    self.joins(
      " JOIN classroom_activities ca ON activity_sessions.classroom_activity_id = ca.id
        JOIN classrooms_teachers ON ca.classroom_id = classrooms_teachers.classroom_id
        JOIN classrooms ON ca.classroom_id = classrooms.id
      "
    ).where("classrooms_teachers.user_id = ?", teacher.id)
  end

  def self.with_filters(query, filters)
    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.joins(:classroom_activity).where("classroom_activities.unit_id = ?", filters[:unit_id])
    end

    if filters[:section_id].present?
      query = query.joins(activity: :topic).where('topics.section_id IN (?)', filters[:section_id])
    end

    if filters[:topic_id].present?
      query = query.joins(:activity).where('activities.topic_id IN (?)', filters[:topic_id])
    end

    query
  end

  def determine_if_final_score
    return true if (self.percentage.nil? or self.state != 'finished')
    a = ActivitySession.where(classroom_activity: self.classroom_activity, user: self.user, is_final_score: true)
                       .where.not(id: self.id).first
    if a.nil?
      self.update_columns is_final_score: true
    elsif self.percentage > a.percentage
      self.update_columns is_final_score: true
      a.update_columns is_final_score: false
    end
    # return true otherwise save will be prevented
    return true
  end

  def activity
    super || classroom_activity.try(:activity)
  end

  def formatted_due_date
    return nil if self.classroom_activity.nil? or self.classroom_activity.due_date.nil?
    self.classroom_activity.due_date.strftime('%A, %B %d, %Y')
  end

  def formatted_completed_at
    return nil if self.completed_at.nil?
    self.completed_at.strftime('%A, %B %d, %Y')
  end

  def display_due_date_or_completed_at_date
    if self.completed_at.present?
      "#{self.completed_at.strftime('%A, %B %d, %Y')}"
    elsif (self.classroom_activity.present? and self.classroom_activity.due_date.present?)
      "#{self.classroom_activity.due_date.strftime('%A, %B %d, %Y')}"
    else
      ""
    end
  end

  def percentile
    ProficiencyEvaluator.lump_into_center_of_proficiency_band(percentage)
  end

  def percentage_as_percent_prefixed_by_scored
    if percentage.nil?
      "Not completed yet"
    else
      x = (percentage*100).round.to_s + '%'
      "Scored #{x}"
    end
  end

  def percentage_with_zero_if_nil
    ((percentage || 0)*100).round
  end

  def percentage_as_decimal
    percentage.try(:round, 2)
  end

  def percentage_as_percent
    if percentage.nil?
      "no percentage"
    else
      (percentage*100).round.to_s + '%'
    end
  end

  def score
    (percentage*100).round
  end

  def start
    return if state != 'unstarted'
    self.started_at ||= Time.current
    self.state = 'started'
  end

  def data=(input)
    data_will_change!
    self['data'] = self.data.to_h.update(input.except("activity_session"))
  end

  def activity_uid= uid
    self.activity_id = Activity.find_by_uid!(uid).id
  end

  def activity_uid
    activity.try(:uid)
  end

  def completed?
    completed_at.present?
  end

  def grade
    percentage
  end

  def parse_for_results
    all_concept_stats(self)
  end

  alias owner user

  # TODO legacy fix
  def anonymous= anonymous
    self.temporary = anonymous
  end

  def anonymous
    temporary
  end

  def invalidate_activity_session_count_if_completed
    classroom_id = self.classroom_activity&.classroom_id
    if self.state == 'finished' && classroom_id
      $redis.del("classroom_id:#{classroom_id}_completed_activity_count")
    end
  end

  private



  def correctly_assigned
    if self.classroom_activity && (classroom_activity.validate_assigned_student(self.user_id) == false)
      begin
        raise 'Student was not assigned this activity'
      rescue => e
        NewRelic::Agent.notice_error(e)
        errors.add(:incorrectly_assigned, "student was not assigned this activity")
      end
    else
      return true
    end
  end

  def self.search_sort_sql(sort)
    if sort.blank? or sort[:field].blank?
      sort = {
        field: 'student_name',
      }
    end

    if sort[:direction] == 'desc'
      order = 'desc'
    else
      order = 'asc'
    end

    # The matching names for this case statement match those returned by
    # the progress reports ActivitySessionSerializer and used as
    # column definitions in the corresponding React component.
    last_name = "substring(users.name, '(?=\s).*')"

    case sort[:field]
    when 'activity_classification_name'
      "activity_classifications.name #{order}, #{last_name} #{order}"
    when 'student_name'
      "#{last_name} #{order}, users.name #{order}"
    when 'completed_at'
      "activity_sessions.completed_at #{order}"
    when 'activity_name'
      "activities.name #{order}"
    when 'percentage'
      "activity_sessions.percentage #{order}"
    when 'standard'
      "topics.name #{order}"
    end
  end

  def trigger_events
    should_async = state_changed?

    yield # http://stackoverflow.com/questions/4998553/rails-around-callbacks

    return unless should_async

    if state == 'finished'
      FinishActivityWorker.perform_async(self.uid)
    end
  end

  def set_state
    self.state ||= 'unstarted'
    self.data ||= Hash.new
  end

  def set_activity_id
    self.activity_id = classroom_activity.try(:activity_id) if activity_id.nil?
  end

  def set_completed_at
    return true if state != 'finished'
    self.completed_at ||= Time.current
  end

  def update_milestones
    # we check to see if it is finished because the only milestone we're checking for is the copleted idagnostic.
    # at a later date, we might have to update this check in case we want a milestone for sessions being assigned
    # or started.
    if self.state == 'finished'
      UpdateMilestonesWorker.perform_async(self.uid)
    end
  end

end
