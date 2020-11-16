class ChangeLog < ActiveRecord::Base
  CONCEPT_ACTIONS = [
    'Renamed',
    'Level 2 updated',
    'Level 1 updated',
    'Unarchived',
    'Archived',
    'Rule description updated',
    'Explanation updated',
    'Created',
    'Replaced'
  ]
  TOPIC_ACTIONS = [
    'Renamed',
    'Level 3 updated',
    'Unarchived',
    'Archived',
    'Created'
  ]
  CHANGED_RECORD_TYPES = [
    'Concept',
    'User',
    'Topic'
  ]
  USER_ACTIONS = {
    index: 'Visited User Directory',
    search: 'Searched Users',
    sign_in: 'Impersonated User',
    show: 'Visited User Admin Page',
    edit: 'Visited User Edit Page',
    update: 'Edited User'
  }
  GENERIC_USER_ACTIONS = [
    'Visited User Directory',
    'Searched Users'
  ]
  ALL_ACTIONS = USER_ACTIONS.values + CONCEPT_ACTIONS + TOPIC_ACTIONS

  belongs_to :changed_record, polymorphic: true
  belongs_to :user
  validates_presence_of :changed_record_type, :user_id, :action

  validates :changed_record_id, presence: true, if: :applies_to_single_record?
  validates :action, inclusion: ALL_ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES

  def applies_to_single_record?
    ['Concept', 'Topic'].include?(changed_record_type) || !(GENERIC_USER_ACTIONS.include?(action))
  end
end
