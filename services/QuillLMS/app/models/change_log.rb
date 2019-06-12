class ChangeLog < ActiveRecord::Base
  ACTIONS = [
    'Renamed',
    'Level 2 updated',
    'Level 1 updated',
    'Unarchived',
    'Archived',
    'Rule description updated',
    'Created',
    'Replaced'
  ]
  CHANGED_RECORD_TYPES = [
    'Concept'
  ]

  belongs_to :changed_record, polymorphic: true
  belongs_to :user
  validates_presence_of :changed_record_type, :changed_record_id, :user_id, :action, :explanation

  validates :action, inclusion: ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES
end
