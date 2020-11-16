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

  validates :changed_record_id, presence: true, if: :needs_a_changed_record_id?
  validates :action, inclusion: ALL_ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES

  def applies_to_single_record?
    ['Concept', 'Topic'].include?(changed_record_type) || !(GENERIC_USER_ACTIONS.include?(action))
  end

  def record_is_for_new_topic?
    # in the cms topics controller, we use nested attributes to create change logs for the topic
    # on create, this causes the validation to fail because there isn't a changed_record_id yet - it gets added after the validations are run
    action != 'Created' && changed_record_type === 'Topic'
  end

  def needs_a_changed_record_id?
    applies_to_single_record? && record_is_for_new_topic?
  end
end
