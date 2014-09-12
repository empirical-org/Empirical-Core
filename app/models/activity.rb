class Activity < ActiveRecord::Base
  include Flags
  include Uid

  belongs_to :classification, class_name: 'ActivityClassification', foreign_key: 'activity_classification_id'
  belongs_to :topic

  has_one :section, through: :topic
  has_one :workbook, through: :section

  has_many :classroom_activities, dependent: :destroy
  has_many :classrooms, through: :classroom_activities

  scope :production, -> {
    where(<<-SQL, :production)
      activities.flags = '{}' OR ? = ANY (activities.flags)
    SQL
  }

  def classification_key= key
    self.classification = ActivityClassification.find_by_key(key)
  end

  def classification_key
    classification.try(:key)
  end

  def form_url
    url = classification.form_url.dup
    url = UriParams.add_param(url, 'uid', uid) if uid.present?
    url
  end

  def module_url activity_session
    url = classification.module_url.dup
    url = UriParams.add_param(url, 'uid', uid) if uid.present?

    if activity_session == :anonymous
      url = UriParams.add_param(url, 'anonymous', true)
    else
      url = UriParams.add_param(url, 'student', activity_session.uid) if uid.present?
      #TODO: this line still raise NotMethodError 
      #url = UriParams.add_param(url, 'access_token', activity_session.access_token)
    end

    url
  end

  # TODO cleanup
  def flag flag = nil
    return super(flag) unless flag.nil?
    flags.first
  end

  def flag= flag
    flag = :archived if flag.to_sym == :archive
    self.flags = [flag]
  end

end
