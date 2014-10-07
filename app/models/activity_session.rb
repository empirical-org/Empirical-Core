class ActivitySession < ActiveRecord::Base

  include Uid

  belongs_to :classroom_activity
  belongs_to :activity
  has_one :unit, through: :classroom_activity

  ownable :user

  before_create :set_state
  before_save   :set_completed_at
  before_save   :set_activity_id
  around_save   :trigger_events

  default_scope -> { joins(:activity).order('activity_sessions.id desc') }

  scope :completed,  -> { where('completed_at is not null').order('completed_at desc') }
  scope :incomplete, -> { where('completed_at is null') }

  scope :current_session, -> {
    complete_session   = completed.first
    incomplete_session = incomplete.first
    (complete_session || incomplete_session)
  }

  after_save do
    StudentProfileCache.invalidate(user)
  end

  def activity
    super || classroom_activity.activity
  end

  def classroom
    classroom_chapter.classroom
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
    self.time_spent = (completed_at.to_f - created_at.to_f).to_i
  end

  private

  def trigger_events
    should_async = state_changed?

    yield

    return unless should_async

    if state == 'started'
      StartActivityWorker.perform_async(self.uid)
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
    self.completed_at = Time.now
  end
end
