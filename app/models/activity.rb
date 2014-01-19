class Activity < ActiveRecord::Base
  belongs_to :classification, class_name: 'ActivityClassification', foreign_key: 'activity_classification_id'
  belongs_to :topic
  has_one :section, through: :topic
  has_one :workbook, through: :section

  has_many :classroom_activities, dependent: :destroy
  has_many :classrooms, through: :classroom_activities

  def classification_key= key
    self.classification = ActivityClassification.find_by_key(key)
  end

  def classification_key
    classification.try(:key)
  end
end
