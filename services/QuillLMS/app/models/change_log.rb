class ChangeLog < ActiveRecord::Base
  RENAMED = 'Renamed'
  UNARCHIVED = 'Unarchived'
  ARCHIVED = 'Archived'
  CREATED = 'Created'

  CONCEPT_ACTIONS = [
    RENAMED,
    'Level 2 updated',
    'Level 1 updated',
    UNARCHIVED,
    ARCHIVED,
    'Rule description updated',
    'Explanation updated',
    CREATED,
    'Replaced'
  ]
  TOPIC_ACTIONS = [
    RENAMED,
    'Level 3 updated',
    UNARCHIVED,
    ARCHIVED,
    CREATED
  ]
  STANDARD_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    'Standard category updated',
    'Standard level updated',
    RENAMED
  ]
  STANDARD_LEVEL_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    RENAMED
  ]
  STANDARD_CATEGORY_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    RENAMED
  ]
  CHANGED_RECORD_TYPES = [
    'Concept',
    'User',
    'Topic',
    'Standard',
    'StandardLevel',
    'StandardCategory'
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
  ALL_ACTIONS = USER_ACTIONS.values + CONCEPT_ACTIONS + TOPIC_ACTIONS + STANDARD_ACTIONS + STANDARD_CATEGORY_ACTIONS + STANDARD_LEVEL_ACTIONS

  belongs_to :changed_record, polymorphic: true
  belongs_to :user
  validates_presence_of :changed_record_type, :user_id, :action

  validates :changed_record_id, presence: true, if: :needs_a_changed_record_id?
  validates :action, inclusion: ALL_ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES

  def applies_to_single_record?
    ['Concept', 'Topic', 'Standard', 'StandardLevel', 'StandardCategory'].include?(changed_record_type) || !(GENERIC_USER_ACTIONS.include?(action))
  end

  def record_is_not_being_created_from_cms?
    # in the cms topics, standards, standard levels, and standard categories controllers, we use nested attributes to create change logs for the topic
    # on create, this causes the validation to fail because there isn't a changed_record_id yet - it gets added after the validations are run
    !(action == CREATED && ['Topic', 'Standard', 'StandardLevel', 'StandardCategory'].include?(changed_record_type))
  end

  def needs_a_changed_record_id?
    applies_to_single_record? && record_is_not_being_created_from_cms?
  end
end
