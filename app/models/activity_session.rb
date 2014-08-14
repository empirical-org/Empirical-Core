class ActivitySession < ActiveRecord::Base

  include Uid


  belongs_to :classroom_activity
  belongs_to :activity
  has_one :unit, through: :classroom_activity

  ownable :user

  before_create :set_state
  before_save   :set_completed_at

  default_scope -> { order('activity_sessions.id desc') }

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

  def activity_uid= uid
    self.activity_id = Activity.find_by_uid!(uid).id
  end

  def activity_uid
    activity.try(:uid)
  end

  def completed?
    completed_at.present?
  end

  # TODO
  # Quill main app no longer handles grading. Instead, services put grades
  # to quill. This was the original source:
  #
  # def grade
  #   return self[:grade] unless self[:grade].nil?
  #   return 1.0 if inputs.count == 0
  #   update_column :grade, inputs.map(&:score).inject(:+) / inputs.count
  #   self[:grade]
  # end
  #
  # For legacy reasons we will have it reference percentage:
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

  def access_token
    scope = Doorkeeper::OAuth::Scopes.from_string("")

    unless access_token = Doorkeeper::AccessToken.matching_token_for(classification.oauth_application, user, scope)
      access_token = Doorkeeper::AccessToken.create! \
        application_id: classification.oauth_application.id,
        resource_owner_id: user.id,
        expires_in: Doorkeeper.configuration.access_token_expires_in
    end

    access_token.token
  end

  private

  def set_state
    self.state ||= 'unstarted'
  end

  def set_completed_at
    return true if state != 'finished'
    self.completed_at = Time.now
  end
end
