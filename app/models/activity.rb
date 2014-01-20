class Activity < ActiveRecord::Base
  belongs_to :classification, class_name: 'ActivityClassification', foreign_key: 'activity_classification_id'
  belongs_to :topic

  has_one :section, through: :topic
  has_one :workbook, through: :section

  has_many :classroom_activities, dependent: :destroy
  has_many :classrooms, through: :classroom_activities

  before_create :create_uid

  def classification_key= key
    self.classification = ActivityClassification.find_by_key(key)
  end

  def classification_key
    classification.try(:key)
  end

  def form_url
    url = classification.form_url.dup
    url = UriParams.add_param(url, 'cid', classification.uid)
    url = UriParams.add_param(url, 'uid', uid) if uid.present?
    url
  end

  def module_url activity_enrollment
    url = classification.module_url.dup
    url = UriParams.add_param(url, 'cid', classification.uid)
    url = UriParams.add_param(url, 'uid', uid) if uid.present?
    url = UriParams.add_param(url, 'student', activity_enrollment.uid) if uid.present?
    url
  end

  def cid
    classification.uid
  end

protected

  def create_uid
    self.uid = SecureRandom.urlsafe_base64
  end
end
