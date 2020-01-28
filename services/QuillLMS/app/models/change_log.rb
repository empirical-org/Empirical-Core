class ChangeLog < ActiveRecord::Base
  ACTIONS = [
    'Renamed',
    'Level 2 updated',
    'Level 1 updated',
    'Unarchived',
    'Archived',
    'Rule description updated',
    'Created',
    'Replaced',
    'Visited User Directory',
    'Searched Users',
    'Ghosted User',
    'Visited User Admin Page',
    'Visited User Edit Page',
    'Edited User'
  ]
  GENERIC_ACTIONS = [
    'Visited User Directory',
    'Searched Users'
  ]
  CHANGED_RECORD_TYPES = [
    'Concept',
    'User'
  ]

  belongs_to :changed_record, polymorphic: true
  belongs_to :user
  validates_presence_of :changed_record_type, :user_id, :action, :explanation

  validates :changed_record_id, presence: true, if: :applies_to_single_record?
  validates :action, inclusion: ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES

  def applies_to_single_record?
    changed_record_type == 'Concept' || !(GENERIC_ACTIONS.include?(action))
  end
end
