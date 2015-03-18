class ActivitySession < ActiveRecord::Base

  include Uid

  belongs_to :classroom_activity, touch: true
  belongs_to :activity
  has_one :unit, through: :classroom_activity
  has_many :concept_tag_results

  accepts_nested_attributes_for :concept_tag_results

  ownable :user
  after_save { if user.present? then user.touch end}


  before_create :set_state
  before_save   :set_completed_at
  before_save   :set_activity_id
  before_save   :determine_if_final_score
  around_save   :trigger_events

  default_scope -> { joins(:activity) }

  scope :completed,  -> { where('completed_at is not null') }
  scope :incomplete, -> { where('completed_at is null').where('is_retry = false') }
  scope :started_or_better, -> { where("state != 'unstarted'") }

  scope :current_session, -> {
    complete_session   = completed.first
    incomplete_session = incomplete.first
    (complete_session || incomplete_session)
  }

  # Used as a CTE (common table expression) by other models to get progress report data.
  def self.proficient_sessions_for_progress_report(teacher, filters)
    query = select(<<-SELECT
      activity_sessions.id as activity_session_id,
      activity_sessions.*,
      CASE WHEN activity_sessions.percentage > 0.75 THEN 1 ELSE 0 END as is_proficient
    SELECT
    ).joins(:classroom_activity => :classroom)
      .where("activity_sessions.state = ?", "finished")
      .where("classrooms.teacher_id = ?", teacher.id) # Always by teacher
      .group("activity_sessions.id")

    # Some duplication between here and ConceptTagResult
    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.where("classroom_activities.unit_id = ?", filters[:unit_id])
    end

    if filters[:section_id].present?
      query = query.joins(:activity => :topic).where('topics.section_id IN (?)', filters[:section_id])
    end

    if filters[:topic_id].present?
      query = query.joins(:activity).where('activities.topic_id IN (?)', filters[:topic_id])
    end

    query
  end

  def self.by_teacher(teacher)
    self.joins(:user => :teacher).where(teachers_users: {id: teacher.id})
  end

  def determine_if_final_score
    if self.percentage.present?
      
      a = ActivitySession.where(classroom_activity: self.classroom_activity, user: self.user, is_final_score: true).where.not(id: self.id).where.not(percentage: nil).first
      
      if a.nil?
        self.is_final_score = true
      elsif (self.percentage > a.percentage)
        self.is_final_score = true
        a.update_columns is_final_score: false
      end
    
    end
    # return true otherwise save will be prevented
    true
  end

  def activity
    super || classroom_activity.activity
  end

  def classroom
    unit.classroom
  end

  def percentage_color
    return '' unless completed?
    case percentage
    when 0.75..1.0
      'green'
    when 0.5..0.75
      'yellow'
    when 0.0..0.5
      'red'
    end
  end

  def percentile
    case percentage
    when 0.75..1.0
      1.0
    when 0.5..0.75
      0.75
    when 0.0..0.5
      0.5
    else
      0.0
    end
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

  alias owner user

  # TODO legacy fix
  def anonymous= anonymous
    self.temporary = anonymous
  end

  def anonymous
    temporary
  end

  def owned_by? user
    return true if temporary
    super
  end

  def calculate_time_spent!
    if (time_spent.blank? || time_spent == 0) and completed_at.present? and started_at.present?
      self.time_spent = (completed_at.to_f - started_at.to_f).to_i
    end
  end

  def as_keen
    event_data = {
      event: state,
      uid: uid,
      time_spent: time_spent,
      percentage: percentage,
      percentile: percentile,
      activity: ActivitySerializer.new(activity, root: false),
      event_started: started_at,
      event_finished: completed_at,
      keen: {
        timestamp: started_at
      }
    }

    if user.nil?
      event_data.merge!(anonymous: true)
    else
      event_data.merge!(anonymous: false, student: StudentSerializer.new(user, root: false))
    end

    return event_data
  end

  private

  def trigger_events
    should_async = state_changed?

    yield

    return unless should_async

    if state == 'started'
      StartActivityWorker.perform_async(self.uid, Time.current)
    elsif state == 'finished'
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
    calculate_time_spent!
  end




end
